import PressLink from "@/components/PressLink";
import SmartImage from "@/components/SmartImage";
import type { BlockOf, Category } from "@/lib/schema";

export default function CirclesBlock({ block, categories }: { block: BlockOf<"circles">; categories: Category[] }) {
  return (
    <section className="mx-auto mt-12 max-w-[1400px] px-4 sm:px-6">
      {block.title && <h2 className="mb-6 text-center text-xl font-bold tracking-tight sm:text-2xl">{block.title}</h2>}
      <ul className="scrollbar-none -mx-4 flex justify-start gap-6 overflow-x-auto px-4 pt-3 pb-2 sm:justify-center sm:gap-10">
        {categories
          .filter((c) => c.visible)
          .map((c) => (
            <li key={c.id} className="shrink-0">
              <PressLink
                href={`/${c.slug}`}
                ring="inset-x-0 top-0 mx-auto h-20 w-20 sm:h-24 sm:w-24"
                className="group rounded-xl"
              >
                <span className="relative block h-20 w-20 overflow-hidden rounded-full bg-neutral-900 ring-2 ring-white/10 transition group-hover:ring-point sm:h-24 sm:w-24">
                  <SmartImage src={c.circleImage} fill sizes="96px" className="object-cover" />
                  <span className="absolute inset-0 grid place-items-center bg-black/45 text-xs font-black tracking-wider">
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
