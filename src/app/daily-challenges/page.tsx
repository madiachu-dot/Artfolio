import {
  generateArtPrompt,
  refreshPrompt,
} from "~/app/daily-challenges/actions";
import { Button } from "~/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DailyChallengesPage() {
  const prompt = await generateArtPrompt();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl tracking-tight">Prompts</h1>
        <p className="text-muted-foreground">
          A daily art prompt to help beat art block, generated just for you.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-border p-12 text-center">
        <p className="font-heading text-2xl tracking-tight">{prompt}</p>
        <form action={refreshPrompt}>
          <Button type="submit" variant="outline">
            New Prompt
          </Button>
        </form>
      </div>
    </div>
  );
}
