"use client";

import { useActionState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { login, type LoginState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <div className="space-y-2">
        <Label htmlFor="password">Senha da equipe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </div>
      {state.error && (
        <p id="login-error" role="alert" className="text-sm font-medium text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
        Entrar no CRM
      </Button>
    </form>
  );
}
