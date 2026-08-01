import { env } from "~/env";

export const PORTFOLIO_PHOTOS_BUCKET = "portfolio-photos";

export function getPublicPhotoUrl(path: string) {
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PORTFOLIO_PHOTOS_BUCKET}/${path}`;
}
