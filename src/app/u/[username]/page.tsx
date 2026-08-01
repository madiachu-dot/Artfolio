import { notFound } from "next/navigation";
import { ProfileGallery } from "~/components/profile-gallery";
import { createClient } from "~/lib/supabase/server";
import { getPublicPhotoUrl } from "~/lib/supabase/storage";

interface PublicPortfolioPageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicPortfolioPage({
  params,
}: PublicPortfolioPageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "name, bio, avatar_path, photos(id, storage_path, caption, created_at)",
    )
    .eq("username", username.toLowerCase())
    .order("created_at", { referencedTable: "photos", ascending: false })
    .single();

  if (!profile) {
    notFound();
  }

  const photos = (
    (profile.photos ?? []) as Array<{
      id: string;
      storage_path: string;
      caption: string;
    }>
  ).map((photo) => ({
    id: photo.id,
    url: getPublicPhotoUrl(photo.storage_path),
    caption: photo.caption,
  }));

  return (
    <ProfileGallery
      profile={{
        name: profile.name || "Your Name",
        bio: profile.bio ?? "",
        avatarUrl: profile.avatar_path
          ? getPublicPhotoUrl(profile.avatar_path)
          : null,
      }}
      photos={photos}
    />
  );
}
