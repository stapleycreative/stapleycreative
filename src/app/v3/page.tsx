import type { Metadata } from "next";
import { HomeV3 } from "@/components/home-v3";

export const metadata: Metadata = {
  title: { absolute: "Craig Stapley — Product Designer" },
  description:
    "Product designer, twenty years. AI product design and 0→1 work. Single-page portfolio.",
};

export default function V3Page() {
  return <HomeV3 />;
}
