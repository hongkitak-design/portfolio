import Image from "next/image";
import { profile } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-800 py-10 text-sm text-neutral-500">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 sm:flex-row sm:justify-between sm:px-6">
        <Image src={profile.logo} alt={profile.name} width={3199} height={586} className="h-6 w-auto opacity-70" />
        <div className="flex gap-4">
          <a href={`mailto:${profile.email}`} className="hover:text-white">
            {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-white">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
