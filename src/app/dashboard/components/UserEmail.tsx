import { getCachedUserEmail } from "../lib/getCachedUserEmail";

interface UserEmailProps {
  userId: string;
}

export async function UserEmail({ userId }: UserEmailProps) {
  const email = await getCachedUserEmail(userId);
  return <p className="text-sm text-muted-foreground">Signed in as {email}</p>;
}
