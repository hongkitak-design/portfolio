import Image from "next/image";
import Link from "next/link";
import CategoryCircles from "@/components/CategoryCircles";
import HeroSlider from "@/components/HeroSlider";
import { categories, homeSlides } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <div className="pt-4">
        <HeroSlider slides={homeSlides} />
      </div>
      <CategoryCircles />

      {categories.map((c) => (
        <section key={c.slug} className="mx-auto mt-14 max-w-[1400px] px-4 sm:px-6">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold">{c.label}</h2>
            <Link href={`/${c.slug}`} className="text-sm text-neutral-400 hover:text-white">
              전체보기 ›
            </Link>
          </div>
          <ul className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
            {c.sections.flatMap((s) => s.works).slice(0, 8).map((work) => (
              <li key={work.title} className="w-56 shrink-0 sm:w-64">
                <Link href={`/${c.slug}`} className="group block">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-900">
                    <Image
                      src={work.image}
                      alt=""
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
      ))}
    </>
  );
}
