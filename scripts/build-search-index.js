#!/usr/bin/env node
/*
 * Embedded Pandora — build-search-index.js
 *
 * Walks the repo for content pages and writes assets/search-index.json,
 * which the homepage search box (assets/js/search.js) fetches at runtime.
 * No dependencies — plain Node fs/path only, so it runs anywhere without
 * an npm install, including as a Vercel build command.
 *
 * Usage: node scripts/build-search-index.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "assets", "search-index.json");

const EXCLUDE_DIRS = new Set([
  ".git",
  "node_modules",
  "assets",
  "_templates",
  "scripts",
]);

const EXCLUDE_FILES = new Set([
  "index.html", // the root homepage itself — it's the search UI, not a result
]);

function walk(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === ROOT && EXCLUDE_DIRS.has(entry.name)) continue;
      walk(full, files);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      const rel = path.relative(ROOT, full);
      if (path.dirname(rel) === "." && EXCLUDE_FILES.has(entry.name)) continue;
      files.push(full);
    }
  }
  return files;
}

function extract(tagPattern, html) {
  const m = html.match(tagPattern);
  return m ? m[1].trim() : "";
}

function humanize(segment) {
  const known = {
    spi: "SPI", i2c: "I2C", uart: "UART", can: "CAN",
    tcp: "TCP", ip: "IP", udp: "UDP", dns: "DNS", gpio: "GPIO",
    "u-boot": "U-Boot",
  };
  const clean = segment.toLowerCase();
  if (known[clean]) return known[clean];
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildEntry(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const rel = path.relative(ROOT, filePath).split(path.sep).join("/");
  const segments = rel.split("/");

  const rawTitle = extract(/<title>([^<]*)<\/title>/i, html) || rel;
  const title = rawTitle.replace(/\s*—\s*Embedded Pandora\s*$/i, "");
  const description = extract(/<meta\s+name="description"\s+content="([^"]*)"/i, html);

  const domain = segments[0] ? humanize(segments[0]) : "";
  const category =
    segments.length > 2 ? humanize(segments[1]) : segments[0] ? "Overview" : "";

  return {
    title,
    url: "/" + rel,
    domain,
    category,
    description,
    tags: segments.slice(0, -1).map((s) => s.toLowerCase()),
  };
}

function main() {
  const files = walk(ROOT, []).sort();
  const index = files.map(buildEntry);
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(index, null, 2) + "\n");
  console.log(`Wrote ${index.length} entries to ${path.relative(ROOT, OUTPUT)}`);
}

main();
