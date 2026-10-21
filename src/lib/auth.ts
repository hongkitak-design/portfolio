import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7일

// 관리자 아이디/비밀번호는 환경변수 ADMIN_USERNAME(기본 admin) / ADMIN_PASSWORD 로 설정합니다 (.env.local / Vercel 환경변수)
export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("hex");

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
};

export function checkCredentials(username: string, password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) return false;
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  // 길이가 달라도 비교 시간이 일정하도록 해시끼리 비교
  const userOk = safeEqual(sign(`id:${username}`), sign(`id:${expectedUsername}`));
  const passwordOk = safeEqual(sign(`pw:${password}`), sign(`pw:${expectedPassword}`));
  return userOk && passwordOk;
}

export async function createSession() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const store = await cookies();
  store.set(COOKIE, `${expires}.${sign(`session:${expires}`)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || Number(expires) < Date.now() / 1000) return false;
  return safeEqual(signature, sign(`session:${expires}`));
}
