import { getPool } from '../config/database';

export interface SearchHistoryRecord {
  id: number;
  searchTerm: string;
  resultCount: number;
  source: 'external' | 'cache';
  createdAt: string;
}

function mapRow(row: {
  id: number;
  search_term: string;
  result_count: number;
  source: 'external' | 'cache';
  created_at: string;
}): SearchHistoryRecord {
  return {
    id: row.id,
    searchTerm: row.search_term,
    resultCount: row.result_count,
    source: row.source,
    createdAt: row.created_at,
  };
}

export async function createSearchHistoryEntry(
  searchTerm: string,
  resultCount: number,
  source: 'external' | 'cache'
): Promise<void> {
  await getPool().query(
    `
      INSERT INTO search_history (search_term, result_count, source)
      VALUES ($1, $2, $3)
    `,
    [searchTerm, resultCount, source]
  );
}

export async function clearSearchHistory(): Promise<void> {
  await getPool().query('DELETE FROM search_history');
}

export async function listSearchHistory(limit = 20): Promise<SearchHistoryRecord[]> {
  const result = await getPool().query(
    `
      SELECT *
      FROM search_history
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows.map(mapRow);
}
