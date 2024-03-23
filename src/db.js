import fs from 'node:fs/promises';
const DB_PATH = new URL('../db.json', import.meta.url).pathname;

export async function getDB() {
  const db = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(db);
}

export async function saveDB(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  return db;
}

export async function insertDB(key, value) {
  const db = await getDB();
  if (!(key in db)) {
    db[key] = [];
  }
  const record = { ...value, id: crypto.randomUUID(), created: Date.now() };
  db[key].push(record);
  await saveDB(db);
  return record;
}
