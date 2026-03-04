import { LoginPage } from "./LoginPage";

interface LoginRoutePageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function LoginRoutePage({ searchParams }: LoginRoutePageProps) {
  const { message } = await searchParams;

  return <LoginPage initialMessage={message} />;
}
