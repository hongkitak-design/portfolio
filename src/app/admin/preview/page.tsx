"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PreviewEvent, PreviewRender } from "@/app/admin/editor/preview";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import BlockList from "@/components/blocks/BlockList";

const post = (event: PreviewEvent) => window.parent.postMessage(event, location.origin);

// 설정 화면 오른쪽 미리보기: 저장 전 설정을 받아 실제 사이트 컴포넌트로 그립니다
export default function PreviewPage() {
  const [state, setState] = useState<PreviewRender | null>(null);
  const lastFocus = useRef<string | null | undefined>(undefined);
  const lastPage = useRef("");

  useEffect(() => {
    const onMessage = (e: MessageEvent<PreviewRender>) => {
      if (e.origin !== location.origin || e.source !== window.parent || e.data?.type !== "preview:render") return;
      setState(e.data);
    };
    window.addEventListener("message", onMessage);

    // 미리보기 안의 링크는 이동하지 않고, 설정 화면에 어느 페이지인지 알려 편집 화면을 바꿉니다
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest("a");
      if (!link) return;
      e.preventDefault();
      const url = new URL(link.href, location.href);
      if (url.origin === location.origin) post({ type: "preview:navigate", href: url.pathname });
    };
    document.addEventListener("click", onClick, true);

    post({ type: "preview:ready" });
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  const page = state?.page;
  const category = page?.kind === "category" ? state?.config.categories.find((c) => c.id === page.id) : undefined;
  const pageKey = page?.kind === "category" ? page.id : "home";

  useEffect(() => {
    if (!state) return;
    if (lastPage.current !== pageKey) {
      lastPage.current = pageKey;
      window.scrollTo({ top: 0 });
    }
    if (state.focus === lastFocus.current) return;
    lastFocus.current = state.focus;
    if (!state.focus) return;
    const el = document.querySelector(`[data-block-id="${CSS.escape(state.focus)}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state, pageKey]);

  if (!state) return <div className="min-h-screen bg-background" />;

  const { config } = state;
  const blocks = state.blocks ?? (category ? category.blocks : config.home.blocks);
  const menu = config.categories.filter((c) => c.visible).map(({ slug, label }) => ({ slug, label }));

  return (
    <div
      className="flex min-h-screen flex-col bg-background text-foreground [&_[data-block-id]]:scroll-mt-20"
      style={{ "--point": config.site.pointColor } as CSSProperties}
    >
      <Header
        logo={config.site.logo}
        name={config.site.title}
        email={config.site.email}
        menu={menu}
        activePath={category ? `/${category.slug}` : "/"}
      />
      <main className="flex-1 pt-16">
        <BlockList key={pageKey} blocks={blocks} categories={config.categories} marked />
      </main>
      <Footer logo={config.site.logo} name={config.site.title} email={config.site.email} github={config.site.github} />
    </div>
  );
}
