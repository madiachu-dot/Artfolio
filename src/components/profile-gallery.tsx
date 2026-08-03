"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

function DragHandleIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <title>Drag to reorder</title>
      <path d="M8 1.5c.5 1.5.9 2.3 2 3-1.1.7-1.5 1.5-2 3-.5-1.5-.9-2.3-2-3 1.1-.7 1.5-1.5 2-3Z" />
      <path d="M13 6c.35 1 .6 1.5 1.4 2-.8.5-1.05 1-1.4 2-.35-1-.6-1.5-1.4-2 .8-.5 1.05-1 1.4-2Z" />
      <path d="M3 6c.35 1 .6 1.5 1.4 2-.8.5-1.05 1-1.4 2-.35-1-.6-1.5-1.4-2 .8-.5 1.05-1 1.4-2Z" />
      <path d="M8 10.5c.5 1.5.9 2.3 2 3-1.1.7-1.5 1.5-2 3-.5-1.5-.9-2.3-2-3 1.1-.7 1.5-1.5 2-3Z" />
    </svg>
  );
}

export interface GalleryProfile {
  name: string;
  bio: string;
  avatarUrl: string | null;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  width: number;
  height: number;
}

interface ProfileGalleryProps {
  profile: GalleryProfile;
  photos: GalleryPhoto[];
  editable?: boolean;
  onAvatarClick?: () => void;
  onAddPhotosClick?: () => void;
  isUploadingPhotos?: boolean;
  onDeletePhoto?: (id: string) => void;
  onUpdateCaption?: (id: string, caption: string) => void;
  isSavingCaption?: boolean;
  onReorderPhotos?: (orderedIds: string[]) => void;
  onResizePhoto?: (id: string, width: number, height: number) => void;
  /** Rendered next to the name/bio when not overridden by `children` (e.g. an "Edit profile" button). */
  headerActions?: ReactNode;
  /** Overrides the default name/bio display — used for the inline edit form. */
  children?: ReactNode;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ProfileGallery({
  profile,
  photos,
  editable = false,
  onAvatarClick,
  onAddPhotosClick,
  isUploadingPhotos = false,
  onDeletePhoto,
  onUpdateCaption,
  isSavingCaption = false,
  onReorderPhotos,
  onResizePhoto,
  headerActions,
  children,
}: ProfileGalleryProps) {
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [captionDraft, setCaptionDraft] = useState("");
  const [resizeDraft, setResizeDraft] = useState<{
    id: string;
    width: number;
    height: number;
  } | null>(null);
  const [orderedPhotos, setOrderedPhotos] = useState(photos);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const tileRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragStartRef = useRef<{
    x: number;
    y: number;
    cellWidthPx: number;
    cellHeightPx: number;
    width: number;
    height: number;
  } | null>(null);
  const draggingIdRef = useRef<string | null>(null);
  const orderedPhotosRef = useRef(orderedPhotos);

  useEffect(() => {
    setOrderedPhotos(photos);
  }, [photos]);

  useEffect(() => {
    orderedPhotosRef.current = orderedPhotos;
  }, [orderedPhotos]);

  // Window-level listeners (rather than pointer capture on the handle itself)
  // because the handle's DOM node moves as photos reorder mid-drag, which
  // silently releases pointer capture and drops the final pointerup.
  useEffect(() => {
    if (!draggingId) return;

    function handleMove(e: PointerEvent) {
      const draggingPhotoId = draggingIdRef.current;
      if (!draggingPhotoId) return;
      const overEl = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest<HTMLElement>("[data-photo-id]");
      const overId = overEl?.dataset.photoId;
      if (!overId || overId === draggingPhotoId) return;

      setOrderedPhotos((prev) => {
        const fromIndex = prev.findIndex((p) => p.id === draggingPhotoId);
        const toIndex = prev.findIndex((p) => p.id === overId);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
          return prev;
        }
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        if (moved) next.splice(toIndex, 0, moved);
        return next;
      });
    }

    function handleUp() {
      draggingIdRef.current = null;
      setDraggingId(null);
      onReorderPhotos?.(orderedPhotosRef.current.map((p) => p.id));
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [draggingId, onReorderPhotos]);

  function startEditingCaption(photo: GalleryPhoto) {
    setEditingPhotoId(photo.id);
    setCaptionDraft(photo.caption);
  }

  function saveCaption(id: string) {
    onUpdateCaption?.(id, captionDraft);
    setEditingPhotoId(null);
  }

  function onResizeStart(e: React.PointerEvent, photo: GalleryPhoto) {
    e.stopPropagation();
    e.preventDefault();
    const tile = tileRefs.current[photo.id];
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      cellWidthPx: rect.width / photo.width,
      cellHeightPx: rect.height / photo.height,
      width: photo.width,
      height: photo.height,
    };
    setResizeDraft({ id: photo.id, width: photo.width, height: photo.height });
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onResizeMove(e: React.PointerEvent, photo: GalleryPhoto) {
    const start = dragStartRef.current;
    if (!start || resizeDraft?.id !== photo.id) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const newWidth = clamp(
      Math.round(start.width + dx / start.cellWidthPx),
      1,
      3,
    );
    const newHeight = clamp(
      Math.round(start.height + dy / start.cellHeightPx),
      1,
      3,
    );
    setResizeDraft({ id: photo.id, width: newWidth, height: newHeight });
  }

  function onResizeEnd(e: React.PointerEvent, photo: GalleryPhoto) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragStartRef.current = null;
    const draft = resizeDraft;
    setResizeDraft(null);
    if (
      draft &&
      draft.id === photo.id &&
      (draft.width !== photo.width || draft.height !== photo.height)
    ) {
      onResizePhoto?.(photo.id, draft.width, draft.height);
    }
  }

  function onDragHandleStart(e: React.PointerEvent, photo: GalleryPhoto) {
    e.stopPropagation();
    e.preventDefault();
    draggingIdRef.current = photo.id;
    setDraggingId(photo.id);
  }

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
        <div className="flex items-center justify-between gap-3">
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

        {orderedPhotos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-12 text-sm text-muted-foreground">
            {editable
              ? "No photos yet. Add your first piece."
              : "No photos yet."}
          </div>
        ) : (
          <div className="grid auto-rows-[130px] grid-cols-2 gap-3 sm:auto-rows-[160px] sm:grid-cols-3">
            {orderedPhotos.map((photo) => {
              const size =
                resizeDraft?.id === photo.id
                  ? resizeDraft
                  : { width: photo.width, height: photo.height };
              return (
                <div
                  key={photo.id}
                  data-photo-id={photo.id}
                  ref={(el) => {
                    tileRefs.current[photo.id] = el;
                  }}
                  style={{
                    gridColumn: `span ${size.width}`,
                    gridRow: `span ${size.height}`,
                  }}
                  className={`group relative overflow-hidden rounded-lg border border-border bg-muted transition-opacity ${
                    draggingId === photo.id ? "opacity-40" : ""
                  }`}
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption || "Portfolio piece"}
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    unoptimized
                    className="object-cover"
                  />

                  {editingPhotoId === photo.id ? (
                    <div className="absolute inset-0 flex flex-col gap-1.5 bg-card p-2">
                      <Textarea
                        autoFocus
                        value={captionDraft}
                        onChange={(e) => setCaptionDraft(e.target.value)}
                        placeholder="Add a description..."
                        className="min-h-0 flex-1 resize-none text-xs"
                      />
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          loading={isSavingCaption}
                          onClick={() => saveCaption(photo.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPhotoId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {photo.caption && (
                        <p className="absolute inset-x-0 bottom-0 line-clamp-2 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white">
                          {photo.caption}
                        </p>
                      )}

                      {editable && (
                        <>
                          <button
                            type="button"
                            onClick={() => startEditingCaption(photo)}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            Edit description
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeletePhoto?.(photo.id)}
                            className="absolute top-1.5 right-1.5 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            Delete
                          </button>
                          {onReorderPhotos && (
                            <button
                              type="button"
                              onPointerDown={(e) => onDragHandleStart(e, photo)}
                              className="absolute top-1.5 left-1.5 cursor-grab touch-none rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
                              aria-label="Drag to reorder"
                            >
                              <DragHandleIcon />
                            </button>
                          )}
                          {onResizePhoto && (
                            <button
                              type="button"
                              onPointerDown={(e) => onResizeStart(e, photo)}
                              onPointerMove={(e) => onResizeMove(e, photo)}
                              onPointerUp={(e) => onResizeEnd(e, photo)}
                              className="absolute right-1 bottom-1 size-4 cursor-nwse-resize touch-none rounded-sm bg-white/80 opacity-0 transition-opacity group-hover:opacity-100"
                              aria-label="Resize photo"
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
