import SectionTitle from "@/components/SectionTitle";
import type { BlockOf } from "@/lib/schema";

export default function KeywordsBlock({ block }: { block: BlockOf<"keywords"> }) {
  const left = block.layout === "left";
  return (
    <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:mt-28 sm:px-6">
      <SectionTitle title={block.title} align={left ? "left" : "center"} />
      <div className={`flex flex-wrap items-center gap-2 ${left ? "" : "justify-center"}`}>
        {block.keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-neutral-200"
          >
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}
