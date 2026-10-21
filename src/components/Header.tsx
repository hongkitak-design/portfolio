"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PressLink from "@/components/PressLink";
import SmartImage from "@/components/SmartImage";

type Props = {
  logo: string;
  name: string;
  email: string;
  menu: { slug: string; label: string }[];
  /** 설정 화면 미리보기처럼 실제 주소와 보여줄 페이지가 다를 때 지정합니다 */
  activePath?: string;
};

export default function Header({ logo, name, email, menu, activePath }: Props) {
  const currentPath = usePathname();
  const pathname = activePath ?? currentPath;
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // 문서 맨 위 표식이 화면에서 벗어나면 헤더 배경을 채웁니다 (스크롤 이벤트 대신 IntersectionObserver)
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden className="pointer-events-none absolute top-0 h-2.5 w-px" />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur" : "bg-gradient-to-b from-background to-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-4 sm:px-6">
          <Link href="/" className="shrink-0 transition active:scale-95">
            <span className="relative block h-7 w-36">
              <SmartImage src={logo} alt={name} fill priority sizes="144px" className="object-contain object-left" />
            </span>
          </Link>
          <nav className="scrollbar-none flex flex-1 items-center gap-5 overflow-x-auto sm:gap-7">
            {menu.map((c) => {
              const active = pathname === `/${c.slug}`;
              return (
                <PressLink
                  key={c.slug}
                  href={`/${c.slug}`}
                  className={`shrink-0 py-2 text-[15px] font-semibold whitespace-nowrap transition-colors ${
                    active ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {c.label}
                  <span
                    className={`mt-1 h-0.5 rounded-full bg-point transition-all duration-300 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </PressLink>
              );
            })}
          </nav>
          <a
            href={`mailto:${email}`}
            className="hidden shrink-0 rounded-full bg-point px-4 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 sm:block"
          >
            Contact
          </a>
        </div>
      </header>
    </>
  );
}
