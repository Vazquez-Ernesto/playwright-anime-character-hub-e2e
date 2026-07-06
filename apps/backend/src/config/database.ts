import { Pool } from 'pg';
import { env } from './env';

let pool: Pool | undefined;

function sanitizeConnectionString(url: string): string {
  const parsed = new URL(url);
  parsed.searchParams.delete('channel_binding');
  return parsed.toString();
}

function createPool(): Pool {
  if (env.databaseUrl) {
    return new Pool({
      connectionString: sanitizeConnectionString(env.databaseUrl),
      ssl: env.dbSsl ? { rejectUnauthorized: false } : false,
    });
  }

  return new Pool({
    host: env.dbHost,
    port: env.dbPort,
    database: env.dbName,
    user: env.dbUser,
    password: env.dbPassword,
    ssl: env.dbSsl ? { rejectUnauthorized: false } : false,
  });
}

export function getPool(): Pool {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}
