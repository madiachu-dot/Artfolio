"use client";

import { useEffect, useState } from "react";
import { createClient } from "~/lib/supabase/client";

interface AdminRow {
  id: string;
  username: string;
  name: string;
  createdAt: string;
  photoCount: number;
}

interface ProfileRow {
  id: string;
  username: string;
  name: string;
  created_at: string;
}

interface PhotoRow {
  id: string;
  profile_id: string;
}

export function AdminDashboard({ initialRows }: { initialRows: AdminRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          setRows((current) => {
            if (payload.eventType === "INSERT") {
              const profile = payload.new as ProfileRow;
              return [
                {
                  id: profile.id,
                  username: profile.username,
                  name: profile.name,
                  createdAt: profile.created_at,
                  photoCount: 0,
                },
                ...current,
              ];
            }
            if (payload.eventType === "UPDATE") {
              const profile = payload.new as ProfileRow;
              return current.map((row) =>
                row.id === profile.id
                  ? { ...row, username: profile.username, name: profile.name }
                  : row,
              );
            }
            const profile = payload.old as ProfileRow;
            return current.filter((row) => row.id !== profile.id);
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "photos" },
        (payload) => {
          const photo = payload.new as PhotoRow;
          setRows((current) =>
            current.map((row) =>
              row.id === photo.profile_id
                ? { ...row, photoCount: row.photoCount + 1 }
                : row,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "photos" },
        (payload) => {
          const photo = payload.old as PhotoRow;
          setRows((current) =>
            current.map((row) =>
              row.id === photo.profile_id
                ? { ...row, photoCount: Math.max(0, row.photoCount - 1) }
                : row,
            ),
          );
        },
      )
      .subscribe((status) => setIsLive(status === "SUBSCRIBED"));

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <h1 className="font-heading text-3xl tracking-tight">Admin</h1>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className={`size-2 rounded-full ${
              isLive ? "bg-primary" : "bg-muted-foreground/40"
            }`}
          />
          {isLive ? "Live" : "Connecting…"}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Username</th>
              <th className="p-3 font-medium">Joined</th>
              <th className="p-3 font-medium">Photos</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-muted-foreground"
                >
                  No users yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="p-3">{row.name || "Your Name"}</td>
                  <td className="p-3 text-muted-foreground">@{row.username}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">{row.photoCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
