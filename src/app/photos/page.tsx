import { getAlbums } from "@/lib/queries";
import PhotosClient from "./PhotosClient";

// ISR: serve cached HTML, re-fetch from Supabase at most once per 60s
export const revalidate = 60;

export default async function PhotosPage() {
  const albums = await getAlbums();
  return <PhotosClient albums={albums} />;
}
