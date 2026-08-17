import Image from "next/image";
import Link from "next/link";
import { createClient } from "~/lib/supabase/server";
import { getPublicPhotoUrl } from "~/lib/supabase/storage";

export default async function DiscoverPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, name, avatar_path")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl tracking-tight">Discover</h1>
        <p className="text-muted-foreground">
          Browse portfolios from other artists on Artfolio.
        </p>
      </div>

      {!profiles || profiles.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-12 text-sm text-muted-foreground">
          No portfolios yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {profiles.map((profile) => (
            <Link
              key={profile.username}
              href={`/u/${profile.username}`}
              className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center transition-colors hover:bg-muted"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                {profile.avatar_path ? (
                  <Image
                    src={getPublicPhotoUrl(profile.avatar_path)}
                    alt={profile.name || profile.username}
                    fill
                    sizes="4rem"
                    unoptimized
                    className="object-cover"
                  />
                ) : null}
              </div>
              <span className="font-heading text-lg tracking-tight">
                {profile.name || profile.username}
              </span>
              <span className="text-xs text-muted-foreground">
                @{profile.username}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
