// Converts the illustrator's PNG masters into the optimised WebP files the app
// ships. Masters live in design/sketches (never committed); output goes to
// src/assets/sketches (committed), keeping the same folder structure.
//
//   npm run sketches
//
// Portrait masters become 720x960, square masters 720x720, both on transparent
// backgrounds. Anything over 90 KB is flagged and fails the run.
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "design/sketches";
const OUT = "src/assets/sketches";
const MAX_BYTES = 90 * 1024;
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return nested.flat();
}

const files = (await walk(SRC)).filter((file) =>
  file.toLowerCase().endsWith(".png"),
);
let oversized = 0;

for (const file of files) {
  const relative = path.relative(SRC, file).replace(/\.png$/i, ".webp");
  const target = path.join(OUT, relative);
  const { width = 0, height = 0 } = await sharp(file).metadata();
  const size =
    height > width ? { width: 720, height: 960 } : { width: 720, height: 720 };

  await mkdir(path.dirname(target), { recursive: true });
  await sharp(file)
    .resize({ ...size, fit: "contain", background: TRANSPARENT })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toFile(target);

  const { size: bytes } = await stat(target);
  const kb = Math.round(bytes / 1024);
  if (bytes > MAX_BYTES) {
    oversized += 1;
    console.warn(`!  ${relative}  ${kb} KB (over 90 KB)`);
  } else {
    console.log(`ok ${relative}  ${kb} KB`);
  }
}

console.log(`\n${files.length} converted, ${oversized} over budget`);
process.exitCode = oversized > 0 ? 1 : 0;
