"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import SmartImage from "@/components/SmartImage";
import type { BlockOf, Slide } from "@/lib/schema";

type Layout = BlockOf<"hero">["layout"];

const FRAME: Record<Layout, string> = {
  slider: "mx-auto max-w-[1400px] px-4 pt-4 sm:px-6",
  split: "mx-auto max-w-[1400px] px-4 pt-4 sm:px-6",
  full: "",
};

const BOX: Record<Layout, string> = {
  slider: "aspect-[16/10] rounded-2xl sm:aspect-[16/6] sm:rounded-3xl",
  split: "aspect-[4/5] rounded-2xl sm:aspect-[16/6] sm:rounded-3xl",
  full: "h-[70vh] min-h-[420px] -mt-16",
};

function SlideContent({ slide, layout, priority }: { slide: Slide; layout: Layout; priority: boolean }) {
  if (layout === "split") {
    return (
      <div className="grid h-full sm:grid-cols-2" style={{ background: slide.accent }}>
        <div className="order-2 flex flex-col justify-center p-6 sm:order-1 sm:p-14">
          <p className="mb-3 text-xs font-black tracking-widest sm:text-sm">{slide.badge}</p>
          <h2 className="mb-4 text-3xl leading-tight font-black whitespace-pre-line sm:text-5xl">{slide.title}</h2>
          <p className="text-sm text-white/90 sm:text-lg">{slide.description}</p>
        </div>
        <div className="relative order-1 min-h-40 sm:order-2">
          <SmartImage src={slide.image} fill priority={priority} sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
        </div>
      </div>
    );
  }

  return (
    <>
      <SmartImage src={slide.image} fill priority={priority} sizes="100vw" className="object-cover" />
      <div
        className="absolute inset-0"
        style={{
          background:
            layout === "full"
              ? "linear-gradient(0deg, #000 0%, transparent 55%), linear-gradient(90deg, #000c 0%, transparent 60%)"
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
        <p className="mb-3 text-xs font-black tracking-widest sm:text-sm">
          <span className="text-point">▶</span> {slide.badge}
        </p>
        <h2 className="mb-4 text-3xl leading-tight font-black whitespace-pre-line italic sm:text-6xl">{slide.title}</h2>
        <p className="text-sm text-white/90 sm:text-lg">{slide.description}</p>
      </div>
    </>
  );
}

export default function HeroSlider({ slides, layout = "slider" }: { slides: Slide[]; layout?: Layout }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = slides.length ? index % slides.length : 0;

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      className={`relative ${FRAME[layout]}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
              <Link href={slide.href} className="relative block h-full w-full">
                <SlideContent slide={slide} layout={layout} priority={i === 0} />
              </Link>
            ) : (
              <SlideContent slide={slide} layout={layout} priority={i === 0} />
            )}
          </div>
        ))}

        {slides.length > 1 && (
          <div className="absolute right-6 bottom-6 flex gap-2 sm:right-10 sm:bottom-8">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`${i + 1}번 슬라이드`}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-white" : "w-2 bg-white/40"}`}
              />
            ))}
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="이전"
            onClick={() => go(current - 1)}
            className="absolute top-1/2 left-1 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-xl transition hover:bg-black active:scale-90"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="다음"
            onClick={() => go(current + 1)}
            className="absolute top-1/2 right-1 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-xl transition hover:bg-black active:scale-90"
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}
