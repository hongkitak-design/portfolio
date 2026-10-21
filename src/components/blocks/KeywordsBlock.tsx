import SectionTitle from "@/components/SectionTitle";
import type { BlockOf } from "@/lib/schema";

export default function KeywordsBlock({ block }: { block: BlockOf<"keywords"> }) {
  const left = block.layout === "left";
  return (
    <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:px-6">
      {left ? (
        <h2 className="mb-6 text-2xl font-bold sm:text-3xl">{block.title}</h2>
      ) : (
        <SectionTitle title={block.title} />
      )}
      <div className={`flex flex-wrap items-center gap-2 ${left ? "" : "justify-center"}`}>
        <span className="mr-1 text-sm text-neutral-500"># 키워드</span>
        {block.keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full bg-neutral-800 px-4 py-1.5 text-sm text-neutral-200 transition hover:bg-point"
          >
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}
