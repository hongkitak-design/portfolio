import type { Block, SiteConfig } from "@/lib/schema";

// 설정 화면 ↔ 미리보기(iframe) 사이에 주고받는 메시지

export type PreviewPage = { kind: "home" } | { kind: "category"; id: string };

export type PreviewRender = {
  type: "preview:render";
  config: SiteConfig;
  page: PreviewPage;
  /** 템플릿 미리보기처럼 아직 적용 안 한 블록을 대신 보여줄 때 */
  blocks?: Block[];
  /** 편집 중인 블록: 바뀌면 그 블록으로 스크롤합니다 */
  focus?: string | null;
};

export type PreviewEvent = { type: "preview:ready" } | { type: "preview:navigate"; href: string };
