import { isAdmin } from "@/lib/auth";
import { deleteStoredImage, listStoredImages } from "@/lib/images";

const unauthorized = () => Response.json({ error: "로그인이 필요합니다" }, { status: 401 });

// 이미지 보관함 목록
export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    return Response.json({ images: await listStoredImages() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "목록을 불러오지 못했습니다";
    return Response.json({ error: message }, { status: 500 });
  }
}

// 이미지 삭제: { urls: string[] }
export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const body = (await request.json().catch(() => null)) as { urls?: unknown } | null;
  const urls = Array.isArray(body?.urls) ? body.urls.filter((u): u is string => typeof u === "string") : [];
  if (!urls.length) return Response.json({ error: "지울 이미지가 없습니다" }, { status: 400 });

  const results = await Promise.allSettled(urls.map((url) => deleteStoredImage(url)));
  const failed = urls.filter((_, i) => results[i].status === "rejected");
  if (failed.length) {
    return Response.json({ error: `${failed.length}개를 지우지 못했습니다`, failed }, { status: 500 });
  }
  return Response.json({ deleted: urls.length });
}
