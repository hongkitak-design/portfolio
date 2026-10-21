import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import type { BlockOf, Category } from "@/lib/schema";

// 카테고리마다 작업 진열 블록의 작업을 모아 가로 줄로 보여줍니다 (티빙 스타일)
export default function CategoryRowsBlock({
  block,
  categories,
}: {
  block: BlockOf<"categoryRows">;
  categories: Category[];
}) {
  const poster = block.layout === "poster";
  return (
    <>
      {categories
        .filter((c) => c.visible)
        .map((c) => {
          const works = c.blocks
            .flatMap((b) => (b.type === "works" && b.visible ? b.items : []))
            .slice(0, block.limit);
          if (!works.length) return null;
          return (
            <section key={c.id} className="mx-auto mt-14 max-w-[1400px] px-4 sm:px-6">
              <div className="mb-4 flex items-end justify-between">
                <h2 className="text-xl font-bold">{c.label}</h2>
                <Link href={`/${c.slug}`} className="text-sm text-neutral-400 hover:text-white">
                  전체보기 ›
                </Link>
              </div>
              <ul className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
                {works.map((work) => (
                  <li key={work.id} className={`shrink-0 ${poster ? "w-36 sm:w-44" : "w-56 sm:w-64"}`}>
                    <Link href={`/${c.slug}`} className="group block">
                      <div
                        className={`relative overflow-hidden rounded-lg bg-neutral-900 ${
                          poster ? "aspect-[2/3]" : "aspect-video"
                        }`}
                      >
                        <SmartImage
                          src={work.image}
                          fill
                          sizes="256px"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 truncate text-sm text-neutral-300 group-hover:text-white">{work.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
    </>
  );
}
