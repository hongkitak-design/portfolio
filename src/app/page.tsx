import { profile, projects, skills } from "@/data/portfolio";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-20">
      <section className="mb-24">
        <p className="mb-3 text-sm font-medium tracking-widest text-neutral-500 uppercase">
          {profile.role}
        </p>
        <h1 className="mb-6 text-5xl font-bold tracking-tight">{profile.name}</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">{profile.intro}</p>
      </section>

      <section id="projects" className="mb-24">
        <h2 className="mb-8 text-2xl font-semibold">Projects</h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <li
              key={project.title}
              className="rounded-2xl border border-neutral-200 p-6 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            >
              <h3 className="mb-2 text-lg font-semibold">{project.title}</h3>
              <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-neutral-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="skills" className="mb-24">
        <h2 className="mb-8 text-2xl font-semibold">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section id="contact">
        <h2 className="mb-8 text-2xl font-semibold">Contact</h2>
        <div className="flex flex-col gap-2 text-neutral-600 dark:text-neutral-400">
          <a href={`mailto:${profile.email}`} className="hover:underline">
            {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:underline">
            GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
