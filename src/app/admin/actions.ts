"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkCredentials, createSession, destroySession, isAdmin } from "@/lib/auth";
import { createDefaultConfig } from "@/lib/defaults";
import { siteConfigSchema, type SiteConfig } from "@/lib/schema";
import { SITE_TAG, saveSiteConfig } from "@/lib/store";

export type LoginState = { error?: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(username, password)) return { error: "아이디 또는 비밀번호가 올바르지 않습니다" };
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin");
}

export type SaveResult = { ok: true; config: SiteConfig } | { ok: false; error: string };

async function persist(input: unknown): Promise<SaveResult> {
  if (!(await isAdmin())) return { ok: false, error: "로그인이 만료되었습니다. 다시 로그인해 주세요." };
  const parsed = siteConfigSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: `${issue.message} (${issue.path.join(" > ")})` };
  }
  try {
    await saveSiteConfig(parsed.data);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "저장에 실패했습니다" };
  }
  updateTag(SITE_TAG);
  return { ok: true, config: parsed.data };
}

export async function saveConfig(input: unknown) {
  return persist(input);
}

export async function resetConfig() {
  return persist(createDefaultConfig());
}
