import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-start justify-start gap-8 overflow-hidden p-8 pt-20 md:pt-28 md:pl-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_70%_at_top_left,color-mix(in_oklch,var(--color-primary)_45%,transparent),transparent_70%),radial-gradient(ellipse_70%_70%_at_bottom_right,color-mix(in_oklch,var(--color-primary)_35%,transparent),transparent_70%),radial-gradient(ellipse_90%_90%_at_center,color-mix(in_oklch,var(--color-accent)_25%,transparent),transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 items-center justify-center lg:flex"
      >
        <div className="relative h-96 w-96">
          <div className="absolute top-10 left-4 flex h-52 w-44 -rotate-6 flex-col gap-2 rounded-sm border border-black/10 bg-stone-50 p-2 shadow-xl">
            <div className="flex-1 rounded-xs bg-gradient-to-br from-[oklch(0.78_0.05_150)] to-[oklch(0.93_0.025_145)]" />
          </div>
          <div className="absolute top-0 right-2 flex h-44 w-40 rotate-6 flex-col gap-2 rounded-sm border border-black/10 bg-stone-50 p-2 shadow-xl">
            <div className="flex-1 rounded-xs bg-gradient-to-br from-[oklch(0.8_0.04_55)] to-[oklch(0.94_0.02_65)]" />
          </div>
          <div className="absolute bottom-4 left-24 flex h-40 w-44 rotate-2 flex-col gap-2 rounded-sm border border-black/10 bg-stone-50 p-2 shadow-xl">
            <div className="flex-1 rounded-xs bg-gradient-to-br from-[oklch(0.82_0.035_95)] to-[oklch(0.95_0.018_90)]" />
          </div>
        </div>
      </div>
      <div className="flex w-full max-w-2xl flex-col gap-4 sm:gap-6">
        <p className="font-sunshiney text-xl text-muted-foreground sm:text-2xl">
          For artists tired of tinkering
        </p>
        <h1 className="max-w-[14ch] font-heading text-4xl tracking-tight sm:text-5xl md:text-7xl">
          Showcase your <span className="text-primary">art</span>, beautifully
        </h1>
        <p className="max-w-md font-gaegu text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl">
          <span className="font-heading text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
            Art block
          </span>{" "}
          is real, and it's not the only thing standing between you and an
          audience.{" "}
          <span className="font-heading text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
            Artfolio
          </span>{" "}
          gives your work a home worth visiting, so you can stop tinkering and
          start sharing.
        </p>
      </div>
      <div className="mt-auto flex w-full max-w-2xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-muted-foreground">
          Free to start · no credit card
        </span>
        <Button asChild size="lg">
          <Link href="/portfolio">Go to My Portfolio</Link>
        </Button>
      </div>
    </main>
  );
}
