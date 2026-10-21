import type { Block, BlockOf, BlockType, Work } from "@/lib/schema";

// 샘플 이미지는 picsum.photos 랜덤 이미지입니다. 설정 페이지에서 실제 이미지로 교체하세요.
export const sampleImage = (seed: string, width: number, height: number) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "메인 이미지",
  circles: "원형 카테고리 메뉴",
  categoryRows: "카테고리별 작업 줄",
  keywords: "키워드",
  banners: "메인 배너",
  works: "작업 진열",
  text: "소개 글",
};

export const LAYOUT_LABELS: Record<string, string> = {
  slider: "둥근 슬라이드",
  split: "좌우 분할",
  full: "화면 가득",
  wide: "가로형",
  poster: "포스터형",
  center: "가운데 정렬",
  left: "왼쪽 정렬",
  grid3: "3칸",
  grid2: "2칸",
  grid4: "4칸",
  carousel: "가로 스크롤",
  feature: "큰 작업 + 작은 작업",
  list: "목록형",
};

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const sampleWorks = (seed: string, count: number, metas: string[], makeId: () => string): Work[] =>
  Array.from({ length: count }, (_, i) => ({
    id: makeId(),
    title: `작업 ${String(i + 1).padStart(2, "0")}`,
    description: "작업 설명이 들어갈 자리입니다. 프로젝트 목표와 역할을 간단히 적어주세요.",
    image: sampleImage(`${seed}-${i}`, 600, 600),
    meta: metas[i % metas.length],
    tag: i === 0 ? "BEST" : i === 1 ? "NEW" : undefined,
  }));

// 블록 추가 버튼으로 만드는 빈 블록
export function createBlock(type: BlockType, makeId: () => string = newId): Block {
  const seed = makeId().slice(0, 8);
  switch (type) {
    case "hero":
      return {
        id: makeId(),
        type,
        visible: true,
        layout: "slider",
        slides: [
          {
            id: makeId(),
            badge: "NEW",
            title: "제목을 입력하세요",
            description: "설명을 입력하세요",
            image: sampleImage(`${seed}-hero`, 1600, 700),
            accent: "#ff153c",
          },
        ],
      };
    case "circles":
      return { id: makeId(), type, visible: true, title: "" };
    case "categoryRows":
      return { id: makeId(), type, visible: true, layout: "wide", limit: 8 };
    case "keywords":
      return { id: makeId(), type, visible: true, layout: "center", title: "Keywords", keywords: ["키워드"] };
    case "banners":
      return {
        id: makeId(),
        type,
        visible: true,
        layout: "grid3",
        items: ["Banner 1", "Banner 2", "Banner 3"].map((title, i) => ({
          id: makeId(),
          title,
          image: sampleImage(`${seed}-banner-${i}`, 600, 600),
        })),
      };
    case "works":
      return {
        id: makeId(),
        type,
        visible: true,
        layout: "grid4",
        title: "Works",
        subtitle: "작업을 소개합니다",
        items: sampleWorks(seed, 4, ["분류"], makeId),
      };
    case "text":
      return {
        id: makeId(),
        type,
        visible: true,
        layout: "split",
        title: "소개",
        body: "소개 글을 입력하세요.",
        image: sampleImage(`${seed}-text`, 800, 800),
      };
  }
}

export const PAGE_TEMPLATES = {
  shop: { label: "쇼핑몰형", description: "메인 이미지 → 키워드 → 배너 3칸 → 작업 진열 2단" },
  magazine: { label: "매거진형", description: "화면 가득 이미지 → 소개 글 → 큰 작업 강조 → 가로 스크롤" },
  gallery: { label: "갤러리형", description: "좌우 분할 이미지 → 3칸 작업 진열 위주" },
  profile: { label: "소개형", description: "메인 이미지 → 소개 글 → 키워드 → 목록형 이력" },
} as const;

export type PageTemplate = keyof typeof PAGE_TEMPLATES;

type TemplateInput = { label: string; seed: string; keywords: string[]; metas: string[]; accent: string };

// 카테고리 페이지 템플릿: 블록 묶음을 만들어줍니다
export function buildTemplate(template: PageTemplate, input: TemplateInput, makeId: () => string = newId): Block[] {
  const { label, seed, keywords, metas, accent } = input;
  const hero = (layout: BlockOf<"hero">["layout"]): BlockOf<"hero"> => ({
    id: makeId(),
    type: "hero",
    visible: true,
    layout,
    slides: [
      {
        id: makeId(),
        badge: "WORK",
        title: `${label}\n프로젝트`,
        description: "대표 프로젝트를 소개합니다",
        image: sampleImage(`${seed}-hero-1`, 1600, 700),
        accent,
      },
      {
        id: makeId(),
        badge: "PROJECT",
        title: "주요 작업",
        description: "진행한 작업을 확인해 보세요",
        image: sampleImage(`${seed}-hero-2`, 1600, 700),
        accent: "#7c3aed",
      },
    ],
  });
  const keywordBlock = (layout: BlockOf<"keywords">["layout"]): BlockOf<"keywords"> => ({
    id: makeId(),
    type: "keywords",
    visible: true,
    layout,
    title: `All About ${label}`,
    keywords,
  });
  const works = (
    layout: BlockOf<"works">["layout"],
    title: string,
    subtitle: string,
    count: number,
    suffix: string,
  ): BlockOf<"works"> => ({
    id: makeId(),
    type: "works",
    visible: true,
    layout,
    title,
    subtitle,
    items: sampleWorks(`${seed}-${suffix}`, count, metas, makeId),
  });
  const text = (layout: BlockOf<"text">["layout"], title: string, body: string): BlockOf<"text"> => ({
    id: makeId(),
    type: "text",
    visible: true,
    layout,
    title,
    body,
    image: sampleImage(`${seed}-text`, 800, 800),
  });

  switch (template) {
    case "shop":
      return [
        hero("slider"),
        keywordBlock("center"),
        {
          id: makeId(),
          type: "banners",
          visible: true,
          layout: "grid3",
          items: keywords.slice(0, 3).map((title, i) => ({
            id: makeId(),
            title,
            image: sampleImage(`${seed}-banner-${i}`, 600, 600),
          })),
        },
        works("grid4", "Best Project", "가장 자신 있는 작업입니다", 4, "best"),
        works("grid4", "More Works", "그 외 진행한 작업들", 8, "more"),
      ];
    case "magazine":
      return [
        hero("full"),
        text("center", label, "어떤 일을 했는지 한두 문단으로 소개해 주세요."),
        works("feature", "Highlight", "대표 작업", 5, "feature"),
        works("carousel", "More Works", "넘겨서 더 보기", 8, "carousel"),
      ];
    case "gallery":
      return [
        hero("split"),
        keywordBlock("left"),
        works("grid3", "Gallery", "작업 모음", 9, "gallery"),
      ];
    case "profile":
      return [
        hero("slider"),
        text("split", "About Me", "자기소개 글을 입력하세요. 어떤 디자이너인지, 어떤 일을 좋아하는지 적어주세요."),
        keywordBlock("center"),
        works("grid4", "Strength", "제가 잘하는 것들입니다", 4, "strength"),
        works("list", "History", "걸어온 길을 정리했습니다", 4, "history"),
      ];
  }
}
