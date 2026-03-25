import { getPool } from '../config/database';
import { schemaSql } from './schema';

let initialized = false;

export async function ensureSchema(): Promise<void> {
  if (initialized) {
    return;
  }

  await getPool().query(schemaSql);
  initialized = true;
}
