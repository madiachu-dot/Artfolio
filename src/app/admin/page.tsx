import { notFound } from "next/navigation";
import { AdminDashboard } from "~/app/admin/admin-dashboard";
import { env } from "~/env";
import { createClient } from "~/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) {
    notFound();
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, name, created_at, photos(count)")
    .order("created_at", { ascending: false });

  const rows = (profiles ?? []).map((profile) => ({
    id: profile.id,
    username: profile.username,
    name: profile.name,
    createdAt: profile.created_at,
    photoCount: profile.photos[0]?.count ?? 0,
  }));

  return <AdminDashboard initialRows={rows} />;
}
