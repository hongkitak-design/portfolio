import SmartImage from "@/components/SmartImage";

type Props = { logo: string; name: string; email: string; github: string };

export default function Footer({ logo, name, email, github }: Props) {
  return (
    <footer className="mt-24 border-t border-white/10 py-10 text-sm text-neutral-400 sm:mt-32">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="relative block h-6 w-32 opacity-70">
          <SmartImage src={logo} alt={name} fill sizes="128px" className="object-contain object-left" />
        </span>
        <div className="flex gap-5">
          {email && (
            <a href={`mailto:${email}`} className="transition-colors hover:text-white">
              {email}
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
              GitHub
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
