"use client";

import { CheckIcon, CopyIcon, ImagesIcon } from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";
import { ConfirmButton } from "@/app/admin/editor/fields";
import { Thumb, UploadButton, UploadStatus, useImageLibrary } from "@/app/admin/editor/library";
import { countImageRefs } from "@/lib/imageRefs";
import type { StoredImage } from "@/lib/images";
import type { SiteConfig } from "@/lib/schema";

type Filter = "all" | "used" | "unused";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "used", label: "사용 중" },
  { key: "unused", label: "미사용" },
];

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ko-KR", { year: "2-digit", month: "2-digit", day: "2-digit" });

type Props = {
  config: SiteConfig;
  savedConfig: SiteConfig;
  onReplace: (from: string, to: string) => void;
  notify: (type: "ok" | "error", text: string) => void;
};

// 보관함 관리: 여러 장 올리기, 사용처 확인, 교체(쓰인 곳 전부 바꾸기), 삭제
export default function ImagesPanel({ config, savedConfig, onReplace, notify }: Props) {
  const { images, loading, error, progress, upload, remove } = useImageLibrary();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  // 편집 중인 설정과 저장된(사이트에 나가 있는) 설정 둘 다에서 찾습니다
  const refs = useMemo(() => countImageRefs(config), [config]);
  const liveRefs = useMemo(() => countImageRefs(savedConfig), [savedConfig]);
  const uses = (url: string) => Math.max(refs.get(url) ?? 0, liveRefs.get(url) ?? 0);

  const visible = images.filter((image) =>
    filter === "all" ? true : filter === "used" ? uses(image.url) > 0 : uses(image.url) === 0,
  );
  const unused = images.filter((image) => uses(image.url) === 0);

  const deleteUrls = async (urls: string[]) => {
    setBusy(true);
    try {
      await remove(urls);
      setSelected((s) => s.filter((u) => !urls.includes(u)));
      notify("ok", `${urls.length}장을 삭제했습니다.`);
    } catch (e) {
      notify("error", e instanceof Error ? e.message : "삭제에 실패했습니다");
    } finally {
      setBusy(false);
    }
  };

  const toggle = (url: string) => setSelected((s) => (s.includes(url) ? s.filter((x) => x !== url) : [...s, url]));
  const selectedInUse = selected.filter((url) => uses(url) > 0).length;

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold">이미지 보관함</h2>
        <p className="mt-1 text-sm text-neutral-400">
          올린 이미지를 한곳에서 관리합니다. 여기 있는 이미지는 블록 편집의 ‘보관함에서 선택’으로 바로 넣을 수 있습니다.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-800 p-4">
        <UploadButton label="여러 장 올리기" className="px-4 py-2" />
        <span className="text-xs text-neutral-500">
          여러 장을 고르거나 버튼 위로 끌어다 놓으세요. 큰 사진은 자동으로 줄여 올립니다.
        </span>
        <div className="w-full">
          <UploadStatus progress={progress} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md bg-neutral-900 p-0.5" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded px-3 py-1 text-xs transition ${
                filter === f.key ? "bg-neutral-700 font-semibold text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {f.label}
              <span className="ml-1 text-neutral-500">
                {f.key === "all" ? images.length : f.key === "unused" ? unused.length : images.length - unused.length}
              </span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {selected.length > 0 && (
            <>
              <span className="text-xs text-neutral-400">{selected.length}장 선택</span>
              <button
                type="button"
                onClick={() => setSelected([])}
                className="px-1 text-xs text-neutral-500 hover:text-white"
              >
                선택 해제
              </button>
              <ConfirmButton
                label="선택 삭제"
                confirmLabel={
                  selectedInUse
                    ? `${selectedInUse}장은 사용 중입니다. 그래도 삭제?`
                    : `${selected.length}장 삭제? 한 번 더`
                }
                onConfirm={() => deleteUrls(selected)}
              />
            </>
          )}
          {!selected.length && unused.length > 0 && (
            <ConfirmButton
              label={`미사용 ${unused.length}장 정리`}
              confirmLabel={`미사용 ${unused.length}장 삭제? 한 번 더`}
              onConfirm={() => deleteUrls(unused.map((i) => i.url))}
            />
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {!error && !loading && !visible.length && (
        <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-neutral-800 py-16 text-center text-sm text-neutral-400">
          <ImagesIcon size={32} className="text-neutral-600" />
          {images.length
            ? "이 조건에 맞는 이미지가 없습니다."
            : "아직 올린 이미지가 없습니다. ‘여러 장 올리기’로 시작하세요."}
        </div>
      )}

      <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${busy ? "pointer-events-none opacity-60" : ""}`}>
        {loading && !images.length
          ? Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-neutral-900" />
            ))
          : visible.map((image) => (
              <ImageCard
                key={image.url}
                image={image}
                uses={uses(image.url)}
                selected={selected.includes(image.url)}
                onToggle={() => toggle(image.url)}
                onDelete={() => deleteUrls([image.url])}
                onReplace={async (file) => {
                  const [url] = await upload([file]);
                  if (!url) return notify("error", "새 이미지를 올리지 못했습니다");
                  onReplace(image.url, url);
                  notify(
                    "ok",
                    "교체했습니다. 저장하면 사이트에 반영됩니다. 이전 이미지는 ‘미사용’에서 정리할 수 있습니다.",
                  );
                }}
                onCopy={async () => {
                  const absolute = new URL(image.url, location.origin).href;
                  await navigator.clipboard.writeText(absolute);
                  notify("ok", "이미지 주소를 복사했습니다.");
                }}
              />
            ))}
      </ul>
    </section>
  );
}

function ImageCard({
  image,
  uses,
  selected,
  onToggle,
  onDelete,
  onReplace,
  onCopy,
}: {
  image: StoredImage;
  uses: number;
  selected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onReplace: (file: File) => void;
  onCopy: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <li
      className={`overflow-hidden rounded-lg border bg-neutral-900 transition ${
        selected ? "border-point" : "border-neutral-800"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        aria-label={`${image.name} 선택`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-neutral-950"
      >
        <Thumb src={image.url} />
        <span
          className={`absolute top-2 left-2 grid h-5 w-5 place-items-center rounded border text-[11px] ${
            selected ? "border-point bg-point" : "border-white/60 bg-black/40"
          }`}
        >
          {selected && <CheckIcon size={12} weight="bold" />}
        </span>
      </button>
      <div className="flex flex-col gap-2 p-2.5">
        <div className="flex items-center gap-2 text-[11px]">
          <span
            className={`rounded-full px-2 py-0.5 ${uses ? "bg-emerald-500/15 text-emerald-300" : "bg-neutral-800 text-neutral-400"}`}
          >
            {uses ? `사용 중 ${uses}곳` : "미사용"}
          </span>
          <span className="ml-auto text-neutral-500">
            {formatSize(image.size)} · {formatDate(image.uploadedAt)}
          </span>
        </div>
        <p className="truncate text-xs text-neutral-400" title={image.name}>
          {image.name}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-md bg-neutral-800 px-2.5 py-1 text-[11px] font-semibold hover:bg-neutral-700"
          >
            교체
          </button>
          <button
            type="button"
            onClick={onCopy}
            aria-label="주소 복사"
            title="주소 복사"
            className="rounded-md bg-neutral-800 px-2 py-1 text-[11px] hover:bg-neutral-700"
          >
            <CopyIcon size={13} />
          </button>
          <ConfirmButton
            label="삭제"
            confirmLabel={uses ? "사용 중! 그래도 삭제?" : "삭제? 한 번 더"}
            className="ml-auto px-2.5! py-1! text-[11px]"
            onConfirm={onDelete}
          />
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onReplace(file);
          e.target.value = "";
        }}
      />
    </li>
  );
}
