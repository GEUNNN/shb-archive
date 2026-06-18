// one-off: delete every video belonging to a given playlist from Supabase.
//   yarn tsx scripts/_delete-playlist.ts <playlistId> [--dry-run]
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const YT = "https://www.googleapis.com/youtube/v3";

async function playlistIds(pl: string, apiKey: string): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;
  do {
    const qs = new URLSearchParams({
      part: "contentDetails",
      playlistId: pl,
      maxResults: "50",
      key: apiKey,
      ...(pageToken ? { pageToken } : {}),
    });
    const res = await fetch(`${YT}/playlistItems?${qs}`);
    if (!res.ok) throw new Error(`YouTube ${res.status}: ${await res.text()}`);
    const data: any = await res.json();
    for (const it of data.items ?? []) ids.push(it.contentDetails.videoId);
    pageToken = data.nextPageToken;
  } while (pageToken);
  return [...new Set(ids)];
}

async function main() {
  const pl = process.argv[2];
  const dryRun = process.argv.includes("--dry-run");
  if (!pl) throw new Error("Pass a playlist id.");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const secret = process.env.SUPABASE_SECRET_KEY!;
  const apiKey = process.env.YOUTUBE_API_KEY!;
  if (!url || !secret || !apiKey) throw new Error("Missing env in .env.local");

  const ids = await playlistIds(pl, apiKey);
  console.log(`🎞️  Playlist ${pl}: ${ids.length} video ids.`);

  const supabase = createClient(url, secret, { auth: { persistSession: false } });
  // how many of those actually exist in the table right now
  const { data: present, error: selErr } = await supabase
    .from("videos")
    .select("id")
    .in("id", ids);
  if (selErr) throw new Error(`select failed: ${selErr.message}`);
  console.log(`📊 ${present?.length ?? 0} of them are currently in the table.`);

  if (dryRun) {
    console.log("\n💡 --dry-run: nothing deleted.");
    return;
  }

  let deleted = 0;
  for (let i = 0; i < ids.length; i += 200) {
    const batch = ids.slice(i, i + 200);
    const { error } = await supabase.from("videos").delete().in("id", batch);
    if (error) throw new Error(`delete failed: ${error.message}`);
    deleted += batch.length;
  }
  console.log(`🗑️  Delete issued for ${ids.length} ids.`);

  const { count } = await supabase
    .from("videos")
    .select("id", { count: "exact", head: true })
    .in("id", ids);
  console.log(`✅ Remaining rows from this playlist: ${count ?? 0}.`);
}

main().catch((e) => {
  console.error(`\n❌ ${e.message}`);
  process.exit(1);
});
