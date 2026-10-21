export const profile = {
  name: "Bellkong",
  role: "Designer & Creator",
  intro: "아이디어를 시각적인 경험으로 만드는 일을 합니다.",
  email: "gthong94@naver.com",
  github: "https://github.com/hongkitak-design",
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  link?: string;
};

export const projects: Project[] = [
  {
    title: "프로젝트 1",
    description: "프로젝트 설명을 입력하세요.",
    tags: ["Branding", "UI"],
  },
  {
    title: "프로젝트 2",
    description: "프로젝트 설명을 입력하세요.",
    tags: ["Web", "UX"],
  },
  {
    title: "프로젝트 3",
    description: "프로젝트 설명을 입력하세요.",
    tags: ["Graphic"],
  },
];

export const skills = ["Figma", "Photoshop", "Illustrator", "React", "Next.js"];
