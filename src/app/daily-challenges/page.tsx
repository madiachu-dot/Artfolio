import {
  generateArtPrompt,
  refreshPrompt,
} from "~/app/daily-challenges/actions";
import { RefreshButton } from "~/app/daily-challenges/refresh-button";

export const dynamic = "force-dynamic";

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <title>Sparkle</title>
      <path d="M8 1c.6 2.4 1.4 3.6 3.6 4.2-2.2.6-3 1.8-3.6 4.2-.6-2.4-1.4-3.6-3.6-4.2C6.6 4.6 7.4 3.4 8 1Z" />
      <path d="M13 9c.3 1.2.7 1.8 1.8 2.1-1.1.3-1.5.9-1.8 2.1-.3-1.2-.7-1.8-1.8-2.1 1.1-.3 1.5-.9 1.8-2.1Z" />
    </svg>
  );
}

export default async function DailyChallengesPage() {
  const prompt = await generateArtPrompt();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <SparkleIcon className="size-5 text-primary" />
          <h1 className="font-heading text-3xl tracking-tight">Prompts</h1>
        </div>
        <p className="text-muted-foreground">
          A daily art prompt to help beat art block, generated just for you.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-border bg-card p-12 text-center shadow-sm">
        <p className="font-heading text-2xl tracking-tight">{prompt}</p>
        <form action={refreshPrompt}>
          <RefreshButton />
        </form>
      </div>
    </div>
  );
}
