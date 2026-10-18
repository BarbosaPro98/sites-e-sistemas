// Copies ./out to ./preview with relative asset paths, so the static
// export can be opened from any sub-path (e.g. a shared preview link).
// "_next" is renamed to "assets" because some hosts reserve "_" prefixes.
import { cpSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

rmSync("preview", { recursive: true, force: true });
cpSync("out", "preview", { recursive: true });
renameSync("preview/_next", "preview/assets");

function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|css|js|txt)$/.test(f)) {
      let s = readFileSync(p, "utf8");
      const o = s;
      if (f.endsWith(".css")) s = s.replaceAll("/_next/static/media/", "../media/");
      else if (f.endsWith(".js"))
        // Literal U+FFFD inside JS strings is escaped (same value, ASCII-safe).
        s = s.replaceAll('"/_next/"', '"./assets/"').replaceAll("\uFFFD", "\\uFFFD");
      else s = s.replaceAll('"/_next/', '"./assets/').replaceAll("'/_next/", "'./assets/");
      if (s !== o) writeFileSync(p, s);
    }
  }
}
walk("preview");
console.log("preview/ ready");
