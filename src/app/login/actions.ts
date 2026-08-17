"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "~/lib/supabase/server";
import { usernameSchema } from "~/lib/username";

export interface AuthActionState {
  error?: string;
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: error.message };
  }

  redirect("/portfolio");
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const usernameResult = usernameSchema.safeParse(formData.get("username"));

  if (!usernameResult.success) {
    return {
      error: usernameResult.error.issues[0]?.message ?? "Invalid username",
    };
  }
  const username = usernameResult.data;

  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ?? `https://${headersList.get("host")}`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) {
    return { error: error.message };
  }
  if (!data.user) {
    return { error: "Check your email to confirm your account, then sign in." };
  }

  if (!data.session) {
    // Email confirmation is required: no session yet, so RLS would reject a
    // profile insert now. The profile is created from the stored username
    // metadata once the user confirms, in the auth callback route.
    return { error: "Check your email to confirm your account, then sign in." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, username });

  if (profileError) {
    if (profileError.code === "23505") {
      return { error: "That username is already taken." };
    }
    return { error: profileError.message };
  }

  redirect("/portfolio");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ?? `https://${headersList.get("host")}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}
