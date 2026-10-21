"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Slide } from "@/data/portfolio";

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <section
      className="relative mx-auto max-w-[1400px] px-4 sm:px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[16/6] sm:rounded-3xl">
        {slides.map((slide, i) => {
          const content = (
            <>
              <Image
                src={slide.image}
                alt=""
                fill
                priority={i === 0}
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, ${slide.accent}ee 0%, ${slide.accent}99 35%, transparent 75%)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-6 max-w-[80%] sm:bottom-14 sm:left-12">
                <p className="mb-3 text-xs font-black tracking-widest sm:text-sm">
                  <span className="text-point">▶</span> {slide.badge}
                </p>
                <h2 className="mb-4 text-3xl leading-tight font-black whitespace-pre-line italic sm:text-6xl">
                  {slide.title}
                </h2>
                <p className="text-sm text-white/90 sm:text-lg">{slide.description}</p>
              </div>
            </>
          );
          return (
            <div
              key={slide.image}
              aria-hidden={i !== index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {slide.href ? (
                <Link href={slide.href} className="relative block h-full w-full">
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}

        <div className="absolute right-6 bottom-6 flex gap-2 sm:right-10 sm:bottom-8">
          {slides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`${i + 1}번 슬라이드`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="이전"
            onClick={() => go(index - 1)}
            className="absolute top-1/2 left-1 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-xl transition hover:bg-black active:scale-90"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="다음"
            onClick={() => go(index + 1)}
            className="absolute top-1/2 right-1 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-xl transition hover:bg-black active:scale-90"
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}
