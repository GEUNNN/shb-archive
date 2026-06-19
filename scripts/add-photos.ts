// add-photos.ts — ingest photo posts into Supabase `photos` + Cloudflare R2.
//   One local folder of images = one post = one row. Pass several folders to
//   ingest several posts in one run.
//   Images are resized/compressed (sharp), uploaded to R2 (S3 API), and the
//   public URLs stored in photos.images[]. The DB never holds image bytes.
//
// Usage:
//   yarn add-photos <folder…> --platform <인스타그램|트위터|플러스챗> \
//                   [--date YYYY-MM-DD] [--caption "…"] [--likes N] [--id <postId>] \
//                   [--url "<original post url>"] \
//                   [--flat] [--max-width 1440] [--quality 80] [--format webp|jpeg] [--dry-run]
//
// Examples:
//   yarn add-photos photo/260616 --platform 인스타그램                 # one post, all images in it
//   yarn add-photos photo/260610 photo/260614 photo/260616 --platform 트위터   # batch (one post per folder)
//   yarn add-photos photo/260616 --platform 트위터 --flat              # one post PER image in the folder
//
//   --flat: each image in a folder becomes its own 1-photo post (default: all images → one post).
//   --date defaults to the folder name in YYMMDD form (e.g. "260616" → 2026-06-16).
//   --date / --id / --url can't be combined with multiple folders; --id can't be combined with --flat.
//   --caption is optional (플러스챗 posts often have none); stored as "" if omitted.
//   --url is optional — the original post link (트위터/인스타그램); stored as null if omitted.
//
// Examples:
//   yarn add-photos ~/photos/260522 --platform 인스타그램 --date 2026-05-22 --caption "여름 화보" --dry-run
//   yarn add-photos ~/photos/260522 --platform 인스타그램 --date 2026-05-22 --caption "여름 화보" --likes 1280
//
// Each run = one post. For several posts, run it once per folder.
//
// R2 layout (mirrors the reference archive):
//   images/{platform-slug}/{YYMMDD}/{postId}_{NN}.{ext}
//   e.g. images/instagram/260522/ig-260522-x7k2_01.webp
//
// ratio is fixed at 1.33 — every photo card is a uniform 3:4 portrait. films[]
// is left empty (real images supersede the gradient placeholders).
//
// Env (.env.local): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY,
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE.
// R2 keys + the Supabase secret bypass auth — backend only, never expose them.

import { config } from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { readdir, readFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { randomBytes } from "node:crypto";

config({ path: ".env.local" });

// KR platform label → URL-safe slug for the R2 path
const PLATFORMS = { "인스타그램": "instagram", "트위터": "twitter", "플러스챗": "pluschat" } as const;
type PlatformKR = keyof typeof PLATFORMS;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".gif", ".avif"]);
const MIME: Record<string, string> = { webp: "image/webp", jpeg: "image/jpeg", png: "image/png" };

// ─── args ────────────────────────────────────────────────────────────────────
function parseArgs(argv: string[]) {
  const positional: string[] = [];
  let platform = "";
  let date = "";
  let caption = "";
  let likes = 0;
  let id = "";
  let url = "";
  let maxWidth = 1440;
  let quality = 80;
  let format = "webp";
  let dryRun = false;
  let flat = false;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--platform") platform = argv[++i] ?? "";
    else if (a === "--date") date = argv[++i] ?? "";
    else if (a === "--caption") caption = (argv[++i] ?? "").replace(/\\n/g, "\n"); // literal \n → real newline
    else if (a === "--likes") likes = Number(argv[++i]);
    else if (a === "--id") id = argv[++i] ?? "";
    else if (a === "--url") url = argv[++i] ?? "";
    else if (a === "--max-width") maxWidth = Number(argv[++i]);
    else if (a === "--quality") quality = Number(argv[++i]);
    else if (a === "--format") format = (argv[++i] ?? "").toLowerCase();
    else if (a === "--flat") flat = true;
    else if (a === "--dry-run") dryRun = true;
    else positional.push(a);
  }
  return { folders: positional, platform, date, caption, likes, id, url, maxWidth, quality, format, dryRun, flat };
}

