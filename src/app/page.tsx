import HomeMain from "@/app/home/main";
import { getAlbums, getVideos } from "@/lib/queries";

// ISR: serve cached HTML, re-fetch from Supabase at most once per 60s
export const revalidate = 60;

export default async function Home() {
  const [albums, videos] = await Promise.all([getAlbums(), getVideos()]);
  return (
    <div className="">
      <HomeMain albums={albums} videos={videos} />
    </div>
  );
}
