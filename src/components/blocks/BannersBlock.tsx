import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import type { BlockOf } from "@/lib/schema";

const GRID = { grid3: "sm:grid-cols-3", grid2: "sm:grid-cols-2", wide: "" };
const ASPECT = { grid3: "aspect-[4/5]", grid2: "aspect-[4/3]", wide: "aspect-[16/7]" };

export default function BannersBlock({ block }: { block: BlockOf<"banners"> }) {
  return (
    <section className="mx-auto mt-12 max-w-[1400px] px-4 sm:px-6">
      <ul className={`grid gap-4 ${GRID[block.layout]}`}>
        {block.items.map((banner) => {
          const inner = (
            <>
              <SmartImage
                src={banner.image}
                fill
                sizes={block.layout === "wide" ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute bottom-6 left-6 text-2xl font-light">{banner.title}</p>
            </>
          );
          return (
            <li key={banner.id} className={`group relative overflow-hidden rounded-xl ${ASPECT[block.layout]}`}>
              {banner.href ? (
                <Link href={banner.href} className="absolute inset-0">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
