import Image, { type ImageProps } from "next/image";

// next.config 에 등록된 곳(로컬, picsum, Vercel Blob)은 최적화하고, 그 외 주소는 원본 그대로 보여줍니다
const OPTIMIZED = [/^\//, /^https:\/\/picsum\.photos\//, /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//];

export default function SmartImage({ src, alt = "", ...props }: Omit<ImageProps, "src" | "alt"> & { src: string; alt?: string }) {
  if (!src) return <div className="absolute inset-0 bg-neutral-800" />;
  const optimized = OPTIMIZED.some((re) => re.test(src));
  return <Image src={src} alt={alt} unoptimized={!optimized} {...props} />;
}
