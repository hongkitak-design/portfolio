import type { CSSProperties } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getSiteConfig } from "@/lib/store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { site, categories } = await getSiteConfig();
  const menu = categories.filter((c) => c.visible).map(({ slug, label }) => ({ slug, label }));

  return (
    <div className="flex flex-1 flex-col" style={{ "--point": site.pointColor } as CSSProperties}>
      <Header logo={site.logo} name={site.title} email={site.email} menu={menu} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer logo={site.logo} name={site.title} email={site.email} github={site.github} />
    </div>
  );
}
