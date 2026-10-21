import { connection } from "next/server";
import { Suspense } from "react";
import AdminEditor from "@/app/admin/editor/AdminEditor";
import LoginForm from "@/app/admin/LoginForm";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { blobEnabled, loadSiteConfig, storageMode } from "@/lib/store";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="p-10 text-neutral-500">불러오는 중…</p>}>
      <AdminGate />
    </Suspense>
  );
}

async function AdminGate() {
  await connection();
  if (!adminConfigured()) {
    return (
      <div className="mx-auto max-w-md p-10 text-sm leading-relaxed text-neutral-300">
        <h1 className="mb-4 text-xl font-bold">관리자 계정이 설정되지 않았습니다</h1>
        <p>
          환경변수 <code className="rounded bg-neutral-800 px-1">ADMIN_PASSWORD</code> 를 설정해 주세요. 로컬은{" "}
          <code className="rounded bg-neutral-800 px-1">.env.local</code>, 배포는 Vercel 프로젝트 설정 → Environment
          Variables 에서 추가합니다.
        </p>
      </div>
    );
  }
  if (!(await isAdmin())) return <LoginForm />;

  const config = await loadSiteConfig();
  return <AdminEditor initialConfig={config} storage={storageMode()} blob={blobEnabled()} />;
}
