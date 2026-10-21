"use client";

import { useCallback, useEffect, useState } from "react";
import SmartImage from "@/components/SmartImage";

const COMMAND = "portfolio";
const BOOT_LINES = ["loading works", "loading projects", "ready"];
const RIBBONS = 18;

// typing → ready(엔터 대기) → boot(로딩 로그) → logo(로고 등장) → exit(줌인하며 사이트 공개) → done
type Phase = "typing" | "ready" | "boot" | "logo" | "exit" | "done";

const NEXT: Partial<Record<Phase, [Phase, number]>> = {
  boot: ["logo", 1000],
  logo: ["exit", 1700],
  exit: ["done", 1100],
};

const seen = () => document.documentElement.dataset.intro === "seen";

// 세션당 한 번, 터미널에 portfolio 를 타이핑하고 엔터를 누르면 넷플릭스처럼 로고가 줌인되며 사이트가 열립니다
export default function Intro({ logo, name }: { logo: string; name: string }) {
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0);

  const enter = useCallback(() => setPhase((p) => (p === "typing" || p === "ready" ? "boot" : p)), []);
  const skip = useCallback(() => setPhase((p) => (p === "exit" || p === "done" ? p : "exit")), []);

  // 인트로가 재생되는 동안 사이트를 숨기고 스크롤을 막습니다
  useEffect(() => {
    if (!seen()) document.documentElement.dataset.intro = "playing";
  }, []);

  useEffect(() => {
    if (phase !== "typing" || seen()) return;
    if (typed >= COMMAND.length) {
      const t = setTimeout(() => setPhase("ready"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 900 : 70 + Math.random() * 110);
    return () => clearTimeout(t);
  }, [phase, typed]);

  useEffect(() => {
    const html = document.documentElement;
    if (phase === "exit") html.dataset.intro = "reveal";
    if (phase === "done") {
      html.dataset.intro = "seen";
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
    }
    const next = NEXT[phase];
    if (!next) return;
    const t = setTimeout(() => setPhase(next[0]), next[1]);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing" && phase !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      } else if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, enter, skip]);

  if (phase === "done") return null;

  const terminal = phase === "typing" || phase === "ready" || phase === "boot";
  const text = phase === "typing" ? COMMAND.slice(0, typed) : COMMAND;

  return (
    <div
      role="dialog"
      aria-label={`${name} 인트로`}
      onClick={enter}
      className={`intro fixed inset-0 z-[100] grid cursor-pointer place-items-center overflow-hidden bg-black select-none ${
        phase === "exit" ? "animate-intro-out" : ""
      }`}
    >
      {terminal && (
        <div className="w-full max-w-3xl px-6 font-mono">
          <p className="mb-5 text-xs tracking-[0.3em] text-neutral-600 uppercase sm:text-sm">~/{name}</p>
          <div className="flex items-center text-4xl font-bold sm:text-7xl">
            <span className="mr-3 text-point sm:mr-5">&gt;</span>
            <span>{text}</span>
            <span
              aria-hidden
              className={`ml-1 inline-block h-[0.9em] w-[0.5em] bg-white ${phase === "boot" ? "opacity-0" : "animate-caret"}`}
            />
          </div>

          <div className="mt-10 h-24 text-sm text-neutral-400 sm:text-base">
            {phase === "ready" && (
              <p className="animate-intro-hint">
                <span className="hidden sm:inline">
                  Press <kbd className="mx-1 rounded-md border border-neutral-600 px-2 py-1 text-white">Enter ↵</kbd> to start
                </span>
                <span className="sm:hidden">Tap to start</span>
              </p>
            )}
            {phase === "boot" &&
              BOOT_LINES.map((line, i) => (
                <p key={line} className="animate-intro-line opacity-0" style={{ animationDelay: `${i * 260}ms` }}>
                  <span className="text-point">✓</span> {line}
                  {i < BOOT_LINES.length - 1 && <span className="text-neutral-600"> ... done</span>}
                </p>
              ))}
          </div>
        </div>
      )}

      {!terminal && (
        <>
          <div aria-hidden className="animate-intro-glow absolute h-[60vmin] w-[60vmin] rounded-full bg-point/40 blur-3xl" />
          {phase === "exit" && (
            <div aria-hidden className="absolute inset-0 flex">
              {Array.from({ length: RIBBONS }, (_, i) => (
                <span
                  key={i}
                  className="animate-intro-ribbon h-full flex-1 origin-center bg-point"
                  style={{
                    animationDelay: `${Math.abs(i - RIBBONS / 2) * 25}ms`,
                    filter: `brightness(${0.45 + ((i * 37) % 10) / 10})`,
                  }}
                />
              ))}
            </div>
          )}
          <span
            className={`relative block h-16 w-72 sm:h-24 sm:w-[28rem] ${
              phase === "exit" ? "animate-intro-zoom" : "animate-intro-logo"
            }`}
          >
            <SmartImage src={logo} alt={name} fill loading="eager" sizes="448px" className="object-contain" />
          </span>
        </>
      )}

      {phase !== "exit" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            skip();
          }}
          className="absolute right-5 bottom-5 rounded-full border border-neutral-700 px-4 py-1.5 font-mono text-xs text-neutral-400 transition hover:border-white hover:text-white"
        >
          Skip ⏭
        </button>
      )}
    </div>
  );
}
