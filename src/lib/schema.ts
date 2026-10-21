import { z } from "zod";

// 사이트 전체 설정은 이 스키마 하나로 DB(또는 로컬 파일)에 JSON으로 저장됩니다.

const id = z.string().min(1);
const text = z.string().max(2000);
const url = z.string().max(2000);

export const slideSchema = z.object({
  id,
  badge: text,
  title: text,
  description: text,
  image: url,
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  href: url.optional(),
});

export const bannerSchema = z.object({
  id,
  title: text,
  image: url,
  href: url.optional(),
});

export const workSchema = z.object({
  id,
  title: text,
  description: text,
  image: url,
  meta: text,
  tag: text.optional(),
  href: url.optional(),
});

export const HERO_LAYOUTS = ["slider", "split", "full"] as const;
export const ROW_LAYOUTS = ["wide", "poster"] as const;
export const KEYWORD_LAYOUTS = ["center", "left"] as const;
export const BANNER_LAYOUTS = ["grid3", "grid2", "wide"] as const;
export const WORK_LAYOUTS = ["grid4", "grid3", "carousel", "feature", "list"] as const;
export const TEXT_LAYOUTS = ["center", "split"] as const;

const base = { id, visible: z.boolean() };

export const blockSchema = z.discriminatedUnion("type", [
  z.object({ ...base, type: z.literal("hero"), layout: z.enum(HERO_LAYOUTS), slides: z.array(slideSchema) }),
  z.object({ ...base, type: z.literal("circles"), title: text }),
  z.object({
    ...base,
    type: z.literal("categoryRows"),
    layout: z.enum(ROW_LAYOUTS),
    limit: z.number().int().min(1).max(30),
  }),
  z.object({
    ...base,
    type: z.literal("keywords"),
    layout: z.enum(KEYWORD_LAYOUTS),
    title: text,
    keywords: z.array(z.string().max(50)),
  }),
  z.object({ ...base, type: z.literal("banners"), layout: z.enum(BANNER_LAYOUTS), items: z.array(bannerSchema) }),
  z.object({
    ...base,
    type: z.literal("works"),
    layout: z.enum(WORK_LAYOUTS),
    title: text,
    subtitle: text,
    items: z.array(workSchema),
  }),
  z.object({
    ...base,
    type: z.literal("text"),
    layout: z.enum(TEXT_LAYOUTS),
    title: text,
    body: z.string().max(10000),
    image: url,
  }),
]);

export const categorySchema = z.object({
  id,
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "주소(slug)는 영문 소문자, 숫자, - 만 쓸 수 있습니다")
    .refine((s) => s !== "admin" && s !== "api", "admin, api 는 주소로 쓸 수 없습니다"),
  label: z.string().min(1, "카테고리 이름을 입력하세요").max(30),
  short: z.string().max(12),
  visible: z.boolean(),
  circleImage: url,
  blocks: z.array(blockSchema),
});

export const siteConfigSchema = z
  .object({
    version: z.literal(1),
    site: z.object({
      title: z.string().max(100),
      description: z.string().max(300),
      logo: url,
      email: z.string().max(200),
      github: url,
      pointColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    }),
    home: z.object({ blocks: z.array(blockSchema) }),
    categories: z.array(categorySchema),
  })
  .superRefine((config, ctx) => {
    const seen = new Set<string>();
    for (const c of config.categories) {
      if (seen.has(c.slug)) {
        ctx.addIssue({ code: "custom", message: `주소(slug) "${c.slug}" 가 중복됩니다` });
      }
      seen.add(c.slug);
    }
  });

export type Slide = z.infer<typeof slideSchema>;
export type Banner = z.infer<typeof bannerSchema>;
export type Work = z.infer<typeof workSchema>;
export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];
export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;
export type Category = z.infer<typeof categorySchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
