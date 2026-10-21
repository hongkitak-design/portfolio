import SectionTitle from "@/components/SectionTitle";
import SmartImage from "@/components/SmartImage";
import WorkCard from "@/components/WorkCard";
import type { BlockOf } from "@/lib/schema";

export default function WorksBlock({ block }: { block: BlockOf<"works"> }) {
  const { items } = block;
  return (
    <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:mt-28 sm:px-6">
      <SectionTitle title={block.title} subtitle={block.subtitle} align={block.layout === "list" ? "center" : "left"} />

      {block.layout === "grid4" && (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {items.map((work) => (
            <li key={work.id}>
              <WorkCard work={work} />
            </li>
          ))}
        </ul>
      )}

      {block.layout === "grid3" && (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
          {items.map((work) => (
            <li key={work.id}>
              <WorkCard work={work} aspect="aspect-[4/5]" sizes="(max-width: 640px) 50vw, 33vw" />
            </li>
          ))}
        </ul>
      )}

      {block.layout === "carousel" && (
        <ul className="scrollbar-none -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
          {items.map((work) => (
            <li key={work.id} className="w-64 shrink-0 snap-start sm:w-80">
              <WorkCard work={work} aspect="aspect-[4/3]" sizes="320px" />
            </li>
          ))}
        </ul>
      )}

      {block.layout === "feature" && items.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <WorkCard work={items[0]} aspect="aspect-square" sizes="(max-width: 1024px) 100vw, 50vw" />
          <ul className="grid grid-cols-2 gap-4">
            {items.slice(1, 5).map((work) => (
              <li key={work.id}>
                <WorkCard work={work} sizes="25vw" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {block.layout === "list" && (
        <ul className="mx-auto max-w-3xl divide-y divide-white/10">
          {items.map((work) => (
            <li key={work.id} className="flex items-center gap-5 py-5">
              <span className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-900 sm:h-24 sm:w-24">
                <SmartImage src={work.image} fill sizes="96px" className="object-cover" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-point">{work.meta}</p>
                <h3 className="mt-1 font-bold tracking-tight">{work.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{work.description}</p>
              </div>
              {work.tag && (
                <span className="shrink-0 rounded-full bg-point px-2.5 py-0.5 text-[11px] font-black">{work.tag}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
