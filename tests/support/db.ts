import 'dotenv/config';
import { Pool } from 'pg';

let pool: Pool | undefined;

function createPool() {
  if (process.env.DATABASE_URL) {
    return new Pool({ connectionString: process.env.DATABASE_URL });
  }

  return new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'anime_character_hub',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });
}

export function getTestDbPool() {
  if (!pool) {
    pool = createPool();
  }

  return pool;
}

export async function resetDomainTables() {
  await getTestDbPool().query('TRUNCATE TABLE favorites, search_history, api_cache RESTART IDENTITY');
}

export async function closeTestDbPool() {
  await pool?.end();
  pool = undefined;
}
