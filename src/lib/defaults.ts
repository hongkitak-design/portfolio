import type { Category, SiteConfig } from "@/lib/schema";
import { buildTemplate, sampleImage, type PageTemplate } from "@/lib/templates";

// 저장된 설정이 없을 때 쓰는 기본값. id 가 매번 같도록 순번으로 만듭니다.
export function createDefaultConfig(): SiteConfig {
  let seq = 0;
  const makeId = () => `d${++seq}`;

  const category = (
    slug: string,
    label: string,
    short: string,
    template: PageTemplate,
    keywords: string[],
    accent: string,
  ): Category => ({
    id: makeId(),
    slug,
    label,
    short,
    visible: true,
    circleImage: sampleImage(`${slug}-circle`, 200, 200),
    blocks: buildTemplate(template, { label, seed: slug, keywords, metas: keywords, accent }, makeId),
  });

  const categories = [
    category("about", "자기소개", "ABOUT", "profile", ["UI/UX", "브랜딩", "편집디자인", "교육"], "#ff153c"),
    category("eznet", "이지넷유비쿼터스", "EZNET", "shop", ["웹디자인", "앱디자인", "배너", "상세페이지"], "#00c73c"),
    category("hana", "하나인더스트리", "HANA", "shop", ["브랜딩", "패키지", "카탈로그", "전시"], "#f59e0b"),
    category("education", "디자인교육", "EDU", "shop", ["포토샵", "일러스트", "피그마", "포트폴리오"], "#6366f1"),
  ];

  const aboutHero = categories[0].blocks.find((b) => b.type === "hero");
  if (aboutHero?.type === "hero") {
    Object.assign(aboutHero.slides[0], {
      badge: "PROFILE",
      title: "안녕하세요,\n디자이너 OOO입니다",
      description: "브랜드와 사용자를 잇는 디자인을 합니다",
    });
  }

  return {
    version: 1,
    site: {
      title: "NEXTU Portfolio",
      description: "NEXTU 디자인 포트폴리오",
      logo: "/logo-dark.png",
      email: "gthong94@naver.com",
      github: "https://github.com/hongkitak-design",
      pointColor: "#ff153c",
    },
    home: {
      blocks: [
        {
          id: makeId(),
          type: "hero",
          visible: true,
          layout: "slider",
          slides: categories.map((c) => {
            const hero = c.blocks.find((b) => b.type === "hero");
            const first = hero?.type === "hero" ? hero.slides[0] : undefined;
            return {
              id: makeId(),
              badge: first?.badge ?? c.short,
              title: first?.title ?? c.label,
              description: first?.description ?? "",
              image: first?.image ?? c.circleImage,
              accent: first?.accent ?? "#ff153c",
              href: `/${c.slug}`,
            };
          }),
        },
        { id: makeId(), type: "circles", visible: true, title: "" },
        { id: makeId(), type: "categoryRows", visible: true, layout: "wide", limit: 8 },
      ],
    },
    categories,
  };
}
