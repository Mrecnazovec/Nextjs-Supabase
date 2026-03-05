import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

interface AuthUserClient {
  auth: {
    getUser: () => Promise<{ data: { user: User | null } }>;
  };
}

export async function getCurrentUserFromClient(client: AuthUserClient) {
  const {
    data: { user },
  } = await client.auth.getUser();

  return user;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  return getCurrentUserFromClient(supabase);
}
