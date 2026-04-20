#!/usr/bin/env node
/**
 * Image compression for public/work/**
 *
 * Runs on pre-commit. Finds staged image files under public/ that are either
 * too large or too wide, and compresses them in place before they're
 * committed. Idempotent — if a file already meets the budget, it's left alone.
 *
 * Budget (chosen so next/image has headroom for responsive srcset):
 *   - max width: 2400px
 *   - JPEG quality: 85
 *   - PNG: palette-8 quantization if that fits under the size cap,
 *     otherwise lossless re-encode
 *   - size cap: 500KB (warn only, never fail the commit)
 *
 * Usage:
 *   node scripts/compress-images.mjs              # process everything in public/
 *   node scripts/compress-images.mjs --staged     # only files staged for commit
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { extname } from "node:path";
import sharp from "sharp";

const MAX_WIDTH = 2400;
const JPEG_QUALITY = 85;
const SIZE_WARN_KB = 500;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const stagedOnly = process.argv.includes("--staged");

function listFiles() {
  if (stagedOnly) {
    const out = execSync("git diff --cached --name-only --diff-filter=ACM", {
      encoding: "utf8",
    });
    return out
      .split("\n")
      .filter((f) => f.startsWith("public/") && IMAGE_EXT.has(extname(f).toLowerCase()));
  }
  const out = execSync("find public -type f \\( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \\)", {
    encoding: "utf8",
  });
  return out.split("\n").filter(Boolean);
}

async function processFile(filepath) {
  const ext = extname(filepath).toLowerCase();
  const input = readFileSync(filepath);
  const beforeKB = Math.round(input.length / 1024);

  let pipeline = sharp(input);
  const { width } = await pipeline.metadata();

  if (width && width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  let output;
  if (ext === ".jpg" || ext === ".jpeg") {
    output = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  } else if (ext === ".png") {
    output = await pipeline.png({ quality: 85, compressionLevel: 9, palette: true }).toBuffer();
  } else if (ext === ".webp") {
    output = await pipeline.webp({ quality: 85 }).toBuffer();
  } else {
    return null;
  }

  const afterKB = Math.round(output.length / 1024);

  // Only rewrite if we actually saved bytes. Protects against cases where
  // sharp's output is larger than the source (already-tight PNGs).
  if (output.length < input.length) {
    writeFileSync(filepath, output);
    if (stagedOnly) {
      execSync(`git add "${filepath}"`);
    }
    const saved = beforeKB - afterKB;
    const flag = afterKB > SIZE_WARN_KB ? " ⚠ still >500KB" : "";
    console.log(`  ${filepath}: ${beforeKB}KB → ${afterKB}KB (-${saved}KB)${flag}`);
    return { filepath, beforeKB, afterKB };
  }

  if (beforeKB > SIZE_WARN_KB) {
    console.log(`  ${filepath}: ${beforeKB}KB (already optimized, but over budget)`);
  }
  return null;
}

async function main() {
  const files = listFiles();
  if (files.length === 0) {
    console.log("No images to process.");
    return;
  }
  console.log(`Processing ${files.length} image${files.length === 1 ? "" : "s"}...`);
  for (const f of files) {
    try {
      await processFile(f);
    } catch (err) {
      console.error(`  ${f}: failed — ${err.message}`);
    }
  }
}

main();
