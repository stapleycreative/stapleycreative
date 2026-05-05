import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Craig Stapley — Product Designer",
    template: "%s — Craig Stapley",
  },
  description:
    "Systems-level product designer. I diagnose the real problem, architect the system, and build the prototype.",
  metadataBase: new URL("https://stapleycreative.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-bg-primary text-text-primary min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
