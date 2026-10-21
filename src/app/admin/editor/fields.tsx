"use client";

import { useRef, useState, type ReactNode } from "react";
import { uploadImage } from "@/app/admin/editor/upload";
import { LAYOUT_LABELS } from "@/lib/templates";

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-point";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-neutral-400">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-neutral-500">{hint}</span>}
    </label>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input className={inputClass} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea className={inputClass} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-neutral-700 bg-transparent"
        />
        <span className="font-mono text-xs text-neutral-400">{value}</span>
      </div>
    </Field>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-xs text-neutral-300"
    >
      <span className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-point" : "bg-neutral-700"}`}>
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${checked ? "left-4.5" : "left-0.5"}`}
        />
      </span>
      {label}
    </button>
  );
}

export function IconButton({
  label,
  onClick,
  disabled,
  children,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-7 min-w-7 place-items-center rounded-md px-1.5 text-xs transition active:scale-90 disabled:opacity-30 ${
        danger ? "text-red-400 hover:bg-red-500/15" : "text-neutral-300 hover:bg-neutral-800"
      }`}
    >
      {children}
    </button>
  );
}

// 브라우저 확인창 대신 두 번 눌러 확인하는 버튼
export function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
  className = "",
}: {
  label: string;
  confirmLabel: string;
  onConfirm: () => void;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else setArmed(true);
      }}
      onBlur={() => setArmed(false)}
      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
        armed ? "bg-red-500 text-white" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
      } ${className}`}
    >
      {armed ? confirmLabel : label}
    </button>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  aspect = "aspect-video",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ busy: boolean; error?: string }>({ busy: false });

  async function handleFile(file: File) {
    setStatus({ busy: true });
    try {
      onChange(await uploadImage(file));
      setStatus({ busy: false });
    } catch (error) {
      setStatus({ busy: false, error: error instanceof Error ? error.message : "업로드 실패" });
    }
  }

  return (
    <Field label={label}>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={`group relative w-28 shrink-0 overflow-hidden rounded-md border border-dashed border-neutral-600 bg-neutral-900 ${aspect}`}
          title="클릭하거나 이미지를 끌어다 놓으세요"
        >
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <span className="absolute inset-0 grid place-items-center bg-black/50 text-[11px] font-semibold opacity-0 transition group-hover:opacity-100">
            {status.busy ? "업로드 중…" : "이미지 교체"}
          </span>
          {status.busy && <span className="absolute inset-0 animate-pulse bg-black/60" />}
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <input
            className={inputClass}
            value={value}
            placeholder="이미지 주소 또는 업로드"
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status.busy}
            className="self-start rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-700 active:scale-95 disabled:opacity-50"
          >
            {status.busy ? "업로드 중…" : "파일 올리기"}
          </button>
          {status.error && <span className="text-[11px] text-red-400">{status.error}</span>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </Field>
  );
}

// 레이아웃 미리보기 그림
const LAYOUT_SHAPES: Record<string, ReactNode> = {
  slider: <div className="m-1 h-[calc(100%-8px)] rounded bg-current" />,
  full: <div className="h-full bg-current" />,
  split: (
    <div className="m-1 grid h-[calc(100%-8px)] grid-cols-2 gap-0.5">
      <div className="rounded-l bg-current opacity-50" />
      <div className="rounded-r bg-current" />
    </div>
  ),
  wide: (
    <div className="m-1 flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-3 flex-1 rounded-sm bg-current" />
      ))}
    </div>
  ),
  poster: (
    <div className="m-1 flex gap-0.5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-6 flex-1 rounded-sm bg-current" />
      ))}
    </div>
  ),
  center: <div className="mx-auto mt-3 h-1.5 w-2/3 rounded bg-current" />,
  left: <div className="mt-3 ml-1 h-1.5 w-2/3 rounded bg-current" />,
  grid2: (
    <div className="m-1 grid grid-cols-2 gap-0.5">
      {[0, 1].map((i) => (
        <div key={i} className="h-6 rounded-sm bg-current" />
      ))}
    </div>
  ),
  grid3: (
    <div className="m-1 grid grid-cols-3 gap-0.5">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-3 rounded-sm bg-current" />
      ))}
    </div>
  ),
  grid4: (
    <div className="m-1 grid grid-cols-4 gap-0.5">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="h-3 rounded-sm bg-current" />
      ))}
    </div>
  ),
  carousel: (
    <div className="my-1 ml-1 flex gap-0.5 overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-5 w-5 shrink-0 rounded-sm bg-current" />
      ))}
    </div>
  ),
  feature: (
    <div className="m-1 grid grid-cols-2 gap-0.5">
      <div className="h-6 rounded-sm bg-current" />
      <div className="grid grid-cols-2 gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-sm bg-current opacity-60" />
        ))}
      </div>
    </div>
  ),
  list: (
    <div className="m-1 flex flex-col gap-0.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-0.5">
          <div className="h-2 w-2 rounded-sm bg-current" />
          <div className="h-2 flex-1 rounded-sm bg-current opacity-50" />
        </div>
      ))}
    </div>
  ),
};

export function LayoutPicker<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="레이아웃">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option)}
            className={`flex w-24 flex-col items-center gap-1.5 rounded-lg border p-2 text-[11px] transition active:scale-95 ${
              active
                ? "border-point bg-point/10 text-white"
                : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
            }`}
          >
            <span
              className={`block h-9 w-full overflow-hidden rounded border border-neutral-700 bg-neutral-900 ${
                active ? "text-point" : "text-neutral-600"
              }`}
            >
              {LAYOUT_SHAPES[option]}
            </span>
            {LAYOUT_LABELS[option] ?? option}
          </button>
        );
      })}
    </div>
  );
}

export const move = <T,>(list: T[], from: number, to: number) => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

// 항목 목록 편집: 순서 변경 / 삭제 / 추가
export function ListEditor<T extends { id: string }>({
  items,
  onChange,
  onAdd,
  addLabel,
  renderItem,
  itemTitle,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  onAdd: () => NoInfer<T>;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  itemTitle: (item: T, index: number) => string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const expanded = open === item.id;
        return (
          <div key={item.id} className="rounded-lg border border-neutral-800 bg-neutral-900/60">
            <div className="flex items-center gap-1 px-2 py-1.5">
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : item.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm"
                aria-expanded={expanded}
              >
                <span className="text-neutral-500">{expanded ? "▾" : "▸"}</span>
                <span className="truncate">{itemTitle(item, i)}</span>
              </button>
              <IconButton label="위로" disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))}>
                ↑
              </IconButton>
              <IconButton label="아래로" disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))}>
                ↓
              </IconButton>
              <IconButton label="삭제" danger onClick={() => onChange(items.filter((x) => x.id !== item.id))}>
                ✕
              </IconButton>
            </div>
            {expanded && (
              <div className="flex flex-col gap-3 border-t border-neutral-800 p-3">
                {renderItem(item, (patch) => onChange(items.map((x) => (x.id === item.id ? { ...x, ...patch } : x))))}
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          const item = onAdd();
          onChange([...items, item]);
          setOpen(item.id);
        }}
        className="rounded-lg border border-dashed border-neutral-700 py-2 text-xs text-neutral-400 transition hover:border-neutral-500 hover:text-white active:scale-[0.99]"
      >
        + {addLabel}
      </button>
    </div>
  );
}
