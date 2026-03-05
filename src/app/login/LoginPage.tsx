"use client";

import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { createClient } from "@/lib/supabase/client";
import {
  resendSignUpConfirmation,
  signInWithEmail,
  signUpWithEmail,
} from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { PROTECTED_URL } from "@/config/url.config";
import { z } from "zod";

type Mode = "signin" | "signup";

interface LoginPageProps {
  initialMessage?: string;
}

const authSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must contain at least 6 characters."),
});

type AuthFormValues = z.infer<typeof authSchema>;

export function LoginPage({ initialMessage }: LoginPageProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState<Mode>("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(initialMessage ?? "");
  const [error, setError] = useState("");

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuth = async (values: AuthFormValues) => {
    setError("");
    setMessage("");
    setIsLoading(true);

    if (mode === "signup") {
      const { error: signUpError } = await signUpWithEmail(
        supabase,
        values,
        window.location.origin,
      );

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      setMessage("Registration successful. Check your email to confirm your account.");
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await signInWithEmail(supabase, values);

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    router.replace(PROTECTED_URL.dashboard());
    router.refresh();
    setIsLoading(false);
  };

  const handleResendConfirmation = async () => {
    const email = form.getValues("email");

    if (!email) {
      setError("Enter email first, then click resend confirmation.");
      return;
    }

    setError("");
    setMessage("");
    setIsLoading(true);

    const { error: resendError } = await resendSignUpConfirmation(
      supabase,
      email,
      window.location.origin,
    );

    if (resendError) {
      setError(resendError.message);
      setIsLoading(false);
      return;
    }

    setMessage("A new confirmation email was sent.");
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Supabase Auth</CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Sign in with your email and password."
              : "Create account with email confirmation."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as Mode)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </Tabs>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        minLength={6}
                        autoComplete={
                          mode === "signin" ? "current-password" : "new-password"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? "Please wait..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Sign Up"}
              </Button>
              {mode === "signup" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendConfirmation}
                  disabled={isLoading}
                  className="w-full"
                >
                  Resend confirmation email
                </Button>
              ) : null}
            </form>
          </Form>

          {message ? (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
