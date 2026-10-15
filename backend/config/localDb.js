import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'database.json');

export function readLocalDb() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      if (data && data.trim()) {
        return JSON.parse(data);
      }
    }
  } catch (e) {
    console.error('Erro ao ler database.json:', e.message);
  }
  return { users: [] };
}

export function writeLocalDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Erro ao salvar database.json:', e.message);
  }
}

export default { readLocalDb, writeLocalDb };

