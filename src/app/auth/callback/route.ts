import { NextResponse } from "next/server";
import { createClient } from "~/lib/supabase/server";
import { usernameSchema } from "~/lib/username";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!existingProfile) {
        const fullName = String(data.user.user_metadata?.full_name ?? "");
        const emailPrefix = data.user.email?.split("@")[0] ?? "";
        const base = slugify(fullName) || slugify(emailPrefix) || "artist";
        const fallbackUsername = `${base}-${data.user.id.slice(0, 6)}`;

        // Password signups stash their chosen username in user metadata
        // (see login/actions.ts) since email confirmation can delay profile
        // creation until now. Google signups have no such metadata and fall
        // back to a generated username.
        const requestedUsername = usernameSchema.safeParse(
          data.user.user_metadata?.username,
        );
        const username = requestedUsername.success
          ? requestedUsername.data
          : fallbackUsername;

        const { error: insertError } = await supabase.from("profiles").insert({
          id: data.user.id,
          username,
          name: fullName,
        });

        if (insertError?.code === "23505") {
          await supabase.from("profiles").insert({
            id: data.user.id,
            username: fallbackUsername,
            name: fullName,
          });
        }
      }

      return NextResponse.redirect(`${origin}/portfolio`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
