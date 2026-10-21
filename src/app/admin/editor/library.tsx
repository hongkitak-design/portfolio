"use client";

import { CheckIcon, ImagesIcon, UploadSimpleIcon, XIcon } from "@phosphor-icons/react";
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { uploadImage } from "@/app/admin/editor/upload";
import type { StoredImage } from "@/lib/images";

// 이미지 보관함: 관리 화면과 이미지 선택 창이 같은 목록을 함께 씁니다

type UploadProgress = { done: number; total: number; failed: string[] };

type Library = {
  images: StoredImage[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  upload: (files: File[]) => Promise<string[]>;
  progress: UploadProgress | null;
  remove: (urls: string[]) => Promise<void>;
};

const LibraryContext = createContext<Library | null>(null);

export function useImageLibrary() {
  const library = use(LibraryContext);
  if (!library) throw new Error("ImageLibraryProvider 안에서만 쓸 수 있습니다");
  return library;
}

const CONCURRENCY = 3;

export function ImageLibraryProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/images", { cache: "no-store" });
      const data = (await res.json()) as { images?: StoredImage[]; error?: string };
      if (!res.ok || !data.images) throw new Error(data.error ?? "목록을 불러오지 못했습니다");
      setImages(data.images);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "목록을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 처음 한 번 서버 목록을 불러옵니다
    refresh();
  }, [refresh]);

  // 여러 장을 3개씩 나눠 올리고, 올린 순서대로 주소를 돌려줍니다 (실패한 파일은 빠짐)
  const upload = useCallback(
    async (files: File[]) => {
      const urls: (string | null)[] = new Array(files.length).fill(null);
      const failed: string[] = [];
      let next = 0;
      let done = 0;
      setProgress({ done: 0, total: files.length, failed });
      const worker = async () => {
        while (next < files.length) {
          const index = next++;
          try {
            urls[index] = await uploadImage(files[index]);
          } catch (e) {
            failed.push(`${files[index].name}: ${e instanceof Error ? e.message : "실패"}`);
          }
          done++;
          setProgress({ done, total: files.length, failed: [...failed] });
        }
      };
      await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));
      await refresh();
      if (!failed.length) setProgress(null);
      return urls.filter((u): u is string => Boolean(u));
    },
    [refresh],
  );

  const remove = useCallback(
    async (urls: string[]) => {
      const res = await fetch("/api/admin/images", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      await refresh();
      if (!res.ok) throw new Error(data.error ?? "삭제에 실패했습니다");
    },
    [refresh],
  );

  const value = useMemo(
    () => ({ images, loading, error, refresh, upload, progress, remove }),
    [images, loading, error, refresh, upload, progress, remove],
  );
  return <LibraryContext value={value}>{children}</LibraryContext>;
}

export function UploadStatus({ progress }: { progress: UploadProgress | null }) {
  if (!progress) return null;
  const finished = progress.done === progress.total;
  return (
    <div className="text-xs" role="status">
      <p className={finished ? "text-neutral-400" : "text-amber-300"}>
        {finished
          ? `업로드 완료 ${progress.total - progress.failed.length}/${progress.total}`
          : `업로드 중 ${progress.done}/${progress.total}`}
      </p>
      {progress.failed.map((f) => (
        <p key={f} className="text-red-400">
          {f}
        </p>
      ))}
    </div>
  );
}

// 파일 고르기 + 끌어다 놓기로 여러 장 올리기
export function UploadButton({
  onUploaded,
  label = "이미지 올리기",
  className = "",
}: {
  onUploaded?: (urls: string[]) => void;
  label?: string;
  className?: string;
}) {
  const { upload, progress } = useImageLibrary();
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = Boolean(progress && progress.done < progress.total);

  const handle = async (list: FileList | null) => {
    const files = Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    onUploaded?.(await upload(files));
  };

  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handle(e.dataTransfer.files);
        }}
        className={`flex items-center justify-center gap-2 rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-semibold transition hover:bg-neutral-700 active:scale-95 disabled:opacity-50 ${className}`}
      >
        <UploadSimpleIcon size={14} weight="bold" />
        {busy ? `업로드 중 ${progress!.done}/${progress!.total}` : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}