// "2026-05-22" → "260522"
const yymmdd = (date: string) => date.slice(2).replaceAll("-", "");

// short, URL-safe post id: "{slug}-{yymmdd}-{4 hex}"
function makeId(slug: string, date: string): string {
  return `${slug}-${yymmdd(date)}-${randomBytes(2).toString("hex")}`;
}

// a post's date: explicit --date wins; otherwise derive from the folder name in
// YYMMDD form (e.g. "260616" → 2026-06-16).
function deriveDate(folder: string, dateOverride: string): string {
  if (dateOverride) return dateOverride;
  const name = basename(folder);
  const m = name.match(/^(\d{2})(\d{2})(\d{2})$/);
  if (!m) throw new Error(`No --date given and folder name "${name}" isn't YYMMDD (e.g. 260616). Pass --date YYYY-MM-DD or rename the folder.`);
  return `20${m[1]}-${m[2]}-${m[3]}`;
}

// shared config + (live) clients passed to each folder
type Ctx = {
  slug: string; platform: string; caption: string; likes: number; id: string; url: string;
  maxWidth: number; quality: number; format: string;
  publicBase: string; bucket: string; dateOverride: string; dryRun: boolean; flat: boolean;
  s3: S3Client | null; supabase: SupabaseClient | null;
};

// process one image: resize/re-encode + build its R2 key/url
type Prepared = { key: string; url: string; body: Buffer; width: number; height: number; from: string };

async function prepareImage(folder: string, file: string, postId: string, nn: number, postDate: string, ctx: Ctx): Promise<Prepared> {
  const raw = await readFile(join(folder, file));
  const pipeline = sharp(raw).rotate().resize({ width: ctx.maxWidth, withoutEnlargement: true });
  const { data, info } =
    ctx.format === "webp" ? await pipeline.webp({ quality: ctx.quality }).toBuffer({ resolveWithObject: true })
    : ctx.format === "png" ? await pipeline.png().toBuffer({ resolveWithObject: true })
    : await pipeline.jpeg({ quality: ctx.quality }).toBuffer({ resolveWithObject: true });
  const key = `images/${ctx.slug}/${yymmdd(postDate)}/${postId}_${String(nn).padStart(2, "0")}.${ctx.format}`;
  return { key, url: `${ctx.publicBase}/${key}`, body: data, width: info.width, height: info.height, from: file };
}

// commit one post: dry-run print, or upload its images to R2 + upsert the row.
// ratio is fixed at 1.33 — every photo card is a uniform 3:4 portrait.
async function commitPost(postId: string, postDate: string, prepared: Prepared[], ctx: Ctx) {
  const row = {
    id: postId,
    caption: ctx.caption,
    date: postDate,
    platform: ctx.platform,
    likes: ctx.likes,
    ratio: 1.33,
    films: [] as number[],
    images: prepared.map((p) => p.url),
    source_url: ctx.url || null,
  };

  if (ctx.dryRun) {
    prepared.forEach((p) => {
      const kb = (p.body.length / 1024).toFixed(0);
      console.log(`     ${p.from} → ${p.width}×${p.height}, ${kb} KB · ${p.url}`);
    });
    console.log(`  📝 post ${postId}: ${row.images.length} image(s)${row.source_url ? ` · 🔗 ${row.source_url}` : ""}`);
    return;
  }

  for (const p of prepared) {
    await ctx.s3!.send(new PutObjectCommand({ Bucket: ctx.bucket, Key: p.key, Body: p.body, ContentType: MIME[ctx.format] }));
    console.log(`  ⬆️  ${p.key}`);
  }
  // upsert on id so a re-run with --id is idempotent
  const { error } = await ctx.supabase!.from("photos").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
  console.log(`  ✅ post "${postId}" (${row.images.length} image(s)).`);
}

