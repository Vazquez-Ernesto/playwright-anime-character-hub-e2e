import { getPool } from '../config/database';

export interface CachedPayload<T> {
  cacheKey: string;
  statusCode: number;
  responseJson: T;
  expiresAt: Date;
}

export async function getCachedResponse<T>(cacheKey: string): Promise<T | null> {
  const result = await getPool().query<{ response_json: T }>(
    `
      SELECT response_json
      FROM api_cache
      WHERE cache_key = $1
        AND expires_at > NOW()
      LIMIT 1
    `,
    [cacheKey]
  );

  return result.rows[0]?.response_json ?? null;
}

export async function upsertCache<T>(payload: CachedPayload<T>): Promise<void> {
  await getPool().query(
    `
      INSERT INTO api_cache (cache_key, response_json, status_code, expires_at, updated_at)
      VALUES ($1, $2::jsonb, $3, $4, NOW())
      ON CONFLICT (cache_key)
      DO UPDATE SET
        response_json = EXCLUDED.response_json,
        status_code = EXCLUDED.status_code,
        expires_at = EXCLUDED.expires_at,
        updated_at = NOW()
    `,
    [payload.cacheKey, JSON.stringify(payload.responseJson), payload.statusCode, payload.expiresAt]
  );
}
