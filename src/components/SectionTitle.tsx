import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  more?: string;
};

export default function SectionTitle({ title, subtitle, align = "left", more }: Props) {
  if (!title && !subtitle && !more) return null;
  const center = align === "center";
  return (
    <div className={`mb-6 flex items-end gap-4 sm:mb-8 ${center ? "justify-center text-center" : "justify-between"}`}>
      <div>
        {title && <h2 className="text-xl font-bold tracking-tight text-balance sm:text-2xl">{title}</h2>}
        {subtitle && <p className="mt-1.5 max-w-[60ch] text-sm text-neutral-400">{subtitle}</p>}
      </div>
      {more && (
        <Link
          href={more}
          className="flex shrink-0 items-center gap-0.5 text-sm text-neutral-400 transition hover:text-white"
        >
          전체보기 <CaretRightIcon size={14} weight="bold" />
        </Link>
      )}
    </div>
  );
}
