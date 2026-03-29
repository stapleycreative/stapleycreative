import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDir = path.join(process.cwd(), "content");

export interface ContentMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  image?: string;
  readingTime: string;
  [key: string]: unknown;
}

export interface ContentItem {
  meta: ContentMeta;
  content: string;
}

/** Get all items from a content directory (e.g., "work" or "blog") */
export function getAllContent(type: "work" | "blog"): ContentMeta[] {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = path.join(dir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const slug = filename.replace(/\.mdx$/, "");

      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        tags: data.tags ?? [],
        image: data.image ?? null,
        readingTime: readingTime(content).text,
        ...data,
      } as ContentMeta;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

/** Get a single content item by slug */
export function getContentBySlug(
  type: "work" | "blog",
  slug: string
): ContentItem | null {
  const filePath = path.join(contentDir, type, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    meta: {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      date: data.date ?? "",
      tags: data.tags ?? [],
      image: data.image ?? null,
      readingTime: readingTime(content).text,
      ...data,
    } as ContentMeta,
    content,
  };
}

/** Get all slugs for static generation */
export function getAllSlugs(type: "work" | "blog"): string[] {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
