import { notFound } from "next/navigation";
import { Suspense } from "react";
import BlockList from "@/components/blocks/BlockList";
import { getSiteConfig } from "@/lib/store";

export async function generateStaticParams() {
  const { categories } = await getSiteConfig();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const { site, categories } = await getSiteConfig();
  const category = categories.find((c) => c.slug === slug);
  return { title: category ? `${category.label} | ${site.title}` : site.title };
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
  const { categories } = await getSiteConfig();
  const category = categories.find((c) => c.slug === slug && c.visible);
  if (!category) notFound();

  return <BlockList blocks={category.blocks} categories={categories} />;
}
