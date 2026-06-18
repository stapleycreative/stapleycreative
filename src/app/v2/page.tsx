import { getAllContent } from "@/lib/content";
import { HomeV2Content } from "@/components/home-v2-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Single-page (v2)",
  description:
    "An alternate single-page iteration of the portfolio. Same system, one scroll.",
};

export default function V2Page() {
  // Dedupe the stray "hiki 2" duplicate; keep canonical entries, newest first.
  const caseStudies = getAllContent("work").filter((w) => w.slug !== "hiki 2");

  return <HomeV2Content caseStudies={caseStudies} />;
}
