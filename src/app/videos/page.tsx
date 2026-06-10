import { getVideos } from "@/lib/queries";
import VideosClient from "./VideosClient";

// ISR: serve cached HTML, re-fetch from Supabase at most once per 60s
export const revalidate = 60;

export default async function VideosPage() {
  const videos = await getVideos();
  return <VideosClient videos={videos} />;
}
