import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

let instance: DatabaseSync | null = null;
let currentDbPath: string = ':memory:';

export function getDatabasePath(): string {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }
  const defaultDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(defaultDir)) {
    fs.mkdirSync(defaultDir, { recursive: true });
  }
  return path.join(defaultDir, 'campusiq.db');
}

export function getDb(customPath?: string): DatabaseSync {
  const targetPath = customPath || getDatabasePath();
  
  if (instance && currentDbPath === targetPath) {
    return instance;
  }

  if (instance) {
    instance.close();
    instance = null;
  }

  currentDbPath = targetPath;
  instance = new DatabaseSync(targetPath);

  // Enable foreign key constraints and WAL mode for reliability
  instance.exec('PRAGMA foreign_keys = ON;');
  if (targetPath !== ':memory:') {
    instance.exec('PRAGMA journal_mode = WAL;');
  }

  return instance;
}

export function closeDb(): void {
  if (instance) {
    instance.close();
    instance = null;
  }
}

export function runQuery(sql: string, params: (string | number | null | undefined)[] = []): { changes: number; lastInsertRowid: number | bigint } {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

export function queryAll<T = any>(sql: string, params: (string | number | null | undefined)[] = []): T[] {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.all(...params) as T[];
}

export function queryOne<T = any>(sql: string, params: (string | number | null | undefined)[] = []): T | null {
  const db = getDb();
  const stmt = db.prepare(sql);
  const result = stmt.get(...params) as T | undefined;
  return result ?? null;
}

export function transaction<T>(fn: (db: DatabaseSync) => T): T {
  const db = getDb();
  db.exec('BEGIN TRANSACTION;');
  try {
    const result = fn(db);
    db.exec('COMMIT;');
    return result;
  } catch (error) {
    db.exec('ROLLBACK;');
    throw error;
  }
}
