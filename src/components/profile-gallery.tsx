import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";

export interface GalleryProfile {
  name: string;
  bio: string;
  avatarUrl: string | null;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
}

interface ProfileGalleryProps {
  profile: GalleryProfile;
  photos: GalleryPhoto[];
  editable?: boolean;
  onAvatarClick?: () => void;
  onAddPhotosClick?: () => void;
  isUploadingPhotos?: boolean;
  onDeletePhoto?: (id: string) => void;
  /** Rendered next to the name/bio when not overridden by `children` (e.g. an "Edit profile" button). */
  headerActions?: ReactNode;
  /** Overrides the default name/bio display — used for the inline edit form. */
  children?: ReactNode;
}

export function ProfileGallery({
  profile,
  photos,
  editable = false,
  onAvatarClick,
  onAddPhotosClick,
  isUploadingPhotos = false,
  onDeletePhoto,
  headerActions,
  children,
}: ProfileGalleryProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col gap-8 p-6">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <button
          type="button"
          onClick={editable ? onAvatarClick : undefined}
          disabled={!editable}
          className="group relative size-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted disabled:cursor-default"
        >
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              fill
              sizes="6rem"
              unoptimized
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
              {editable ? "Add photo" : ""}
            </span>
          )}
          {editable && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              Change
            </span>
          )}
        </button>

        <div className="flex flex-1 flex-col gap-2">
          {children ?? (
            <>
              <h1 className="font-heading text-3xl tracking-tight">
                {profile.name}
              </h1>
              <p className="text-muted-foreground">{profile.bio}</p>
              {editable && <div>{headerActions}</div>}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl tracking-tight">Photos</h2>
          {editable && (
            <Button
              size="sm"
              loading={isUploadingPhotos}
              onClick={onAddPhotosClick}
            >
              Add Photo
            </Button>
          )}
        </div>

        {photos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-12 text-sm text-muted-foreground">
            {editable
              ? "No photos yet. Add your first piece."
              : "No photos yet."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || "Portfolio piece"}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  unoptimized
                  className="object-cover"
                />
                {editable && (
                  <button
                    type="button"
                    onClick={() => onDeletePhoto?.(photo.id)}
                    className="absolute top-1.5 right-1.5 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
