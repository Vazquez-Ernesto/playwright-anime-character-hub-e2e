import { getPool } from '../config/database';
import { schemaSql } from './schema';

let initialized = false;

// Error codes that mean the object already exists — safe to ignore under concurrent cold starts.
const ALREADY_EXISTS_CODES = new Set(['42P07', '42710', '23505']);

export async function ensureSchema(): Promise<void> {
  if (initialized) {
    return;
  }

  const pool = getPool();
  const statements = schemaSql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    try {
      await pool.query(statement);
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      if (!ALREADY_EXISTS_CODES.has(code ?? '')) {
        throw error;
      }
    }
  }

  initialized = true;
}
