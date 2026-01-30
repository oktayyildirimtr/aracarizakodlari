/**
 * İnternetteki gerçek OBD-II DTC tanımlarını (dtcmapping gist) indirir.
 * P0xxx kodları data/dtcmapping-p0xxx.json olarak kaydedilir.
 * Kaynak: https://gist.github.com/wzr1337/8af2731a5ffa98f9d506537279da7a0e
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'data', 'dtcmapping-p0xxx.json');
const url = 'https://gist.githubusercontent.com/wzr1337/8af2731a5ffa98f9d506537279da7a0e/raw/dtcmapping.json';

async function main() {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const full = await res.json();

  const p0xxx = {};
  for (const [code, desc] of Object.entries(full)) {
    if (!/^P0\d{3}$/.test(code)) continue;
    if (typeof desc !== 'string' || !desc.trim()) continue;
    p0xxx[code] = desc.trim();
  }

  mkdirSync(join(__dirname, '..', 'data'), { recursive: true });
  writeFileSync(outPath, JSON.stringify(p0xxx, null, 0), 'utf8');
  console.log(`dtcmapping-p0xxx.json yazıldı: ${Object.keys(p0xxx).length} kod.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
