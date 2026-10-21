import SmartImage from "@/components/SmartImage";

type Props = { logo: string; name: string; email: string; github: string };

export default function Footer({ logo, name, email, github }: Props) {
  return (
    <footer className="mt-24 border-t border-neutral-800 py-10 text-sm text-neutral-500">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="relative block h-6 w-32 opacity-70">
          <SmartImage src={logo} alt={name} fill sizes="128px" className="object-contain object-left" />
        </span>
        <div className="flex gap-4">
          {email && (
            <a href={`mailto:${email}`} className="hover:text-white">
              {email}
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noreferrer" className="hover:text-white">
              GitHub
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
