import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-clay">404</p>
      <h1 className="font-display mt-4 text-5xl">This page has not let down yet.</h1>
      <p className="mt-4 max-w-md text-ink/60">The link may be old or mistyped. Everything we make is in the shop.</p>
      <Button href="/shop" className="mt-8" arrow>Go to the shop</Button>
    </Container>
  );
}
