import { Metadata } from "next";
import { LoginPage } from "./LoginPage";

interface LoginRoutePageProps {
  searchParams: Promise<{ message?: string }>;
}

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in or create an account with Supabase email confirmation.",
};

export default async function LoginRoutePage({ searchParams }: LoginRoutePageProps) {
  const { message } = await searchParams;

  return <LoginPage initialMessage={message} />;
}
