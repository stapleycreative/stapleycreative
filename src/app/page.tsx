import { getAllContent } from "@/lib/content";
import { HomeContent } from "@/components/home-content";

export default function Home() {
  const caseStudies = getAllContent("work");
  const posts = getAllContent("blog").slice(0, 3);

  return <HomeContent caseStudies={caseStudies} posts={posts} />;
}