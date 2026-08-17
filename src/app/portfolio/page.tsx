import { redirect } from "next/navigation";
import { PortfolioEditor } from "~/app/portfolio/portfolio-editor";
import { createClient } from "~/lib/supabase/server";
import { getPublicPhotoUrl } from "~/lib/supabase/storage";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "name, bio, avatar_path, photos(id, storage_path, caption, position, width, height, created_at)",
    )
    .eq("id", user.id)
    .order("position", { referencedTable: "photos", ascending: true })
    .single();

  const photos = (
    (profile?.photos ?? []) as Array<{
      id: string;
      storage_path: string;
      caption: string;
      width: number;
      height: number;
    }>
  ).map((photo) => ({
    id: photo.id,
    url: getPublicPhotoUrl(photo.storage_path),
    caption: photo.caption,
    width: photo.width,
    height: photo.height,
  }));

  return (
    <PortfolioEditor
      profile={{
        name: profile?.name || "Your Name",
        bio: profile?.bio ?? "",
        avatarUrl: profile?.avatar_path
          ? getPublicPhotoUrl(profile.avatar_path)
          : null,
      }}
      photos={photos}
    />
  );
}
