"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "~/lib/supabase/server";
import { PORTFOLIO_PHOTOS_BUCKET } from "~/lib/supabase/storage";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not signed in");
  }
  return { supabase, user };
}

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return file.type.split("/")[1] ?? "jpg";
}

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = String(formData.get("name") ?? "").trim() || "Your Name";
  const bio = String(formData.get("bio") ?? "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({ name, bio })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/portfolio");
}

export async function uploadAvatar(formData: FormData) {
  const { supabase, user } = await requireUser();
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return;

  const path = `${user.id}/avatar.${extensionFor(file)}`;
  const { error: uploadError } = await supabase.storage
    .from(PORTFOLIO_PHOTOS_BUCKET)
    .upload(path, file, { upsert: true });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_path: path })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/portfolio");
}

export async function uploadPhotos(formData: FormData) {
  const { supabase, user } = await requireUser();
  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length === 0) return;

  const { data: existing } = await supabase
    .from("photos")
    .select("position")
    .eq("profile_id", user.id)
    .order("position", { ascending: false })
    .limit(1);
  let nextPosition = (existing?.[0]?.position ?? -1) + 1;

  for (const file of files) {
    const path = `${user.id}/${crypto.randomUUID()}.${extensionFor(file)}`;
    const { error: uploadError } = await supabase.storage
      .from(PORTFOLIO_PHOTOS_BUCKET)
      .upload(path, file);
    if (uploadError) throw new Error(uploadError.message);

    const { error } = await supabase.from("photos").insert({
      profile_id: user.id,
      storage_path: path,
      position: nextPosition,
    });
    if (error) throw new Error(error.message);
    nextPosition += 1;
  }

  revalidatePath("/portfolio");
}

export async function reorderPhotos(orderedIds: string[]) {
  const { supabase, user } = await requireUser();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("photos")
        .update({ position: index })
        .eq("id", id)
        .eq("profile_id", user.id),
    ),
  );

  revalidatePath("/portfolio");
}

export async function resizePhoto(
  photoId: string,
  width: number,
  height: number,
) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("photos")
    .update({
      width: clamp(width, 1, 3),
      height: clamp(height, 1, 3),
    })
    .eq("id", photoId)
    .eq("profile_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/portfolio");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export async function updatePhotoCaption(photoId: string, caption: string) {
  const { supabase, user } = await requireUser();

  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select("profile_id")
    .eq("id", photoId)
    .single();
  if (fetchError || !photo) {
    throw new Error(fetchError?.message ?? "Photo not found");
  }
  if (photo.profile_id !== user.id) {
    throw new Error("Not your photo");
  }

  const { error } = await supabase
    .from("photos")
    .update({ caption: caption.trim() })
    .eq("id", photoId);
  if (error) throw new Error(error.message);

  revalidatePath("/portfolio");
}

export async function deletePhoto(photoId: string) {
  const { supabase, user } = await requireUser();

  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select("storage_path, profile_id")
    .eq("id", photoId)
    .single();
  if (fetchError || !photo) {
    throw new Error(fetchError?.message ?? "Photo not found");
  }
  if (photo.profile_id !== user.id) {
    throw new Error("Not your photo");
  }

  await supabase.storage
    .from(PORTFOLIO_PHOTOS_BUCKET)
    .remove([photo.storage_path]);

  const { error } = await supabase.from("photos").delete().eq("id", photoId);
  if (error) throw new Error(error.message);

  revalidatePath("/portfolio");
}
