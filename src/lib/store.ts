import { promises as fs } from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { cacheLife, cacheTag } from "next/cache";
import { createDefaultConfig } from "@/lib/defaults";
import { siteConfigSchema, type SiteConfig } from "@/lib/schema";

export const SITE_TAG = "site-config";

// DATABASE_URL 이 있으면 Neon Postgres, 없으면 로컬 개발용 .data/site.json 에 저장합니다.
export type StorageMode = "database" | "file";

export const storageMode = (): StorageMode => (process.env.DATABASE_URL ? "database" : "file");

export const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

const LOCAL_FILE = path.join(process.cwd(), ".data", "site.json");

let tableReady: Promise<unknown> | null = null;

function getSql() {
  const sql = neon(process.env.DATABASE_URL!);
  tableReady ??= sql`
    CREATE TABLE IF NOT EXISTS site_config (
      id INTEGER PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `.catch((error) => {
    tableReady = null;
    throw error;
  });
  return { sql, ready: tableReady };
}

async function readRaw(): Promise<unknown> {
  if (storageMode() === "database") {
    const { sql, ready } = getSql();
    await ready;
    const rows = await sql`SELECT data FROM site_config WHERE id = 1`;
    return rows[0]?.data ?? null;
  }
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch {
    return null;
  }
}

// 저장된 값이 없거나 형식이 깨졌으면 기본값을 돌려줍니다
export async function loadSiteConfig(): Promise<SiteConfig> {
  const raw = await readRaw();
  if (raw) {
    const parsed = siteConfigSchema.safeParse(raw);
    if (parsed.success) return parsed.data;
    console.error("[site-config] 저장된 설정 형식이 올바르지 않아 기본값을 사용합니다", parsed.error.issues);
  }
  return createDefaultConfig();
}

// 공개 페이지용: 캐시하고, 설정 저장 시 SITE_TAG 로 갱신합니다
export async function getSiteConfig(): Promise<SiteConfig> {
  "use cache";
  cacheLife("days");
  cacheTag(SITE_TAG);
  return loadSiteConfig();
}

export async function saveSiteConfig(config: SiteConfig) {
  if (storageMode() === "database") {
    const { sql, ready } = getSql();
    await ready;
    await sql`
      INSERT INTO site_config (id, data, updated_at)
      VALUES (1, ${JSON.stringify(config)}::jsonb, now())
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `;
    return;
  }
  if (process.env.VERCEL) {
    throw new Error("배포 환경에서는 DB 연결이 필요합니다. Vercel 에서 Neon 을 연결해 주세요.");
  }
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(config, null, 2));
}
