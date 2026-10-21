import BlockList from "@/components/blocks/BlockList";
import { getSiteConfig } from "@/lib/store";

export default async function Home() {
  const config = await getSiteConfig();
  return <BlockList blocks={config.home.blocks} categories={config.categories} />;
}
