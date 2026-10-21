"use client";

import { CaretLeftIcon, CaretRightIcon, PlayIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useState } from "react";
import SmartImage from "@/components/SmartImage";
import type { BlockOf, Slide } from "@/lib/schema";

type Layout = BlockOf<"hero">["layout"];

const FRAME: Record<Layout, string> = {
  slider: "mx-auto max-w-[1400px] px-4 pt-4 sm:px-6",
  split: "mx-auto max-w-[1400px] px-4 pt-4 sm:px-6",
  full: "",
};

const BOX: Record<Layout, string> = {
  slider: "aspect-[16/10] rounded-xl sm:aspect-[16/6]",
  split: "aspect-[4/5] rounded-xl sm:aspect-[16/6]",
  full: "h-[70dvh] min-h-[420px] -mt-16",
};

function SlideContent({
  slide,
  layout,
  active,
  priority,
}: {
  slide: Slide;
  layout: Layout;
  active: boolean;
  priority: boolean;
}) {
  // 보이는 슬라이드의 이미지만 천천히 제자리로 돌아와 전환에 깊이를 줍니다
  const image = `object-cover transition-transform duration-[6s] ease-out ${active ? "scale-100" : "scale-110"}`;

  if (layout === "split") {
    return (
      <div className="grid h-full sm:grid-cols-2" style={{ background: slide.accent }}>
        <div className="order-2 flex flex-col justify-center p-6 sm:order-1 sm:p-14">
          <p className="mb-3 text-xs font-black tracking-widest sm:text-sm">{slide.badge}</p>
          <h2 className="mb-4 text-3xl leading-tight font-black tracking-tight whitespace-pre-line sm:text-5xl">
            {slide.title}
          </h2>
          <p className="max-w-[48ch] text-sm text-white/85 sm:text-lg">{slide.description}</p>
        </div>
        <div className="relative order-1 min-h-40 overflow-hidden sm:order-2">
          <SmartImage
            src={slide.image}
            fill
            preload={priority}
            sizes="(max-width: 640px) 100vw, 50vw"
            className={image}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <SmartImage src={slide.image} fill preload={priority} sizes="100vw" className={image} />
      <div
        className="absolute inset-0"
        style={{
          background:
            layout === "full"
              ? "linear-gradient(0deg, var(--background) 0%, transparent 55%), linear-gradient(90deg, #0a0a0bcc 0%, transparent 60%)"
              : `linear-gradient(90deg, ${slide.accent}ee 0%, ${slide.accent}99 35%, transparent 75%)`,
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      <div
        className={`absolute max-w-[80%] ${
          layout === "full"
            ? "bottom-16 left-1/2 w-full max-w-[1400px] -translate-x-1/2 px-6 sm:bottom-24"
            : "bottom-8 left-6 sm:bottom-14 sm:left-12"
        }`}
      >
        <p className="mb-3 flex items-center gap-1.5 text-xs font-black tracking-widest sm:text-sm">
          <PlayIcon weight="fill" /> {slide.badge}
        </p>
        <h2 className="mb-4 pb-1 text-3xl leading-[1.15] font-black tracking-tight whitespace-pre-line italic sm:text-6xl">
          {slide.title}
        </h2>
        <p className="max-w-[48ch] text-sm text-white/85 sm:text-lg">{slide.description}</p>
      </div>
    </>
  );
}

export default function HeroSlider({ slides, layout = "slider" }: { slides: Slide[]; layout?: Layout }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = slides.length ? index % slides.length : 0;

  const go = useCallback((next: number) => setIndex((next + slides.length) % slides.length), [slides.length]);

  if (!slides.length) return null;

  const arrow =
    "grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:bg-black/70 active:scale-90";

  return (
    <section
      className={`relative ${FRAME[layout]}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={`relative overflow-hidden ${BOX[layout]}`}>
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            aria-hidden={i !== current}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {slide.href ? (
              <Link href={slide.href} tabIndex={i === current ? 0 : -1} className="relative block h-full w-full">
                <SlideContent slide={slide} layout={layout} active={i === current} priority={i === 0} />
              </Link>
            ) : (
              <SlideContent slide={slide} layout={layout} active={i === current} priority={i === 0} />
            )}
          </div>
        ))}

        {slides.length > 1 && (
          <>
            {/* 진행 바가 다 차면 다음 슬라이드로 넘어갑니다. 마우스를 올리면 바와 함께 멈춥니다 */}
            <div className="absolute right-4 bottom-4 z-10 flex items-center gap-3 sm:right-8 sm:bottom-7">
              <button type="button" aria-label="이전" onClick={() => go(current - 1)} className={arrow}>
                <CaretLeftIcon size={16} weight="bold" />
              </button>
              <div className="flex items-center">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`${i + 1}번 슬라이드`}
                    aria-current={i === current}
                    onClick={() => go(i)}
                    className="group/dot px-1 py-3"
                  >
                    <span
                      className={`relative block h-1.5 overflow-hidden rounded-full bg-white/35 transition-all ${
                        i === current ? "w-8" : "w-1.5 group-hover/dot:bg-white/60"
                      }`}
                    >
                      {i === current && (
                        <span
                          key={current}
                          onAnimationEnd={() => go(current + 1)}
                          className="animate-slide-progress absolute inset-0 origin-left rounded-full bg-white"
                          style={{ animationPlayState: paused ? "paused" : "running" }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" aria-label="다음" onClick={() => go(current + 1)} className={arrow}>
                <CaretRightIcon size={16} weight="bold" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
