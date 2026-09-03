import { useId } from "react";
import type { VisualKind } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Stylised "studio render" of each Mave product, drawn in SVG so the catalogue
 * stays consistent and crisp at every size. `color` tints the product body.
 */
export function ProductVisual({
  kind,
  color = "#f2ece4",
  className,
  float,
}: {
  kind: VisualKind;
  color?: string;
  className?: string;
  float?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const g = {
    body: `url(#${id}-body)`,
    ink: `url(#${id}-ink)`,
    glass: `url(#${id}-glass)`,
    steel: `url(#${id}-steel)`,
    shadow: `url(#${id}-shadow)`,
    glow: `url(#${id}-glow)`,
    clay: `url(#${id}-clay)`,
    milk: `url(#${id}-milk)`,
  };

  return (
    <svg viewBox="0 0 400 400" className={cn("h-full w-full", float && "animate-float", className)} role="img" aria-hidden>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.35" stopColor={color} />
          <stop offset="1" stopColor={color} />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-ink`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a453c" />
          <stop offset="1" stopColor="#15130f" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="#dfe6e3" stopOpacity="0.55" />
          <stop offset="1" stopColor="#b7c2bc" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f4f1ec" />
          <stop offset="0.3" stopColor="#cfc8bd" />
          <stop offset="0.55" stopColor="#f6f3ee" />
          <stop offset="1" stopColor="#a89f92" />
        </linearGradient>
        <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d99a86" />
          <stop offset="1" stopColor="#8e4a36" />
        </linearGradient>
        <linearGradient id={`${id}-milk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset="1" stopColor="#efe6d6" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#15130f" stopOpacity="0.28" />
          <stop offset="1" stopColor="#15130f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f2c9a8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f2c9a8" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ground shadow */}
      <ellipse cx="200" cy="336" rx="120" ry="18" fill={g.shadow} />

      {kind === "wearable" && (
        <g>
          {/* outer shell: soft teardrop that follows the breast */}
          <path d="M200 74 C262 74, 296 118, 292 178 C288 236, 262 296, 200 312 C138 296, 112 236, 108 178 C104 118, 138 74, 200 74 Z" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          {/* highlight */}
          <path d="M150 104 C170 86, 230 86, 250 104 C232 96, 168 96, 150 104 Z" fill="#fff" fillOpacity="0.7" />
          <path d="M126 150 C124 200, 140 250, 170 282" stroke="#fff" strokeOpacity="0.55" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* milk window */}
          <path d="M156 214 C160 262, 240 262, 244 214 L240 238 C236 276, 164 276, 160 238 Z" fill={g.milk} fillOpacity="0.9" />
          <path d="M160 238 C170 232, 230 232, 240 238" stroke="#15130f" strokeOpacity="0.12" strokeWidth="1" fill="none" />
          {/* control */}
          <circle cx="200" cy="164" r="30" fill={g.ink} />
          <circle cx="200" cy="164" r="19" fill="none" stroke="#f7f3ee" strokeOpacity="0.35" strokeWidth="1" />
          <circle cx="200" cy="164" r="4" fill="#f7f3ee" />
          <circle cx="200" cy="140" r="1.6" fill="#b2634b" />
          {/* seam */}
          <path d="M120 176 C150 190, 250 190, 280 176" stroke="#15130f" strokeOpacity="0.1" strokeWidth="1.2" fill="none" />
        </g>
      )}

      {kind === "pump" && (
        <g>
          <rect x="120" y="120" width="160" height="150" rx="34" fill={g.body} stroke="#15130f" strokeOpacity="0.08" />
          <rect x="132" y="132" width="136" height="60" rx="22" fill="#fff" fillOpacity="0.4" />
          <circle cx="200" cy="215" r="30" fill={g.ink} />
          <circle cx="200" cy="215" r="20" fill="none" stroke="#f7f3ee" strokeOpacity="0.5" strokeWidth="1" />
          <path d="M200 200 L200 215" stroke="#f7f3ee" strokeWidth="2" strokeLinecap="round" />
          <circle cx="160" cy="240" r="5" fill="#b2634b" />
          <circle cx="240" cy="240" r="5" fill="#8a9a86" />
          <rect x="84" y="200" width="30" height="100" rx="12" fill={g.glass} stroke="#15130f" strokeOpacity="0.1" />
          <rect x="286" y="200" width="30" height="100" rx="12" fill={g.glass} stroke="#15130f" strokeOpacity="0.1" />
          <rect x="88" y="250" width="22" height="46" rx="8" fill={g.milk} />
          <rect x="290" y="240" width="22" height="56" rx="8" fill={g.milk} />
        </g>
      )}

      {kind === "manual" && (
        <g>
          <path d="M150 90 C150 60, 230 60, 230 90 L222 130 L158 130 Z" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          <path d="M165 130 L215 130 L215 190 L165 190 Z" fill={g.body} />
          <path d="M100 96 C150 108, 190 100, 210 118 L200 134 C180 122, 150 130, 104 118 Z" fill={g.ink} />
          <rect x="158" y="190" width="84" height="120" rx="20" fill={g.glass} stroke="#15130f" strokeOpacity="0.1" />
          <rect x="164" y="240" width="72" height="64" rx="14" fill={g.milk} />
          <rect x="150" y="300" width="100" height="14" rx="7" fill={g.ink} />
        </g>
      )}

      {kind === "collector" && (
        <g>
          <path d="M150 100 C150 70, 250 70, 250 100 L240 130 L160 130 Z" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          <path d="M160 130 L240 130 C270 190, 270 260, 240 300 C220 320, 180 320, 160 300 C130 260, 130 190, 160 130 Z" fill={g.body} fillOpacity="0.9" stroke="#15130f" strokeOpacity="0.08" />
          <path d="M150 220 C150 280, 250 280, 250 220 C250 260, 240 300, 225 308 C200 320, 175 314, 160 300 C150 280, 148 250, 150 220 Z" fill={g.milk} fillOpacity="0.85" />
          <path d="M180 150 C170 200, 172 250, 180 290" stroke="#fff" strokeOpacity="0.8" strokeWidth="6" strokeLinecap="round" />
          <text x="200" y="245" textAnchor="middle" fontSize="11" fill="#15130f" fillOpacity="0.4" fontFamily="sans-serif">60 ml</text>
        </g>
      )}

      {kind === "warmer" && (
        <g>
          <rect x="120" y="120" width="160" height="180" rx="30" fill={g.body} stroke="#15130f" strokeOpacity="0.08" />
          <rect x="135" y="112" width="130" height="150" rx="22" fill={g.glass} stroke="#15130f" strokeOpacity="0.08" />
          <circle cx="200" cy="190" r="52" fill={g.glow} filter={`url(#${id}-soft)`} />
          <rect x="176" y="130" width="48" height="110" rx="14" fill={g.milk} stroke="#15130f" strokeOpacity="0.1" />
          <rect x="184" y="120" width="32" height="18" rx="6" fill={g.ink} />
          <path d="M150 220 Q175 210 200 220 T250 220" stroke="#fff" strokeOpacity="0.9" strokeWidth="2" fill="none" />
          <rect x="150" y="272" width="100" height="16" rx="8" fill="#15130f" fillOpacity="0.85" />
          <circle cx="170" cy="280" r="3" fill="#f2c9a8" />
          <text x="222" y="284" textAnchor="middle" fontSize="10" fill="#f7f3ee" fontFamily="sans-serif" letterSpacing="1">37°</text>
        </g>
      )}

      {kind === "warmer-go" && (
        <g>
          <rect x="150" y="80" width="100" height="230" rx="40" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          <rect x="150" y="80" width="100" height="70" rx="40" fill={g.ink} />
          <rect x="150" y="130" width="100" height="20" fill={g.ink} />
          <circle cx="200" cy="200" r="16" fill="none" stroke="#15130f" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="4" fill="#b2634b" />
          <rect x="165" y="240" width="70" height="3" rx="1.5" fill="#15130f" fillOpacity="0.2" />
          <rect x="165" y="252" width="45" height="3" rx="1.5" fill="#15130f" fillOpacity="0.2" />
        </g>
      )}

      {kind === "cooler" && (
        <g>
          <rect x="140" y="90" width="120" height="230" rx="36" fill={g.steel} stroke="#15130f" strokeOpacity="0.12" />
          <rect x="140" y="90" width="120" height="56" rx="28" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          <rect x="140" y="120" width="120" height="26" fill={g.body} />
          <rect x="140" y="146" width="120" height="6" fill="#15130f" fillOpacity="0.1" />
          <path d="M165 200 L235 200 M165 216 L220 216" stroke="#15130f" strokeOpacity="0.28" strokeWidth="1.5" strokeLinecap="round" />
          <text x="200" y="250" textAnchor="middle" fontSize="11" fill="#15130f" fillOpacity="0.45" fontFamily="sans-serif" letterSpacing="3">MAVE</text>
        </g>
      )}

      {kind === "tote" && (
        <g>
          <path d="M150 120 C150 70, 250 70, 250 120" stroke={g.ink} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M110 140 L290 140 L275 300 C274 312, 264 320, 252 320 L148 320 C136 320, 126 312, 125 300 Z" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          <rect x="110" y="140" width="180" height="26" fill="#15130f" fillOpacity="0.08" />
          <rect x="176" y="220" width="48" height="16" rx="8" fill={g.ink} />
        </g>
      )}

      {kind === "bags" && (
        <g>
          <g transform="rotate(-8 200 210)">
            <rect x="130" y="110" width="140" height="200" rx="16" fill="#fff" fillOpacity="0.8" stroke="#15130f" strokeOpacity="0.12" />
          </g>
          <rect x="140" y="100" width="140" height="210" rx="16" fill={g.milk} stroke="#15130f" strokeOpacity="0.14" />
          <rect x="140" y="100" width="140" height="28" rx="16" fill={g.body} />
          <rect x="140" y="114" width="140" height="14" fill={g.body} />
          <line x1="160" y1="128" x2="260" y2="128" stroke="#15130f" strokeOpacity="0.3" strokeWidth="2" />
          <rect x="160" y="150" width="100" height="1.5" fill="#15130f" fillOpacity="0.2" />
          <rect x="160" y="170" width="70" height="1.5" fill="#15130f" fillOpacity="0.2" />
          <rect x="160" y="190" width="85" height="1.5" fill="#15130f" fillOpacity="0.2" />
          <path d="M150 230 C190 220, 230 240, 270 230 L270 300 C270 306, 264 310, 258 310 L162 310 C156 310, 150 306, 150 300 Z" fill="#fff" fillOpacity="0.7" />
          {[220, 240, 260, 280].map((y) => (
            <text key={y} x="264" y={y} textAnchor="end" fontSize="8" fill="#15130f" fillOpacity="0.45" fontFamily="sans-serif">
              {(y - 200) * 2.5}
            </text>
          ))}
        </g>
      )}

      {kind === "bottles" && (
        <g>
          {[110, 168, 226].map((x, i) => (
            <g key={x}>
              <rect x={x} y={120 + i * 4} width="64" height="190" rx="22" fill={g.glass} stroke="#15130f" strokeOpacity="0.12" />
              <rect x={x + 6} y={190 - i * 20} width="52" height={114 + i * 20} rx="16" fill={g.milk} />
              <rect x={x + 8} y={106 + i * 4} width="48" height="26" rx="10" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
            </g>
          ))}
        </g>
      )}

      {kind === "tray" && (
        <g>
          <path d="M100 200 L300 200 L286 310 L114 310 Z" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          <path d="M100 200 L130 150 L270 150 L300 200 Z" fill="#15130f" fillOpacity="0.06" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={122 + i * 26} y={135 - i * 3} width="18" height="90" rx="4" fill={g.milk} stroke="#15130f" strokeOpacity="0.14" />
          ))}
        </g>
      )}

      {kind === "pads" && (
        <g>
          <path d="M100 200 C100 130, 200 120, 200 200 C200 270, 100 280, 100 200 Z" fill={g.clay} fillOpacity="0.9" />
          <path d="M180 200 C180 130, 300 120, 300 200 C300 270, 180 280, 180 200 Z" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          <circle cx="240" cy="200" r="12" fill="#f7f3ee" />
          <circle cx="150" cy="200" r="12" fill="#f7f3ee" fillOpacity="0.6" />
          <path d="M215 160 C240 150, 265 150, 285 165" stroke="#fff" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )}

      {kind === "balm" && (
        <g>
          <ellipse cx="200" cy="270" rx="90" ry="26" fill={g.body} stroke="#15130f" strokeOpacity="0.12" />
          <rect x="110" y="220" width="180" height="50" fill={g.body} />
          <ellipse cx="200" cy="220" rx="90" ry="26" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          <ellipse cx="200" cy="216" rx="80" ry="22" fill={g.milk} />
          <text x="200" y="222" textAnchor="middle" fontSize="12" fill="#15130f" fillOpacity="0.6" fontFamily="serif" letterSpacing="3">MAVE</text>
          <ellipse cx="200" cy="150" rx="90" ry="26" fill={g.body} stroke="#15130f" strokeOpacity="0.12" transform="translate(70 -20) rotate(-18 200 150)" />
        </g>
      )}

      {kind === "cups" && (
        <g>
          <ellipse cx="150" cy="215" rx="56" ry="28" fill={g.steel} stroke="#15130f" strokeOpacity="0.15" />
          <path d="M94 215 C94 160, 206 160, 206 215" fill={g.steel} stroke="#15130f" strokeOpacity="0.15" />
          <ellipse cx="250" cy="200" rx="56" ry="24" fill="#15130f" fillOpacity="0.06" />
          <path d="M194 200 C194 140, 306 140, 306 200 C306 224, 194 224, 194 200 Z" fill={g.steel} stroke="#15130f" strokeOpacity="0.15" />
          <path d="M215 175 C230 160, 260 158, 285 170" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )}

      {kind === "bra" && (
        <g>
          <path d="M110 150 L120 90 M290 150 L280 90" stroke="#15130f" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
          <path d="M100 150 C100 260, 200 290, 200 210 C200 290, 300 260, 300 150 C300 120, 240 130, 200 170 C160 130, 100 120, 100 150 Z" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          <path d="M100 150 C100 150, 200 210, 300 150" stroke="#15130f" strokeOpacity="0.14" strokeWidth="1.5" fill="none" />
          <circle cx="200" cy="205" r="4" fill="#b2634b" />
        </g>
      )}

      {kind === "kit" && (
        <g>
          <rect x="90" y="250" width="220" height="30" rx="6" fill={g.ink} />
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={i} x1={104 + i * 20} y1="250" x2={104 + i * 20} y2={i % 5 === 0 ? 270 : 262} stroke="#f7f3ee" strokeOpacity="0.8" strokeWidth="1.5" />
          ))}
          {[17, 19, 21, 24, 27].map((mm, i) => (
            <g key={mm}>
              <circle cx={110 + i * 45} cy="170" r={mm / 1.15} fill={g.body} stroke="#15130f" strokeOpacity="0.15" />
              <circle cx={110 + i * 45} cy="170" r={mm / 2.4} fill="#15130f" fillOpacity="0.07" />
              <text x={110 + i * 45} y="222" textAnchor="middle" fontSize="10" fill="#15130f" fillOpacity="0.5" fontFamily="sans-serif">{mm}</text>
            </g>
          ))}
        </g>
      )}

      {kind === "sterilizer" && (
        <g>
          <rect x="100" y="160" width="200" height="150" rx="28" fill={g.body} stroke="#15130f" strokeOpacity="0.1" />
          <path d="M100 190 C100 120, 300 120, 300 190 Z" fill={g.glass} stroke="#15130f" strokeOpacity="0.1" />
          <rect x="100" y="186" width="200" height="8" fill="#15130f" fillOpacity="0.08" />
          <path d="M170 110 C160 96, 180 86, 170 72 M200 106 C190 92, 210 82, 200 68 M230 110 C220 96, 240 86, 230 72" stroke="#15130f" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" fill="none" />
          <rect x="130" y="270" width="140" height="16" rx="8" fill={g.ink} />
          <circle cx="150" cy="278" r="3" fill="#8a9a86" />
        </g>
      )}
    </svg>
  );
}
