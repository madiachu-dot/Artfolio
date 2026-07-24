export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-5xl tracking-tight">
          Showcase your art, beautifully
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Artfolio is a home for your creative work — build a portfolio, share
          it with the world, and let your art speak for itself.
        </p>
      </div>
    </main>
  );
}