// ─── ingest ONE folder ───────────────────────────────────────────────────────────
// default: all images → one post. --flat: each image → its own 1-photo post.
// Returns the number of posts created.
async function processFolder(folder: string, ctx: Ctx): Promise<number> {
  const postDate = deriveDate(folder, ctx.dateOverride);

  const files = (await readdir(folder))
    .filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (files.length === 0) throw new Error(`No images (${[...IMAGE_EXT].join(", ")}) found in "${folder}".`);

  if (ctx.flat) {
    console.log(`\n📂 ${folder} · ${postDate} → ${files.length} post(s) (flat: 1 photo each)`);
    for (const file of files) {
      const postId = makeId(ctx.slug, postDate);
      const prepared = [await prepareImage(folder, file, postId, 1, postDate, ctx)];
      await commitPost(postId, postDate, prepared, ctx);
    }
    return files.length;
  }

  const postId = ctx.id || makeId(ctx.slug, postDate);
  console.log(`\n📷 ${folder} · ${postDate} → 1 post (${files.length} image(s)) · ${postId}`);
  const prepared: Prepared[] = [];
  for (let i = 0; i < files.length; i++) {
    prepared.push(await prepareImage(folder, files[i], postId, i + 1, postDate, ctx));
  }
  await commitPost(postId, postDate, prepared, ctx);
  return 1;
}

// ─── main ──────────────────────────────────────────────────────────────────────
async function main() {
  const { folders, platform, date, caption, likes, id, url, maxWidth, quality, format, dryRun, flat } = parseArgs(process.argv.slice(2));

  // ── validate shared inputs ──
  if (folders.length === 0) throw new Error('Missing <folder>. Usage: yarn add-photos <folder…> --platform <…> [--date YYYY-MM-DD]');
  if (!(platform in PLATFORMS)) throw new Error(`--platform must be one of: ${Object.keys(PLATFORMS).join(", ")} (got: "${platform}")`);
  if (!MIME[format]) throw new Error(`--format must be one of: ${Object.keys(MIME).join(", ")} (got: "${format}")`);
  if (!Number.isFinite(likes) || likes < 0) throw new Error(`--likes must be a non-negative number.`);
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD (got: "${date}")`);
  // per-post flags can't be shared across a batch
  if (folders.length > 1 && date) throw new Error("--date can't be combined with multiple folders — each folder's date comes from its name.");
  if (folders.length > 1 && id) throw new Error("--id can't be combined with multiple folders — ids must be unique. Run one folder at a time to set an id.");
  if (folders.length > 1 && url) throw new Error("--url can't be combined with multiple folders — each post has its own link. Run one folder at a time to set a url.");
  if (flat && id) throw new Error("--id can't be combined with --flat — each photo becomes its own post.");

  // ── env ──
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SECRET) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_BASE)
    throw new Error("Missing R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET / R2_PUBLIC_BASE in .env.local");

  // create clients once and reuse across folders (skip entirely on dry-run)
  const s3 = dryRun ? null : new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
  const supabase = dryRun ? null : createClient(SUPABASE_URL, SUPABASE_SECRET, { auth: { persistSession: false } });

  const ctx: Ctx = {
    slug: PLATFORMS[platform as PlatformKR],
    platform, caption, likes, id, url, maxWidth, quality, format,
    publicBase: R2_PUBLIC_BASE.replace(/\/$/, ""), // tolerate a trailing slash
    bucket: R2_BUCKET, dateOverride: date, dryRun, flat, s3, supabase,
  };

  let total = 0;
  for (const folder of folders) {
    total += await processFolder(folder, ctx);
  }

  if (dryRun) console.log("\n💡 --dry-run: nothing uploaded or written. Re-run without --dry-run to commit.");
  else if (total > 1) console.log(`\n🎉 Done — ${total} posts ingested.`);
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}`);
  process.exit(1);
});
