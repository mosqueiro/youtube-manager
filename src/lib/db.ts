import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5435/youtube_manager",
  max: 10,
  idleTimeoutMillis: 30000,
});

let migratePromise: Promise<void> | null = null;

export async function ensureTables() {
  if (!migratePromise) {
    migratePromise = runMigrations();
  }
  return migratePromise;
}

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS channels (
        id VARCHAR(30) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        handle VARCHAR(100),
        avatar_url TEXT,
        subscriber_count BIGINT,
        color VARCHAR(7) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id VARCHAR(20) PRIMARY KEY,
        channel_id VARCHAR(30) REFERENCES channels(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        thumbnail_url TEXT,
        published_at TIMESTAMP NOT NULL,
        duration VARCHAR(20),
        view_count BIGINT DEFAULT 0,
        description TEXT,
        status VARCHAR(20) DEFAULT 'public',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS sync_log (
        id SERIAL PRIMARY KEY,
        channel_id VARCHAR(30) REFERENCES channels(id) ON DELETE CASCADE,
        synced_at TIMESTAMP DEFAULT NOW(),
        videos_fetched INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'success',
        error_message TEXT
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON videos(channel_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sync_log_channel_id ON sync_log(channel_id)`);
    await client.query(`ALTER TABLE channels ADD COLUMN IF NOT EXISTS videos_per_day INTEGER DEFAULT 1`);
    await client.query(`ALTER TABLE videos ADD COLUMN IF NOT EXISTS like_count BIGINT DEFAULT 0`);
    await client.query(`ALTER TABLE videos ADD COLUMN IF NOT EXISTS comment_count BIGINT DEFAULT 0`);
  } finally {
    client.release();
  }
}

export default pool;
