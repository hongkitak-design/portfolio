"use client";

import { DesktopIcon, DeviceMobileIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { PreviewEvent, PreviewRender } from "@/app/admin/editor/preview";

type Device = "desktop" | "mobile";

// 미리보기는 실제 화면 폭으로 그린 뒤 패널 크기에 맞게 축소해서 보여줍니다
const WIDTH: Record<Device, number> = { desktop: 1440, mobile: 390 };

type Props = Omit<PreviewRender, "type"> & {
  label: string;
  note?: string;
  onNavigate: (href: string) => void;
  onClose?: () => void;
};

export default function PreviewPane({ label, note, onNavigate, onClose, ...render }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setBox({ width: entry.contentRect.width, height: entry.contentRect.height }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent<PreviewEvent>) => {
      if (e.origin !== location.origin || e.source !== frameRef.current?.contentWindow) return;
      if (e.data?.type === "preview:ready") setReady(true);
      if (e.data?.type === "preview:navigate") onNavigate(e.data.href);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onNavigate]);

  // 편집할 때마다 저장 전 설정을 미리보기로 보냅니다
  const { config, page, blocks, focus } = render;
  useEffect(() => {
    if (!ready) return;
    const message: PreviewRender = { type: "preview:render", config, page, blocks, focus };
    frameRef.current?.contentWindow?.postMessage(message, location.origin);
  }, [ready, config, page, blocks, focus]);

  const width = WIDTH[device];
  const scale = box.width ? Math.min(1, box.width / width) : 0;
  const offset = Math.max(0, (box.width - width * scale) / 2);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-neutral-800 px-3 py-2">
        <span className="truncate text-xs font-semibold">미리보기 · {label}</span>
        {note && (
          <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-300">{note}</span>
        )}
        <div className="ml-auto flex shrink-0 rounded-md bg-neutral-900 p-0.5">
          {(["desktop", "mobile"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d === "desktop" ? "데스크톱" : "모바일"}
              aria-pressed={device === d}
              onClick={() => setDevice(d)}
              className={`rounded p-1.5 transition ${device === d ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"}`}
            >
              {d === "desktop" ? <DesktopIcon size={14} /> : <DeviceMobileIcon size={14} />}
            </button>
          ))}
        </div>
        {onClose && (
          <button
            type="button"
            aria-label="미리보기 닫기"
            onClick={onClose}
            className="rounded p-1.5 hover:bg-neutral-800"
          >
            <XIcon size={14} />
          </button>
        )}
      </div>
      <div ref={boxRef} className="relative min-h-0 flex-1 overflow-hidden bg-neutral-900">
        {scale > 0 && (
          <iframe
            ref={frameRef}
            src="/admin/preview"
            title="사이트 미리보기"
            className="absolute top-0 border-0 bg-background"
            style={{
              left: offset,
              width,
              height: box.height / scale,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        )}
        {!ready && (
          <p className="absolute inset-0 grid place-items-center text-xs text-neutral-500">미리보기 준비 중…</p>
        )}
      </div>
    </div>
  );
}
