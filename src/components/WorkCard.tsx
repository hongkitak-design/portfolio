import Image from "next/image";
import type { Work } from "@/data/portfolio";

export default function WorkCard({ work }: { work: Work }) {
  return (
    <article className="group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-900">
        <Image
          src={work.image}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {work.tag && (
          <span className="absolute top-3 left-3 rounded bg-point px-2 py-0.5 text-[11px] font-black">
            {work.tag}
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-bold">{work.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{work.description}</p>
        <p className="mt-2 text-xs font-semibold text-point">{work.meta}</p>
      </div>
    </article>
  );
}
