import type { CSSProperties } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Intro from "@/components/Intro";
import { getSiteConfig } from "@/lib/store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { site, categories } = await getSiteConfig();
  const menu = categories.filter((c) => c.visible).map(({ slug, label }) => ({ slug, label }));

  return (
    <div className="flex flex-1 flex-col" style={{ "--point": site.pointColor } as CSSProperties}>
      {/* 이번 세션에 이미 인트로를 봤다면 그리기 전에 숨깁니다 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("intro-seen"))document.documentElement.dataset.intro="seen"}catch(e){}`,
        }}
      />
      <noscript>
        <style>{`.intro{display:none}`}</style>
      </noscript>
      <Intro logo={site.logo} name={site.title} />
      <div className="site-root flex flex-1 flex-col">
        <Header logo={site.logo} name={site.title} email={site.email} menu={menu} />
        <main className="flex-1 pt-16">{children}</main>
        <Footer logo={site.logo} name={site.title} email={site.email} github={site.github} />
      </div>
    </div>
  );
}
