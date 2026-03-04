import { AuthForm } from "./_components/auth-form";

interface LoginPageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { message } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <AuthForm initialMessage={message} />
    </main>
  );
}
