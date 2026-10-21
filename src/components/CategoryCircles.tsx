import Image from "next/image";
import PressLink from "@/components/PressLink";
import { categories } from "@/data/portfolio";

export default function CategoryCircles() {
  return (
    <section className="mx-auto mt-10 max-w-[1400px] px-4 sm:px-6">
      <ul className="scrollbar-none flex justify-start gap-6 overflow-x-auto pb-2 sm:justify-center sm:gap-10">
        {categories.map((c) => (
          <li key={c.slug} className="shrink-0">
            <PressLink href={`/${c.slug}`} ring className="group rounded-full">
              <span className="relative block h-20 w-20 overflow-hidden rounded-full ring-2 ring-transparent transition group-hover:ring-white sm:h-24 sm:w-24">
                <Image src={c.circleImage} alt="" fill sizes="96px" className="object-cover" />
                <span className="absolute inset-0 grid place-items-center bg-black/40 text-xs font-black tracking-wider">
                  {c.short}
                </span>
              </span>
              <span className="mt-3 text-sm text-neutral-300 group-hover:text-white">{c.label}</span>
            </PressLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
