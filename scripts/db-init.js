import Database from 'better-sqlite3';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, 'schema.sql');
// process.cwd() = proje kökü (Cloudflare build ile uyumlu)
const dataDir = join(process.cwd(), 'data');
const dbPath = join(dataDir, 'ariza.db');

mkdirSync(dataDir, { recursive: true });
const db = new Database(dbPath);
const schema = readFileSync(schemaPath, 'utf-8');
db.exec(schema);
db.close();
console.log('Veritabanı oluşturuldu: data/ariza.db');
