import { profile } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-800 py-10 text-sm text-neutral-500">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 sm:flex-row sm:justify-between sm:px-6">
        <p className="font-bold text-neutral-300">{profile.name}</p>
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
