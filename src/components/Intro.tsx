"use client";

import { KeyReturnIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import SmartImage from "@/components/SmartImage";

const WORD = "portfolio";
const TYPO = "portfoi";
const RIBBONS = 18;

// 사람이 치듯 한 번 오타를 냈다가 지우고 다시 칩니다: portfoi → portfo → portfolio
const STEPS = [
  ...Array.from(TYPO, (_, i) => TYPO.slice(0, i + 1)),
  TYPO.slice(0, -1),
  ...Array.from(WORD.slice(TYPO.length - 1), (_, i) => WORD.slice(0, TYPO.length + i)),
];

function stepDelay(step: number) {
  if (step === 0) return 700;
  if (step === TYPO.length) return 480; // 오타를 알아채는 순간
  if (step === TYPO.length + 1) return 260; // 지운 뒤 다시 치기 전
  return 70 + ((step * 53) % 7) * 16;
}

// typing → ready(엔터 대기) → commit(글자가 흩어짐) → logo(로고 등장) → exit(줌인하며 사이트 공개) → done
type Phase = "typing" | "ready" | "commit" | "logo" | "exit" | "done";

const NEXT: Partial<Record<Phase, [Phase, number]>> = {
  commit: ["logo", 650],
  logo: ["exit", 1500],
  exit: ["done", 1100],
};

const seen = () => document.documentElement.dataset.intro === "seen";

// 세션당 한 번, portfolio 를 타이핑하고 엔터를 누르면 넷플릭스처럼 로고가 줌인되며 사이트가 열립니다
export default function Intro({ logo, name }: { logo: string; name: string }) {
  const [phase, setPhase] = useState<Phase>("typing");
  const [step, setStep] = useState(-1);

  const enter = useCallback(() => setPhase((p) => (p === "typing" || p === "ready" ? "commit" : p)), []);
  const skip = useCallback(() => setPhase((p) => (p === "exit" || p === "done" ? p : "exit")), []);

  // 인트로가 재생되는 동안 사이트를 숨기고 스크롤을 막습니다
  useEffect(() => {
    if (!seen()) document.documentElement.dataset.intro = "playing";
  }, []);

  useEffect(() => {
    if (phase !== "typing" || seen()) return;
    const last = step >= STEPS.length - 1;
    const t = setTimeout(() => (last ? setPhase("ready") : setStep((s) => s + 1)), last ? 300 : stepDelay(step + 1));
    return () => clearTimeout(t);
  }, [phase, step]);

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

  const typing = phase === "typing" || phase === "ready" || phase === "commit";
  const text = phase === "typing" ? (STEPS[step] ?? "") : WORD;

  return (
    <div
      role="dialog"
      aria-label={`${name} 인트로`}
      onClick={enter}
      className={`intro fixed inset-0 z-[100] grid cursor-pointer place-items-center overflow-hidden bg-background select-none ${
        phase === "exit" ? "animate-intro-out" : ""
      }`}
    >
      {typing && (
        <div className="w-full max-w-[1400px] px-6 sm:px-16">
          <p
            aria-label={WORD}
            className="flex items-center text-6xl leading-none font-bold tracking-[-0.04em] sm:text-9xl"
          >
            {Array.from(text, (char, i) => (
              <span
                key={i}
                aria-hidden
                className={phase === "commit" ? "animate-intro-letter-out" : ""}
                style={phase === "commit" ? { animationDelay: `${i * 28}ms` } : undefined}
              >
                {char}
              </span>
            ))}
            {/* 실제 텍스트 커서처럼, 치는 동안엔 켜져 있고 멈추면 깜빡입니다 */}
            <span
              aria-hidden
              className={`ml-[0.06em] inline-block h-[0.82em] w-[0.07em] translate-y-[0.04em] bg-point ${
                phase === "ready" ? "animate-caret" : phase === "commit" ? "opacity-0" : ""
              }`}
            />
          </p>

          <p
            className={`mt-8 flex h-6 items-center gap-2 text-sm text-neutral-400 transition-opacity duration-500 sm:mt-10 ${
              phase === "ready" ? "opacity-100" : "opacity-0"
            }`}
          >
            <KeyReturnIcon size={18} className="hidden text-neutral-300 sm:block" />
            <span className="hidden sm:inline">Enter 키를 눌러 입장</span>
            <span className="sm:hidden">화면을 탭해 입장</span>
          </p>
        </div>
      )}

      {!typing && (
        <>
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
          className="absolute right-6 bottom-6 text-sm text-neutral-500 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          건너뛰기
        </button>
      )}
    </div>
  );
}
