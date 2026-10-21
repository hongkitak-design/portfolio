"use client";

import { useState } from "react";
import {
  ColorInput,
  IconButton,
  ImageField,
  LayoutPicker,
  ListEditor,
  TextArea,
  TextInput,
  Toggle,
  move,
} from "@/app/admin/editor/fields";
import {
  BANNER_LAYOUTS,
  HERO_LAYOUTS,
  KEYWORD_LAYOUTS,
  ROW_LAYOUTS,
  TEXT_LAYOUTS,
  WORK_LAYOUTS,
  type Block,
  type BlockType,
} from "@/lib/schema";
import { BLOCK_LABELS, createBlock, newId, sampleImage } from "@/lib/templates";

type Update = (patch: Partial<Block>) => void;

function BlockFields({ block, update }: { block: Block; update: Update }) {
  switch (block.type) {
    case "hero":
      return (
        <>
          <LayoutPicker options={HERO_LAYOUTS} value={block.layout} onChange={(layout) => update({ layout })} />
          <ListEditor
            items={block.slides}
            onChange={(slides) => update({ slides })}
            addLabel="슬라이드 추가"
            itemTitle={(s, i) => `${i + 1}. ${s.title.replace(/\n/g, " ") || "(제목 없음)"}`}
            onAdd={() => ({
              id: newId(),
              badge: "NEW",
              title: "새 슬라이드",
              description: "",
              image: sampleImage(newId().slice(0, 8), 1600, 700),
              accent: "#ff153c",
            })}
            renderItem={(s, set) => (
              <>
                <ImageField label="이미지 (가로 1600px 이상 권장)" value={s.image} onChange={(image) => set({ image })} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextInput label="작은 제목 (뱃지)" value={s.badge} onChange={(badge) => set({ badge })} />
                  <ColorInput label="배경 색" value={s.accent} onChange={(accent) => set({ accent })} />
                </div>
                <TextArea label="제목 (줄바꿈 가능)" rows={2} value={s.title} onChange={(title) => set({ title })} />
                <TextInput label="설명" value={s.description} onChange={(description) => set({ description })} />
                <TextInput
                  label="클릭 시 이동 주소 (선택)"
                  placeholder="/eznet"
                  value={s.href ?? ""}
                  onChange={(href) => set({ href: href || undefined })}
                />
              </>
            )}
          />
        </>
      );
    case "circles":
      return (
        <>
          <TextInput label="제목 (비워두면 숨김)" value={block.title} onChange={(title) => update({ title })} />
          <p className="text-xs text-neutral-500">카테고리 목록이 순서대로 원형 메뉴로 나옵니다. 이미지는 각 카테고리 설정에서 바꿉니다.</p>
        </>
      );
    case "categoryRows":
      return (
        <>
          <LayoutPicker options={ROW_LAYOUTS} value={block.layout} onChange={(layout) => update({ layout })} />
          <TextInput
            label="카테고리당 보여줄 작업 수"
            value={String(block.limit)}
            onChange={(v) => update({ limit: Math.min(30, Math.max(1, Number(v.replace(/\D/g, "")) || 1)) })}
          />
          <p className="text-xs text-neutral-500">각 카테고리의 ‘작업 진열’ 블록에 있는 작업이 순서대로 나옵니다.</p>
        </>
      );
    case "keywords":
      return (
        <>
          <LayoutPicker options={KEYWORD_LAYOUTS} value={block.layout} onChange={(layout) => update({ layout })} />
          <TextInput label="제목" value={block.title} onChange={(title) => update({ title })} />
          <TextInput
            label="키워드 (쉼표로 구분)"
            value={block.keywords.join(", ")}
            onChange={(v) => update({ keywords: v.split(",").map((k) => k.trim()).filter(Boolean) })}
          />
        </>
      );
    case "banners":
      return (
        <>
          <LayoutPicker options={BANNER_LAYOUTS} value={block.layout} onChange={(layout) => update({ layout })} />
          <ListEditor
            items={block.items}
            onChange={(items) => update({ items })}
            addLabel="배너 추가"
            itemTitle={(b, i) => `${i + 1}. ${b.title || "(제목 없음)"}`}
            onAdd={() => ({ id: newId(), title: "새 배너", image: sampleImage(newId().slice(0, 8), 600, 600) })}
            renderItem={(b, set) => (
              <>
                <ImageField label="이미지" aspect="aspect-[4/5]" value={b.image} onChange={(image) => set({ image })} />
                <TextInput label="제목" value={b.title} onChange={(title) => set({ title })} />
                <TextInput
                  label="클릭 시 이동 주소 (선택)"
                  value={b.href ?? ""}
                  onChange={(href) => set({ href: href || undefined })}
                />
              </>
            )}
          />
        </>
      );
    case "works":
      return (
        <>
          <LayoutPicker options={WORK_LAYOUTS} value={block.layout} onChange={(layout) => update({ layout })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="제목" value={block.title} onChange={(title) => update({ title })} />
            <TextInput label="부제목" value={block.subtitle} onChange={(subtitle) => update({ subtitle })} />
          </div>
          <ListEditor
            items={block.items}
            onChange={(items) => update({ items })}
            addLabel="작업 추가"
            itemTitle={(w, i) => `${i + 1}. ${w.title || "(제목 없음)"}${w.tag ? ` · ${w.tag}` : ""}`}
            onAdd={() => ({
              id: newId(),
              title: "새 작업",
              description: "",
              image: sampleImage(newId().slice(0, 8), 600, 600),
              meta: "",
            })}
            renderItem={(w, set) => (
              <>
                <ImageField label="이미지 (정사각형 권장)" aspect="aspect-square" value={w.image} onChange={(image) => set({ image })} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextInput label="작업명" value={w.title} onChange={(title) => set({ title })} />
                  <TextInput label="분류 / 연도" value={w.meta} onChange={(meta) => set({ meta })} />
                </div>
                <TextArea label="설명" value={w.description} onChange={(description) => set({ description })} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextInput
                    label="뱃지 (BEST, NEW 등 · 선택)"
                    value={w.tag ?? ""}
                    onChange={(tag) => set({ tag: tag || undefined })}
                  />
                  <TextInput
                    label="링크 (선택)"
                    value={w.href ?? ""}
                    onChange={(href) => set({ href: href || undefined })}
                  />
                </div>
              </>
            )}
          />
        </>
      );
    case "text":
      return (
        <>
          <LayoutPicker options={TEXT_LAYOUTS} value={block.layout} onChange={(layout) => update({ layout })} />
          <TextInput label="제목" value={block.title} onChange={(title) => update({ title })} />
          <TextArea label="본문" rows={5} value={block.body} onChange={(body) => update({ body })} />
          {block.layout === "split" && (
            <ImageField label="이미지" aspect="aspect-square" value={block.image} onChange={(image) => update({ image })} />
          )}
        </>
      );
  }
}

const summary = (block: Block) => {
  switch (block.type) {
    case "hero":
      return `슬라이드 ${block.slides.length}개`;
    case "banners":
    case "works":
      return `${"title" in block && block.title ? `${block.title} · ` : ""}${block.items.length}개`;
    case "keywords":
      return block.keywords.join(", ");
    case "text":
      return block.title;
    default:
      return "";
  }
};

export default function BlockEditor({
  blocks,
  onChange,
  allowed,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  allowed: BlockType[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const updateBlock = (id: string, patch: Partial<Block>) =>
    onChange(blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)));

  const duplicate = (index: number) => {
    const copy = structuredClone(blocks[index]);
    copy.id = newId();
    // 복제한 블록 안의 항목 id 도 새로 만들어 겹치지 않게 합니다
    if (copy.type === "hero") copy.slides = copy.slides.map((s) => ({ ...s, id: newId() }));
    if (copy.type === "banners" || copy.type === "works") {
      copy.items = copy.items.map((item) => ({ ...item, id: newId() })) as typeof copy.items;
    }
    const next = [...blocks];
    next.splice(index + 1, 0, copy);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, i) => {
        const expanded = open === block.id;
        return (
          <section
            key={block.id}
            className={`rounded-xl border bg-neutral-900 transition ${
              block.visible ? "border-neutral-800" : "border-dashed border-neutral-800 opacity-60"
            }`}
          >
            <header className="flex flex-wrap items-center gap-2 px-3 py-2.5">
              <span className="grid h-6 w-6 place-items-center rounded bg-neutral-800 text-[11px] text-neutral-400">
                {i + 1}
              </span>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : block.id)}
                className="flex min-w-0 flex-1 items-baseline gap-2 text-left"
                aria-expanded={expanded}
              >
                <span className="font-semibold">{BLOCK_LABELS[block.type]}</span>
                <span className="truncate text-xs text-neutral-500">{summary(block)}</span>
              </button>
              <Toggle label="표시" checked={block.visible} onChange={(visible) => updateBlock(block.id, { visible })} />
              <IconButton label="위로" disabled={i === 0} onClick={() => onChange(move(blocks, i, i - 1))}>
                ↑
              </IconButton>
              <IconButton label="아래로" disabled={i === blocks.length - 1} onClick={() => onChange(move(blocks, i, i + 1))}>
                ↓
              </IconButton>
              <IconButton label="복제" onClick={() => duplicate(i)}>
                ⧉
              </IconButton>
              <IconButton label="블록 삭제" danger onClick={() => onChange(blocks.filter((b) => b.id !== block.id))}>
                ✕
              </IconButton>
            </header>
            {expanded && (
              <div className="flex flex-col gap-4 border-t border-neutral-800 p-4">
                <BlockFields block={block} update={(patch) => updateBlock(block.id, patch)} />
              </div>
            )}
          </section>
        );
      })}

      {adding ? (
        <div className="rounded-xl border border-neutral-700 p-3">
          <p className="mb-2 text-xs text-neutral-400">추가할 블록을 고르세요</p>
          <div className="flex flex-wrap gap-2">
            {allowed.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  const block = createBlock(type);
                  onChange([...blocks, block]);
                  setOpen(block.id);
                  setAdding(false);
                }}
                className="rounded-md bg-neutral-800 px-3 py-1.5 text-xs hover:bg-point active:scale-95"
              >
                {BLOCK_LABELS[type]}
              </button>
            ))}
            <button type="button" onClick={() => setAdding(false)} className="px-2 text-xs text-neutral-500">
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-xl border border-dashed border-neutral-700 py-3 text-sm text-neutral-400 transition hover:border-neutral-500 hover:text-white active:scale-[0.99]"
        >
          + 블록 추가
        </button>
      )}
    </div>
  );
}
