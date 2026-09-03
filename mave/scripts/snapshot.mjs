/**
 * Produces self-contained, openable HTML snapshots of the exported site.
 *
 * Reads ./out (created by `npm run export`), renders each route in a real
 * browser so the scroll-triggered animations have resolved, then inlines every
 * stylesheet and font and strips the scripts. The result is one HTML file per
 * page that can be opened straight from disk or handed to a reviewer.
 *
 *   npm run export && npm run snapshot
 */
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const OUT = path.resolve("out");
const DEST = path.resolve("snapshots");
const PORT = 4173;

const ROUTES = [
  ["home", "/"],
  ["shop", "/shop"],
  ["product-aura", "/products/aura-wearable-pump"],
  ["collection-cool", "/collections/cool"],
  ["system", "/system"],
  ["about", "/about"],
  ["journal", "/journal"],
  ["journal-article", "/journal/flange-sizing-guide"],
  ["checkout", "/checkout"],
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
};

/** Static server for ./out that understands clean URLs (/shop -> shop.html). */
function serve() {
  const server = createServer(async (req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    const candidates = url.endsWith("/")
      ? [path.join(OUT, url, "index.html"), path.join(OUT, `${url.replace(/\/$/, "")}.html`)]
      : [path.join(OUT, url), path.join(OUT, `${url}.html`), path.join(OUT, url, "index.html")];
    for (const file of candidates) {
      if (existsSync(file) && !file.endsWith("/")) {
        try {
          const body = await readFile(file);
          res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
          return res.end(body);
        } catch {
          /* fall through */
        }
      }
    }
    res.writeHead(404).end("not found");
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

const server = await serve();

/** Playwright may be a local dep or a global install; accept either. */
const loadPlaywright = async () => {
  for (const id of ["playwright", process.env.PLAYWRIGHT_PATH, "/opt/node22/lib/node_modules/playwright/index.mjs"]) {
    if (!id) continue;
    try {
      return id.endsWith(".mjs") ? await import(id) : require(id);
    } catch {
      /* try the next location */
    }
  }
  throw new Error("Playwright not found. Run `npm i -D playwright` or set PLAYWRIGHT_PATH.");
};
const { chromium } = await loadPlaywright();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
await mkdir(DEST, { recursive: true });

const routeToFile = Object.fromEntries(ROUTES.map(([name, route]) => [route, `${name.split("/").pop()}.html`]));

for (const [name, route] of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });

  // Walk the page so every reveal-on-scroll animation settles at its end state.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  // Inline stylesheets, embed fonts as data URIs, drop the scripts.
  const html = await page.evaluate(async (routeToFile) => {
    const cache = new Map();
    const asDataUri = async (url, mime) => {
      if (cache.has(url)) return cache.get(url);
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      let bin = "";
      new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
      const uri = `data:${mime};base64,${btoa(bin)}`;
      cache.set(url, uri);
      return uri;
    };

    /** Replace every url(...woff2) in a stylesheet with an embedded font. */
    const embedFonts = async (css, base) => {
      const refs = [...new Set([...css.matchAll(/url\(([^)]+\.woff2?)\)/g)].map((m) => m[1].replace(/["']/g, "")))];
      for (const ref of refs) {
        css = css.split(ref).join(await asDataUri(new URL(ref, base).href, "font/woff2"));
      }
      return css;
    };

    // External stylesheets become inline <style> blocks.
    for (const link of [...document.querySelectorAll('link[rel="stylesheet"]')]) {
      const css = await embedFonts(await (await fetch(link.href)).text(), link.href);
      const style = document.createElement("style");
      style.textContent = css;
      link.replaceWith(style);
    }
    // Next.js also emits @font-face rules in an inline <style>; embed those too.
    for (const style of [...document.querySelectorAll("style")]) {
      if (style.textContent.includes(".woff")) {
        style.textContent = await embedFonts(style.textContent, document.baseURI);
      }
    }
    // The favicon is the only remaining network reference.
    for (const icon of [...document.querySelectorAll('link[rel~="icon"]')]) {
      icon.href = await asDataUri(icon.href, "image/svg+xml");
    }
    document.querySelectorAll("script, link[rel=preload], link[rel=prefetch], link[rel=modulepreload]").forEach((el) => el.remove());

    // Point links at sibling snapshots so the captured pages browse offline.
    for (const a of [...document.querySelectorAll("a[href]")]) {
      const href = a.getAttribute("href");
      if (!href.startsWith("/")) continue;
      const file = routeToFile[href.split("?")[0].replace(/\/$/, "") || "/"];
      if (file) a.setAttribute("href", file);
      else {
        a.setAttribute("href", "#");
        a.title = `${href} - route not captured in this snapshot set`;
      }
    }

    const banner = document.createComment(
      " Mave storefront - static snapshot of the rendered page. " +
        "Styles and fonts are inlined and scripts removed, so this file opens anywhere. " +
        "Source: mave/src, live app: npm run dev ",
    );
    document.documentElement.prepend(banner);
    return `<!doctype html>\n${document.documentElement.outerHTML}`;
  }, routeToFile);

  await writeFile(path.join(DEST, `${name}.html`), html);
  console.log(`${name.padEnd(18)} ${(html.length / 1024).toFixed(0)} KB  ${route}`);
  await page.close();
}

const index = `<!doctype html>
<meta charset="utf-8"><title>Mave - page snapshots</title>
<style>
  :root { color-scheme: light }
  body { margin:0; padding:48px 32px; background:#f7f3ee; color:#15130f;
         font:16px/1.6 ui-sans-serif, system-ui, sans-serif }
  main { max-width:640px; margin:0 auto }
  h1 { font:500 40px/1.1 Georgia, serif; margin:0 0 8px }
  p { color:#15130fa6; margin:0 0 32px }
  ol { list-style:none; margin:0; padding:0; border-top:1px solid #15130f1a }
  a { display:flex; justify-content:space-between; gap:16px; padding:16px 4px;
      border-bottom:1px solid #15130f1a; color:inherit; text-decoration:none }
  a:hover { background:#efe8df }
  code { color:#b2634b; font-size:13px }
</style>
<main>
  <h1>Mave &mdash; page snapshots</h1>
  <p>Fully rendered HTML with styles and fonts inlined and scripts removed.
     Each file opens on its own; links between these pages work, other routes are inert.</p>
  <ol>
${ROUTES.map(([name, route]) => `    <li><a href="${name}.html"><span>${name.replace(/-/g, " ")}</span><code>${route}</code></a></li>`).join("\n")}
  </ol>
</main>
`;
await writeFile(path.join(DEST, "index.html"), index);

await browser.close();
server.close();
console.log(`\nWrote ${ROUTES.length} snapshots + index.html to ./snapshots`);
