import SmartImage from "@/components/SmartImage";
import type { BlockOf } from "@/lib/schema";

export default function TextBlock({ block }: { block: BlockOf<"text"> }) {
  if (block.layout === "split") {
    return (
      <section className="mx-auto mt-24 grid max-w-[1400px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-900">
          <SmartImage src={block.image} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div>
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">{block.title}</h2>
          <p className="text-lg leading-relaxed whitespace-pre-line text-neutral-300">{block.body}</p>
        </div>
      </section>
    );
  }
  return (
    <section className="mx-auto mt-24 max-w-3xl px-4 text-center sm:px-6">
      <h2 className="mb-6 text-3xl font-bold sm:text-4xl">{block.title}</h2>
      <p className="text-lg leading-relaxed whitespace-pre-line text-neutral-300">{block.body}</p>
    </section>
  );
}
