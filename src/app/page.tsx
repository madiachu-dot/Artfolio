import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-8 overflow-hidden p-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -right-20 top-1/3 size-80 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 size-96 rounded-full bg-secondary/50 blur-3xl" />
      </div>
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <p className="font-sunshiney text-2xl text-muted-foreground">
          For artists tired of tinkering
        </p>
        <h1 className="max-w-[14ch] font-heading text-6xl tracking-tight">
          Showcase your <span className="text-primary">art</span>, beautifully
        </h1>
        <p className="max-w-md font-gaegu text-xl text-muted-foreground">
          <span className="font-heading text-2xl text-foreground">
            Art block
          </span>{" "}
          is real, and it's not the only thing standing between you and an
          audience.{" "}
          <span className="font-heading text-2xl text-foreground">
            Artfolio
          </span>{" "}
          gives your work a home worth visiting, so you can stop tinkering and
          start sharing.
        </p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            Free to start · no credit card
          </span>
          <Button asChild size="lg">
            <Link href="/portfolio">Go to My Portfolio</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
