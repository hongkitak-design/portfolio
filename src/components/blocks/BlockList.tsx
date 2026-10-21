import HeroSlider from "@/components/HeroSlider";
import BannersBlock from "@/components/blocks/BannersBlock";
import CategoryRowsBlock from "@/components/blocks/CategoryRowsBlock";
import CirclesBlock from "@/components/blocks/CirclesBlock";
import KeywordsBlock from "@/components/blocks/KeywordsBlock";
import TextBlock from "@/components/blocks/TextBlock";
import WorksBlock from "@/components/blocks/WorksBlock";
import type { Block, Category } from "@/lib/schema";

// 설정 페이지에서 정한 순서·레이아웃대로 블록을 그립니다
export default function BlockList({ blocks, categories }: { blocks: Block[]; categories: Category[] }) {
  return (
    <>
      {blocks
        .filter((b) => b.visible)
        .map((block) => {
          switch (block.type) {
            case "hero":
              return <HeroSlider key={block.id} slides={block.slides} layout={block.layout} />;
            case "circles":
              return <CirclesBlock key={block.id} block={block} categories={categories} />;
            case "categoryRows":
              return <CategoryRowsBlock key={block.id} block={block} categories={categories} />;
            case "keywords":
              return <KeywordsBlock key={block.id} block={block} />;
            case "banners":
              return <BannersBlock key={block.id} block={block} />;
            case "works":
              return <WorksBlock key={block.id} block={block} />;
            case "text":
              return <TextBlock key={block.id} block={block} />;
          }
        })}
    </>
  );
}
