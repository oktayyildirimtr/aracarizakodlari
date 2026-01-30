import { unlinkSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'ariza.db');

if (existsSync(dbPath)) {
  unlinkSync(dbPath);
  console.log('Veritabanı silindi.');
}
console.log('db:init çalıştırılıyor...');
const { execSync } = await import('child_process');
execSync('node scripts/db-init.js', { stdio: 'inherit', cwd: join(__dirname, '..') });
console.log('db:migrate çalıştırılıyor...');
execSync('node scripts/db-migrate.js', { stdio: 'inherit', cwd: join(__dirname, '..') });
console.log('db:seed çalıştırılıyor...');
execSync('node scripts/db-seed.js', { stdio: 'inherit', cwd: join(__dirname, '..') });
console.log('db:set-top-codes çalıştırılıyor (sadece top 30 sayfada gösterilecek)...');
execSync('node scripts/db-set-top-codes.js', { stdio: 'inherit', cwd: join(__dirname, '..') });
console.log('Tamamlandı.');