export function Thumb({ src, className = "" }: { src: string; className?: string }) {
  return (
    // 관리 화면 썸네일은 원본 비율 그대로 빠르게 보여주려고 img 를 씁니다
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} />
  );
}

// 보관함에서 이미지 고르기 (여러 장 선택 가능)
export function ImagePicker({
  open,
  multiple = false,
  onClose,
  onSelect,
}: {
  open: boolean;
  multiple?: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
}) {
  const { images, loading, error, progress } = useImageLibrary();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => {
    setSelected([]);
    onClose();
  };

  const toggle = (url: string) => {
    if (!multiple) {
      onSelect([url]);
      close();
      return;
    }
    setSelected((s) => (s.includes(url) ? s.filter((x) => x !== url) : [...s, url]));
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onClick={(e) => e.target === dialogRef.current && close()}
      className="m-auto max-h-[85dvh] w-[min(960px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-0 text-neutral-100 backdrop:bg-black/70"
    >
      <div className="flex max-h-[85dvh] flex-col">
        <header className="flex flex-wrap items-center gap-3 border-b border-neutral-800 px-4 py-3">
          <h2 className="font-bold">{multiple ? "이미지 여러 장 선택" : "이미지 선택"}</h2>
          <span className="text-xs text-neutral-500">{images.length}장</span>
          <div className="ml-auto flex items-center gap-2">
            <UploadButton
              label="새로 올리기"
              onUploaded={(urls) => (multiple ? setSelected((s) => [...s, ...urls]) : urls[0] && toggle(urls[0]))}
            />
            <button type="button" aria-label="닫기" onClick={close} className="rounded-md p-1.5 hover:bg-neutral-800">
              <XIcon size={16} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <UploadStatus progress={progress} />
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!error && !loading && !images.length && (
            <div className="grid place-items-center gap-2 py-16 text-center text-sm text-neutral-400">
              <ImagesIcon size={32} className="text-neutral-600" />
              아직 올린 이미지가 없습니다. ‘새로 올리기’로 여러 장을 한 번에 올릴 수 있습니다.
            </div>
          )}
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {loading && !images.length
              ? Array.from({ length: 12 }, (_, i) => (
                  <li key={i} className="aspect-square animate-pulse rounded-md bg-neutral-900" />
                ))
              : images.map((image) => {
                  const order = selected.indexOf(image.url);
                  return (
                    <li key={image.url}>
                      <button
                        type="button"
                        onClick={() => toggle(image.url)}
                        aria-pressed={order >= 0}
                        title={image.name}
                        className={`relative block aspect-square w-full overflow-hidden rounded-md bg-neutral-900 ring-2 transition active:scale-95 ${
                          order >= 0 ? "ring-point" : "ring-transparent hover:ring-neutral-500"
                        }`}
                      >
                        <Thumb src={image.url} />
                        {order >= 0 && (
                          <span className="absolute top-1.5 right-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-point px-1 text-[11px] font-bold">
                            {order + 1}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
          </ul>
        </div>

        {multiple && (
          <footer className="flex items-center gap-3 border-t border-neutral-800 px-4 py-3">
            <span className="text-xs text-neutral-400">
              {selected.length ? `${selected.length}장 선택 · 고른 순서대로 추가됩니다` : "추가할 이미지를 고르세요"}
            </span>
            <button
              type="button"
              disabled={!selected.length}
              onClick={() => {
                onSelect(selected);
                close();
              }}
              className="ml-auto flex items-center gap-1.5 rounded-md bg-point px-4 py-1.5 text-xs font-bold transition active:scale-95 disabled:opacity-40"
            >
              <CheckIcon size={14} weight="bold" />
              {selected.length ? `${selected.length}개 추가` : "추가"}
            </button>
          </footer>
        )}
      </div>
    </dialog>
  );
}
