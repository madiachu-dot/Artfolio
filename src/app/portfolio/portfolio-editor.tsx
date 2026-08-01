"use client";

import { useRef, useState, useTransition } from "react";
import {
  deletePhoto,
  updateProfile,
  uploadAvatar,
  uploadPhotos,
} from "~/app/portfolio/actions";
import {
  type GalleryPhoto,
  type GalleryProfile,
  ProfileGallery,
} from "~/components/profile-gallery";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface PortfolioEditorProps {
  profile: GalleryProfile;
  photos: GalleryPhoto[];
}

export function PortfolioEditor({ profile, photos }: PortfolioEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile.name);
  const [bioDraft, setBioDraft] = useState(profile.bio);

  const [isSavingProfile, startSaveProfile] = useTransition();
  const [, startAvatarUpload] = useTransition();
  const [isUploadingPhotos, startPhotosUpload] = useTransition();
  const [, startDelete] = useTransition();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  function startEditing() {
    setNameDraft(profile.name);
    setBioDraft(profile.bio);
    setIsEditing(true);
  }

  function saveEditing() {
    const formData = new FormData();
    formData.set("name", nameDraft);
    formData.set("bio", bioDraft);
    startSaveProfile(async () => {
      await updateProfile(formData);
      setIsEditing(false);
    });
  }

  function onAvatarSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const formData = new FormData();
    formData.set("avatar", file);
    startAvatarUpload(async () => {
      await uploadAvatar(formData);
    });
  }

  function onPhotosSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    const formData = new FormData();
    for (const file of files) formData.append("photos", file);
    startPhotosUpload(async () => {
      await uploadPhotos(formData);
    });
  }

  function onDeletePhoto(id: string) {
    startDelete(async () => {
      await deletePhoto(id);
    });
  }

  return (
    <>
      <ProfileGallery
        profile={profile}
        photos={photos}
        editable
        onAvatarClick={() => avatarInputRef.current?.click()}
        onAddPhotosClick={() => photoInputRef.current?.click()}
        isUploadingPhotos={isUploadingPhotos}
        onDeletePhoto={onDeletePhoto}
        headerActions={
          <Button size="sm" variant="outline" onClick={startEditing}>
            Edit profile
          </Button>
        }
      >
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
              <Textarea
                id="bio"
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" loading={isSavingProfile} onClick={saveEditing}>
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
        ) : null}
      </ProfileGallery>
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onAvatarSelected}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onPhotosSelected}
      />
    </>
  );
}
