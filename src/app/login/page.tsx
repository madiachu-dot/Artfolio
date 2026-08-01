"use client";

import { useActionState, useState } from "react";
import { type AuthActionState, signIn, signUp } from "~/app/login/actions";
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
