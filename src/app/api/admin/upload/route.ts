import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/auth";
import { blobEnabled } from "@/lib/store";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel 함수 요청 한도(4.5MB) 안쪽
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

// 이미지 업로드: Vercel Blob 이 연결돼 있으면 Blob 에, 아니면 로컬 public/uploads 에 저장합니다
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "로그인이 필요합니다" }, { status: 401 });

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return Response.json({ error: "파일이 없습니다" }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return Response.json({ error: "jpg, png, webp, gif, avif 이미지만 올릴 수 있습니다" }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "4MB 이하 이미지만 올릴 수 있습니다" }, { status: 400 });

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (blobEnabled()) {
    const blob = await put(`portfolio/${name}`, file, { access: "public", contentType: file.type });
    return Response.json({ url: blob.url });
  }

  if (process.env.VERCEL) {
    return Response.json({ error: "배포 환경에서는 Vercel Blob 연결이 필요합니다" }, { status: 500 });
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ url: `/uploads/${name}` });
}
