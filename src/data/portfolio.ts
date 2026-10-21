// 샘플 이미지는 picsum.photos 랜덤 이미지입니다. 실제 작업물이 준비되면 public/ 경로로 교체하세요.
export const sampleImage = (seed: string, width: number, height: number) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

export const profile = {
  name: "BELLKONG",
  role: "Designer",
  email: "gthong94@naver.com",
  github: "https://github.com/hongkitak-design",
};

export type Slide = {
  badge: string;
  title: string;
  description: string;
  image: string;
  accent: string;
  href?: string;
};

export type Banner = {
  title: string;
  image: string;
};

export type Work = {
  title: string;
  description: string;
  image: string;
  meta: string;
  tag?: string;
};

export type WorkSection = {
  title: string;
  subtitle: string;
  works: Work[];
};

export type Category = {
  slug: string;
  label: string;
  short: string;
  circleImage: string;
  slides: Slide[];
  keywordTitle: string;
  keywords: string[];
  banners: Banner[];
  sections: WorkSection[];
};

const makeWorks = (prefix: string, count: number, metas: string[]): Work[] =>
  Array.from({ length: count }, (_, i) => ({
    title: `${prefix} ${String(i + 1).padStart(2, "0")}`,
    description: "작업 설명이 들어갈 자리입니다. 프로젝트 목표와 역할을 간단히 적어주세요.",
    image: sampleImage(`${prefix}-${i}`, 600, 600),
    meta: metas[i % metas.length],
    tag: i === 0 ? "BEST" : i === 1 ? "NEW" : undefined,
  }));

