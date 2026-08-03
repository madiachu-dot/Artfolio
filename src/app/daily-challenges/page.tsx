export default function DailyChallengesPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl tracking-tight">Prompts</h1>
        <p className="text-muted-foreground">
          A daily art prompt to help beat art block, generated just for you.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-12 text-sm text-muted-foreground">
        Coming soon.
      </div>
    </div>
  );
}
