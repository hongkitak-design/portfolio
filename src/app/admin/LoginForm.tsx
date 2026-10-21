"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mx-auto mt-32 flex max-w-sm flex-col gap-4 px-6">
      <h1 className="text-2xl font-bold">포트폴리오 설정</h1>
      <p className="text-sm text-neutral-400">관리자 비밀번호를 입력하세요.</p>
      <input
        type="password"
        name="password"
        aria-label="관리자 비밀번호"
        autoFocus
        required
        autoComplete="current-password"
        className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none focus:border-point"
      />
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        disabled={pending}
        className="rounded-lg bg-point py-3 font-semibold transition active:scale-95 disabled:opacity-50"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
