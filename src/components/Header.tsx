"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PressLink from "@/components/PressLink";
import { categories, profile } from "@/data/portfolio";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur" : "bg-gradient-to-b from-black to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-2xl font-black tracking-tighter text-point italic">
          {profile.name}
        </Link>
        <nav className="scrollbar-none flex flex-1 items-center gap-5 overflow-x-auto sm:gap-7">
          {categories.map((c) => {
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
          href={`mailto:${profile.email}`}
          className="hidden shrink-0 rounded-full bg-point px-4 py-1.5 text-sm font-semibold text-white transition active:scale-95 sm:block"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
