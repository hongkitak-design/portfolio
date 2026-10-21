"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { logout, resetConfig, saveConfig } from "@/app/admin/actions";
import BlockEditor from "@/app/admin/editor/BlockEditor";
import {
  ColorInput,
  ConfirmButton,
  IconButton,
  ImageField,
  TextInput,
  Toggle,
  move,
} from "@/app/admin/editor/fields";
import type { BlockType, Category, SiteConfig } from "@/lib/schema";
import { buildTemplate, newId, PAGE_TEMPLATES, sampleImage, type PageTemplate } from "@/lib/templates";
import type { StorageMode } from "@/lib/store";

type View = { kind: "site" } | { kind: "home" } | { kind: "category"; id: string };

const HOME_BLOCKS: BlockType[] = ["hero", "circles", "categoryRows", "keywords", "banners", "works", "text"];
const CATEGORY_BLOCKS: BlockType[] = ["hero", "keywords", "banners", "works", "text", "circles"];

type Props = { initialConfig: SiteConfig; storage: StorageMode; blob: boolean };

export default function AdminEditor({ initialConfig, storage, blob }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialConfig);
  const [config, setConfig] = useState(initialConfig);
  const [view, setView] = useState<View>({ kind: "home" });
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(config), [saved, config]);

  const save = useCallback(() => {
    startTransition(async () => {
      const result = await saveConfig(config);
      if (result.ok) {
        setSaved(result.config);
        setConfig(result.config);
        setMessage({ type: "ok", text: "저장했습니다. 사이트에 바로 반영됩니다." });
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }, [config]);

  // Cmd/Ctrl + S 로 저장
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (dirty && !pending) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, pending, save]);

  // 저장 안 한 변경이 있으면 나가기 전에 경고
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (message?.type !== "ok") return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const updateCategory = (id: string, patch: Partial<Category>) =>
    setConfig((c) => ({ ...c, categories: c.categories.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  const addCategory = () => {
    const n = config.categories.length + 1;
    const category: Category = {
      id: newId(),
      slug: `category-${n}`,
      label: `새 카테고리 ${n}`,
      short: `NEW${n}`,
      visible: false,
      circleImage: sampleImage(`new-${n}-${Date.now()}`, 200, 200),
      blocks: buildTemplate("shop", {
        label: `새 카테고리 ${n}`,
        seed: `new-${n}-${Date.now()}`,
        keywords: ["키워드1", "키워드2", "키워드3"],
        metas: ["분류"],
        accent: "#ff153c",
      }),
    };
    setConfig((c) => ({ ...c, categories: [...c.categories, category] }));
    setView({ kind: "category", id: category.id });
  };

  const current = view.kind === "category" ? config.categories.find((c) => c.id === view.id) : undefined;
  const previewHref = view.kind === "category" && current ? `/${current.slug}` : "/";

  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 바 */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-neutral-800 bg-neutral-950/95 px-4 py-3 backdrop-blur">
        <h1 className="font-bold">포트폴리오 설정</h1>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] ${
            storage === "database" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"
          }`}
          title={storage === "database" ? "Neon Postgres 에 저장됩니다" : "DB 미연결: 이 컴퓨터의 .data/site.json 에 저장됩니다"}
        >
          {storage === "database" ? "DB 연결됨" : "로컬 파일 저장"}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] ${blob ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}
          title={blob ? "이미지가 Vercel Blob 에 저장됩니다" : "Blob 미연결: public/uploads 에 저장됩니다 (로컬 전용)"}
        >
          {blob ? "이미지 Blob" : "이미지 로컬"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {message && (
            <span role="status" className={`text-xs ${message.type === "ok" ? "text-emerald-300" : "text-red-400"}`}>
              {message.text}
            </span>
          )}
          {dirty && !message && <span className="text-xs text-amber-300">저장 안 된 변경사항</span>}
          <a
            href={previewHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-700"
          >
            사이트 보기 ↗
          </a>
          <button
            type="button"
            onClick={() => setConfig(saved)}
            disabled={!dirty || pending}
            className="rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-700 disabled:opacity-40"
          >
            되돌리기
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || pending}
            className="rounded-md bg-point px-4 py-1.5 text-xs font-bold transition active:scale-95 disabled:opacity-40"
          >
            {pending ? "저장 중…" : "저장 (⌘S)"}
          </button>
          <button
            type="button"
            onClick={() => startTransition(async () => {
              await logout();
              router.refresh();
            })}
            className="px-2 text-xs text-neutral-500 hover:text-white"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* 왼쪽 메뉴 */}
        <nav className="flex shrink-0 flex-col gap-1 border-b border-neutral-800 p-3 md:w-64 md:border-r md:border-b-0">
          <NavButton active={view.kind === "site"} onClick={() => setView({ kind: "site" })}>
            사이트 기본 설정
          </NavButton>
          <NavButton active={view.kind === "home"} onClick={() => setView({ kind: "home" })}>
            홈 화면
          </NavButton>
          <p className="mt-4 mb-1 px-2 text-[11px] font-semibold text-neutral-500">카테고리 (상단 메뉴 순서)</p>
          {config.categories.map((c, i) => (
            <div key={c.id} className="flex items-center">
              <NavButton
                className="flex-1"
                active={view.kind === "category" && view.id === c.id}
                onClick={() => setView({ kind: "category", id: c.id })}>
                <span className={c.visible ? "" : "text-neutral-500 line-through"}>{c.label}</span>
              </NavButton>
              <IconButton
                label="위로"
                disabled={i === 0}
                onClick={() => setConfig((x) => ({ ...x, categories: move(x.categories, i, i - 1) }))}
              >
                ↑
              </IconButton>
              <IconButton
                label="아래로"
                disabled={i === config.categories.length - 1}
                onClick={() => setConfig((x) => ({ ...x, categories: move(x.categories, i, i + 1) }))}
              >
                ↓
              </IconButton>
            </div>
          ))}
          <button
            type="button"
            onClick={addCategory}
            className="mt-2 rounded-md border border-dashed border-neutral-700 py-2 text-xs text-neutral-400 hover:text-white active:scale-95"
          >
            + 카테고리 추가
          </button>
          <div className="mt-auto pt-8">
            <ConfirmButton
              label="기본값으로 초기화"
              confirmLabel="정말 초기화? 한 번 더 누르기"
              className="w-full"
              onConfirm={() =>
                startTransition(async () => {
                  const result = await resetConfig();
                  if (result.ok) {
                    setSaved(result.config);
                    setConfig(result.config);
                    setView({ kind: "home" });
                    setMessage({ type: "ok", text: "기본값으로 초기화했습니다." });
                  } else setMessage({ type: "error", text: result.error });
                })
              }
            />
          </div>
        </nav>

        {/* 편집 영역 */}
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-3xl">
            {view.kind === "site" && (
              <Panel title="사이트 기본 설정" description="로고, 사이트 이름, 포인트 색 등 전체에 적용되는 설정입니다.">
                <ImageField
                  label="로고 (어두운 배경용, 가로형)"
                  aspect="aspect-[3/1]"
                  value={config.site.logo}
                  onChange={(logo) => setConfig((c) => ({ ...c, site: { ...c.site, logo } }))}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="사이트 이름 (브라우저 탭 제목)"
                    value={config.site.title}
                    onChange={(title) => setConfig((c) => ({ ...c, site: { ...c.site, title } }))}
                  />
                  <ColorInput
                    label="포인트 색"
                    value={config.site.pointColor}
                    onChange={(pointColor) => setConfig((c) => ({ ...c, site: { ...c.site, pointColor } }))}
                  />
                </div>
                <TextInput
                  label="사이트 설명 (검색 결과에 노출)"
                  value={config.site.description}
                  onChange={(description) => setConfig((c) => ({ ...c, site: { ...c.site, description } }))}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="연락 이메일"
                    value={config.site.email}
                    onChange={(email) => setConfig((c) => ({ ...c, site: { ...c.site, email } }))}
                  />
                  <TextInput
                    label="GitHub 주소"
                    value={config.site.github}
                    onChange={(github) => setConfig((c) => ({ ...c, site: { ...c.site, github } }))}
                  />
                </div>
              </Panel>
            )}

            {view.kind === "home" && (
              <Panel title="홈 화면" description="블록 순서대로 홈 화면에 나옵니다. ↑↓ 로 순서를, 블록을 펼쳐 레이아웃과 내용을 바꿉니다.">
                <BlockEditor
                  blocks={config.home.blocks}
                  allowed={HOME_BLOCKS}
                  onChange={(blocks) => setConfig((c) => ({ ...c, home: { blocks } }))}
                />
              </Panel>
            )}

            {view.kind === "category" && current && (
              <CategoryPanel
                key={current.id}
                category={current}
                onChange={(patch) => updateCategory(current.id, patch)}
                onDelete={() => {
                  setConfig((c) => ({ ...c, categories: c.categories.filter((x) => x.id !== current.id) }));
                  setView({ kind: "home" });
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-0 truncate rounded-md px-3 py-2 text-left text-sm transition active:scale-[0.98] ${
        active ? "bg-point/15 font-semibold text-white" : "text-neutral-300 hover:bg-neutral-900"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        {description && <p className="mt-1 text-sm text-neutral-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function CategoryPanel({
  category,
  onChange,
  onDelete,
}: {
  category: Category;
  onChange: (patch: Partial<Category>) => void;
  onDelete: () => void;
}) {
  const [template, setTemplate] = useState<PageTemplate>("shop");

  return (
    <Panel title={category.label || "(이름 없음)"} description="상단 메뉴에 나오는 카테고리 페이지입니다.">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-800 p-4">
        <Toggle label="사이트에 표시" checked={category.visible} onChange={(visible) => onChange({ visible })} />
        <a
          href={`/${category.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-neutral-400 underline-offset-2 hover:text-white hover:underline"
        >
          /{category.slug} ↗
        </a>
        <ConfirmButton
          label="카테고리 삭제"
          confirmLabel="정말 삭제? 한 번 더 누르기"
          className="ml-auto"
          onConfirm={onDelete}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <TextInput label="메뉴 이름" value={category.label} onChange={(label) => onChange({ label })} />
        <TextInput
          label="주소 (영문)"
          hint="예: eznet → /eznet"
          value={category.slug}
          onChange={(slug) => onChange({ slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
        />
        <TextInput label="원형 메뉴 글자" value={category.short} onChange={(short) => onChange({ short })} />
      </div>
      <ImageField
        label="원형 메뉴 이미지"
        aspect="aspect-square"
        value={category.circleImage}
        onChange={(circleImage) => onChange({ circleImage })}
      />

      <div className="rounded-xl border border-neutral-800 p-4">
        <p className="mb-3 text-sm font-semibold">레이아웃 템플릿</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(PAGE_TEMPLATES) as PageTemplate[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTemplate(key)}
              aria-pressed={template === key}
              className={`rounded-lg border p-3 text-left transition active:scale-[0.98] ${
                template === key ? "border-point bg-point/10" : "border-neutral-700 hover:border-neutral-500"
              }`}
            >
              <p className="text-sm font-semibold">{PAGE_TEMPLATES[key].label}</p>
              <p className="mt-1 text-xs text-neutral-400">{PAGE_TEMPLATES[key].description}</p>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <ConfirmButton
            label={`'${PAGE_TEMPLATES[template].label}' 적용`}
            confirmLabel="지금 블록이 모두 바뀝니다. 한 번 더 누르기"
            onConfirm={() => {
              const keywords = category.blocks.flatMap((b) => (b.type === "keywords" ? b.keywords : []));
              onChange({
                blocks: buildTemplate(template, {
                  label: category.label,
                  seed: `${category.slug}-${Date.now()}`,
                  keywords: keywords.length ? keywords : ["키워드1", "키워드2", "키워드3"],
                  metas: keywords.length ? keywords : ["분류"],
                  accent: "#ff153c",
                }),
              });
            }}
          />
          <span className="text-xs text-neutral-500">적용 후에도 저장 전까지는 ‘되돌리기’로 취소할 수 있습니다.</span>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold">페이지 블록</p>
        <BlockEditor blocks={category.blocks} allowed={CATEGORY_BLOCKS} onChange={(blocks) => onChange({ blocks })} />
      </div>
    </Panel>
  );
}
