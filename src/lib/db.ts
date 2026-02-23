import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "youtube-manager.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    ensureTablesSync(_db);
  }
  return _db;
}

function hasColumn(db: Database.Database, table: string, column: string): boolean {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  return cols.some((c) => c.name === column);
}

function ensureTablesSync(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      handle TEXT,
      avatar_url TEXT,
      subscriber_count INTEGER,
      color TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      thumbnail_url TEXT,
      published_at TEXT NOT NULL,
      duration TEXT,
      view_count INTEGER DEFAULT 0,
      description TEXT,
      status TEXT DEFAULT 'public',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS sync_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
      synced_at TEXT DEFAULT (datetime('now')),
      videos_fetched INTEGER DEFAULT 0,
      status TEXT DEFAULT 'success',
      error_message TEXT
    );
  `);

  db.exec(`CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON videos(channel_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sync_log_channel_id ON sync_log(channel_id)`);

  // Migrations
  if (!hasColumn(db, "channels", "videos_per_day")) {
    db.exec(`ALTER TABLE channels ADD COLUMN videos_per_day INTEGER DEFAULT 1`);
  }
  if (!hasColumn(db, "videos", "like_count")) {
    db.exec(`ALTER TABLE videos ADD COLUMN like_count INTEGER DEFAULT 0`);
  }
  if (!hasColumn(db, "videos", "comment_count")) {
    db.exec(`ALTER TABLE videos ADD COLUMN comment_count INTEGER DEFAULT 0`);
  }
  if (!hasColumn(db, "videos", "scheduled_at")) {
    db.exec(`ALTER TABLE videos ADD COLUMN scheduled_at TEXT`);
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
}

export function ensureTables() {
  getDb();
}

export function query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T[] {
  const db = getDb();
  return db.prepare(sql).all(...params) as T[];
}

export function queryOne<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T | undefined {
  const db = getDb();
  return db.prepare(sql).get(...params) as T | undefined;
}

export function run(sql: string, params: unknown[] = []): Database.RunResult {
  const db = getDb();
  return db.prepare(sql).run(...params);
}

export function getDatabase(): Database.Database {
  return getDb();
}

export default { query, queryOne, run, ensureTables, getDatabase };
