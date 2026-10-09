import fs from 'node:fs';
import path from 'node:path';
import { getDb } from './connection.js';

export function runMigrations(customPath?: string): { success: boolean; appliedStatements: number } {
  const db = getDb(customPath);

  // Setup migration journal
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  // Check if 001_initial_schema already applied
  const existing = db.prepare('SELECT id FROM schema_migrations WHERE version = ?').get('001_initial_schema');
  if (existing) {
    return { success: true, appliedStatements: 0 };
  }

  // Execute DDL
  db.exec('BEGIN TRANSACTION;');
  try {
    db.exec(schemaSql);
    db.prepare(`
      INSERT INTO schema_migrations (version, description) 
      VALUES (?, ?)
    `).run('001_initial_schema', 'Initial CampusIQ AI master schema with multi-college isolation');
    db.exec('COMMIT;');
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }

  return { success: true, appliedStatements: 1 };
}

// Allow standalone execution
if (process.argv[1] && process.argv[1].endsWith('migrate.ts')) {
  try {
    console.log('[CampusIQ AI Migrations] Executing schema migrations...');
    const result = runMigrations();
    console.log('[CampusIQ AI Migrations] Migration complete successfully.', result);
  } catch (err) {
    console.error('[CampusIQ AI Migrations] Migration failed:', err);
    process.exit(1);
  }
}