export const categories: Category[] = [
  {
    slug: "about",
    label: "자기소개",
    short: "ABOUT",
    circleImage: sampleImage("about-circle", 200, 200),
    slides: [
      {
        badge: "PROFILE",
        title: "안녕하세요,\n디자이너 BELLKONG입니다",
        description: "브랜드와 사용자를 잇는 디자인을 합니다",
        image: sampleImage("about-hero-1", 1600, 700),
        accent: "#ff153c",
      },
      {
        badge: "CAREER",
        title: "경험으로 증명하는\n디자인",
        description: "실무 프로젝트와 교육 경험을 소개합니다",
        image: sampleImage("about-hero-2", 1600, 700),
        accent: "#7c3aed",
      },
    ],
    keywordTitle: "About Me",
    keywords: ["UI/UX", "브랜딩", "편집디자인", "교육"],
    banners: [
      { title: "Profile", image: sampleImage("about-banner-1", 600, 600) },
      { title: "Skills", image: sampleImage("about-banner-2", 600, 600) },
      { title: "Career", image: sampleImage("about-banner-3", 600, 600) },
    ],
    sections: [
      {
        title: "Strength",
        subtitle: "제가 잘하는 것들입니다",
        works: makeWorks("strength", 4, ["Figma", "Photoshop", "Illustrator", "After Effects"]),
      },
      {
        title: "History",
        subtitle: "걸어온 길을 정리했습니다",
        works: makeWorks("history", 4, ["20XX", "20XX", "20XX", "20XX"]),
      },
    ],
  },
  {
    slug: "eznet",
    label: "이지넷유비쿼터스",
    short: "EZNET",
    circleImage: sampleImage("eznet-circle", 200, 200),
    slides: [
      {
        badge: "WORK",
        title: "이지넷유비쿼터스\n프로젝트",
        description: "재직 중 진행한 대표 프로젝트를 소개합니다",
        image: sampleImage("eznet-hero-1", 1600, 700),
        accent: "#00c73c",
      },
      {
        badge: "UI/UX",
        title: "서비스 화면\n디자인",
        description: "웹·모바일 서비스 UI 작업",
        image: sampleImage("eznet-hero-2", 1600, 700),
        accent: "#0ea5e9",
      },
    ],
    keywordTitle: "All About EZNET",
    keywords: ["웹디자인", "앱디자인", "배너", "상세페이지"],
    banners: [
      { title: "Web", image: sampleImage("eznet-banner-1", 600, 600) },
      { title: "Mobile", image: sampleImage("eznet-banner-2", 600, 600) },
      { title: "Promotion", image: sampleImage("eznet-banner-3", 600, 600) },
    ],
    sections: [
      {
        title: "Best Project",
        subtitle: "가장 자신 있는 작업입니다",
        works: makeWorks("eznet-best", 4, ["웹디자인", "앱디자인", "배너", "상세페이지"]),
      },
      {
        title: "More Works",
        subtitle: "그 외 진행한 작업들",
        works: makeWorks("eznet-more", 8, ["웹디자인", "앱디자인", "배너", "상세페이지"]),
      },
    ],
  },
  {
    slug: "hana",
    label: "하나인더스트리",
    short: "HANA",
    circleImage: sampleImage("hana-circle", 200, 200),
    slides: [
      {
        badge: "WORK",
        title: "하나인더스트리\n프로젝트",
        description: "브랜드·제품 디자인 작업을 소개합니다",
        image: sampleImage("hana-hero-1", 1600, 700),
        accent: "#f59e0b",
      },
      {
        badge: "BRANDING",
        title: "브랜드 아이덴티티",
        description: "로고, 패키지, 카탈로그 작업",
        image: sampleImage("hana-hero-2", 1600, 700),
        accent: "#ec4899",
      },
    ],
    keywordTitle: "All About HANA",
    keywords: ["브랜딩", "패키지", "카탈로그", "전시"],
    banners: [
      { title: "Branding", image: sampleImage("hana-banner-1", 600, 600) },
      { title: "Package", image: sampleImage("hana-banner-2", 600, 600) },
      { title: "Catalog", image: sampleImage("hana-banner-3", 600, 600) },
    ],
    sections: [
      {
        title: "Best Project",
        subtitle: "가장 자신 있는 작업입니다",
        works: makeWorks("hana-best", 4, ["브랜딩", "패키지", "카탈로그", "전시"]),
      },
      {
        title: "More Works",
        subtitle: "그 외 진행한 작업들",
        works: makeWorks("hana-more", 8, ["브랜딩", "패키지", "카탈로그", "전시"]),
      },
    ],
  },
  {
    slug: "education",
    label: "디자인교육",
    short: "EDU",
    circleImage: sampleImage("edu-circle", 200, 200),
    slides: [
      {
        badge: "EDUCATION",
        title: "함께 성장하는\n디자인 교육",
        description: "강의와 커리큘럼을 소개합니다",
        image: sampleImage("edu-hero-1", 1600, 700),
        accent: "#6366f1",
      },
      {
        badge: "CLASS",
        title: "수강생 작품",
        description: "수업에서 완성된 결과물",
        image: sampleImage("edu-hero-2", 1600, 700),
        accent: "#14b8a6",
      },
    ],
    keywordTitle: "All About Class",
    keywords: ["포토샵", "일러스트", "피그마", "포트폴리오"],
    banners: [
      { title: "Curriculum", image: sampleImage("edu-banner-1", 600, 600) },
      { title: "Lecture", image: sampleImage("edu-banner-2", 600, 600) },
      { title: "Review", image: sampleImage("edu-banner-3", 600, 600) },
    ],
    sections: [
      {
        title: "Curriculum",
        subtitle: "진행한 강의 과정입니다",
        works: makeWorks("edu-class", 4, ["기초", "중급", "실무", "포트폴리오"]),
      },
      {
        title: "Student Works",
        subtitle: "수강생 결과물",
        works: makeWorks("edu-student", 8, ["기초", "중급", "실무", "포트폴리오"]),
      },
    ],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const homeSlides: Slide[] = categories.map((c) => ({ ...c.slides[0], href: `/${c.slug}` }));
