import { promises as fs } from "fs";
import path from "path";
import { del, list } from "@vercel/blob";
import { blobEnabled } from "@/lib/store";

// 업로드한 이미지 보관함: Vercel Blob 이 연결돼 있으면 Blob 의 portfolio/ 폴더, 아니면 로컬 public/uploads 를 씁니다

export type StoredImage = { url: string; name: string; size: number; uploadedAt: string };

const PREFIX = "portfolio/";
const LOCAL_DIR = path.join(process.cwd(), "public", "uploads");

export async function listStoredImages(): Promise<StoredImage[]> {
  if (blobEnabled()) {
    const images: StoredImage[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
      for (const blob of page.blobs) {
        images.push({
          url: blob.url,
          name: blob.pathname.slice(PREFIX.length),
          size: blob.size,
          uploadedAt: new Date(blob.uploadedAt).toISOString(),
        });
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return sortNewest(images);
  }

  const names = await fs.readdir(LOCAL_DIR).catch(() => [] as string[]);
  const images = await Promise.all(
    names
      .filter((name) => /\.(jpe?g|png|webp|gif|avif)$/i.test(name))
      .map(async (name) => {
        const stat = await fs.stat(path.join(LOCAL_DIR, name));
        return { url: `/uploads/${name}`, name, size: stat.size, uploadedAt: stat.mtime.toISOString() };
      }),
  );
  return sortNewest(images);
}

// 보관함에 있는 파일만 지울 수 있게, 주소가 보관함 경로인지 먼저 확인합니다
export async function deleteStoredImage(url: string) {
  if (blobEnabled()) {
    const parsed = URL.canParse(url) ? new URL(url) : null;
    if (!parsed?.hostname.endsWith(".blob.vercel-storage.com") || !parsed.pathname.startsWith(`/${PREFIX}`)) {
      throw new Error("보관함 이미지가 아닙니다");
    }
    await del(url);
    return;
  }

  const name = url.startsWith("/uploads/") ? url.slice("/uploads/".length) : "";
  if (!name || name !== path.basename(name)) throw new Error("보관함 이미지가 아닙니다");
  await fs.unlink(path.join(LOCAL_DIR, name));
}

const sortNewest = (images: StoredImage[]) => images.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
