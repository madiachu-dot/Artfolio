"use client";

import { useActionState, useState } from "react";
import {
  type AuthActionState,
  signIn,
  signInWithGoogle,
  signUp,
} from "~/app/login/actions";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    initialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState,
  );

  const isSignup = mode === "signup";
  const state = isSignup ? signUpState : signInState;
  const action = isSignup ? signUpAction : signInAction;
  const pending = isSignup ? signUpPending : signInPending;

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">
            {isSignup ? "Create your portfolio" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isSignup
              ? "Pick a username — that's your shareable link."
              : "Sign in to keep editing your portfolio."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form key={mode} action={action} className="flex flex-col gap-4">
            {isSignup && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="jane-draws"
                  required
                  minLength={3}
                  maxLength={30}
                  pattern="[a-zA-Z0-9_-]+"
                  autoComplete="username"
                />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            </div>
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" loading={pending} className="mt-2">
              {isSignup ? "Sign up" : "Sign in"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form action={signInWithGoogle}>
            <Button type="submit" variant="outline" className="w-full">
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                <title>Google</title>
                <path
                  fill="#4285F4"
                  d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A12 12 0 0 0 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4-3.1Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => setMode(isSignup ? "login" : "signup")}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
