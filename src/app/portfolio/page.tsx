"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface Photo {
  id: string;
  src: string;
  caption: string;
}

interface ProfileData {
  name: string;
  bio: string;
  avatar: string | null;
  photos: Photo[];
}

const STORAGE_KEY = "artfolio-profile";

const DEFAULT_PROFILE: ProfileData = {
  name: "Your Name",
  bio: "Tell people about the art you make.",
  avatar: null,
  photos: [],
};

function loadProfile(): ProfileData {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as ProfileData) }
      : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

function saveProfile(profile: ProfileData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function PortfolioPage() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [bioDraft, setBioDraft] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  function update(next: Partial<ProfileData>) {
    setProfile((prev) => {
      const merged = { ...prev, ...next };
      saveProfile(merged);
      return merged;
    });
  }

  function startEditing() {
    setNameDraft(profile.name);
    setBioDraft(profile.bio);
    setIsEditing(true);
  }

  function saveEditing() {
    update({ name: nameDraft.trim() || "Your Name", bio: bioDraft.trim() });
    setIsEditing(false);
  }

  async function onAvatarSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    update({ avatar: dataUrl });
  }

  async function onPhotosSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    const newPhotos = await Promise.all(
      files.map(async (file) => ({
        id: crypto.randomUUID(),
        src: await readFileAsDataUrl(file),
        caption: "",
      })),
    );
    update({ photos: [...newPhotos, ...profile.photos] });
  }

  function removePhoto(id: string) {
    update({ photos: profile.photos.filter((p) => p.id !== id) });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col gap-8 p-6">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <button
          type="button"
          onClick={() => avatarInputRef.current?.click()}
          className="group relative size-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted"
        >
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              sizes="6rem"
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
              Add photo
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            Change
          </span>
        </button>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatarSelected}
        />

        <div className="flex flex-1 flex-col gap-2">
          {isEditing ? (
            <div className="flex flex-col gap-3 text-left">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={saveEditing}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-3xl tracking-tight">
                {profile.name}
              </h1>
              <p className="text-muted-foreground">{profile.bio}</p>
              <div>
                <Button size="sm" variant="outline" onClick={startEditing}>
                  Edit profile
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Photo gallery */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl tracking-tight">Photos</h2>
          <Button size="sm" onClick={() => photoInputRef.current?.click()}>
            Add Photo
          </Button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onPhotosSelected}
          />
        </div>

        {profile.photos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-12 text-sm text-muted-foreground">
            No photos yet. Add your first piece.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {profile.photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image
                  src={photo.src}
                  alt={photo.caption || "Portfolio piece"}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
