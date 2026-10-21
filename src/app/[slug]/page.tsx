import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import HeroSlider from "@/components/HeroSlider";
import SectionTitle from "@/components/SectionTitle";
import WorkCard from "@/components/WorkCard";
import { categories, getCategory } from "@/data/portfolio";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  return { title: category ? `${category.label} | BELLKONG` : "BELLKONG" };
}

type Params = PageProps<"/[slug]">["params"];

export default function CategoryPage({ params }: PageProps<"/[slug]">) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

function CategorySkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6">
      <div className="aspect-[16/10] animate-pulse rounded-2xl bg-neutral-900 sm:aspect-[16/6] sm:rounded-3xl" />
    </div>
  );
}

async function CategoryContent({ params }: { params: Params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <>
      {/* 메인 이미지 */}
      <div className="pt-4">
        <HeroSlider slides={category.slides} />
      </div>

      {/* 키워드 */}
      <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:px-6">
        <SectionTitle title={category.keywordTitle} />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-sm text-neutral-500"># 키워드</span>
          {category.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-neutral-800 px-4 py-1.5 text-sm text-neutral-200 transition hover:bg-point"
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>

      {/* 메인 배너 */}
      <section className="mx-auto mt-12 max-w-[1400px] px-4 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-3">
          {category.banners.map((banner) => (
            <li key={banner.title} className="group relative aspect-[4/5] overflow-hidden rounded-xl">
              <Image
                src={banner.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute bottom-6 left-6 text-2xl font-light">{banner.title}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 작업 진열 */}
      {category.sections.map((section) => (
        <section key={section.title} className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6">
          <SectionTitle title={section.title} subtitle={section.subtitle} />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {section.works.map((work) => (
              <li key={work.title}>
                <WorkCard work={work} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
