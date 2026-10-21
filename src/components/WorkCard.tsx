import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import type { Work } from "@/lib/schema";

type Props = { work: Work; aspect?: string; sizes?: string };

export default function WorkCard({ work, aspect = "aspect-square", sizes = "(max-width: 640px) 50vw, 25vw" }: Props) {
  const card = (
    <article className="group cursor-pointer">
      <div className={`relative overflow-hidden rounded-xl bg-neutral-900 ${aspect}`}>
        <SmartImage
          src={work.image}
          fill
          sizes={sizes}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {work.tag && (
          <span className="absolute top-3 left-3 rounded bg-point px-2 py-0.5 text-[11px] font-black">{work.tag}</span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-bold">{work.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{work.description}</p>
        <p className="mt-2 text-xs font-semibold text-point">{work.meta}</p>
      </div>
    </article>
  );
  return work.href ? <Link href={work.href}>{card}</Link> : card;
}
