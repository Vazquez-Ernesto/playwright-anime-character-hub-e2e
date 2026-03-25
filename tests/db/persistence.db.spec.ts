import { expect, test } from '@playwright/test';
import { closeTestDbPool, getTestDbPool, resetDomainTables } from '../support/db';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async () => {
  await resetDomainTables();
});

test.afterAll(async () => {
  await closeTestDbPool();
});

test('favorites se inserta al guardar un personaje', async ({ request }) => {
  const searchResponse = await request.get(`${process.env.API_BASE_URL || 'http://127.0.0.1:4000'}/api/characters?name=goku`);
  const searchBody = await searchResponse.json();
  const characterId = searchBody.items[0].id;

  await request.post(`${process.env.API_BASE_URL || 'http://127.0.0.1:4000'}/api/favorites`, {
    data: { characterId },
  });

  const result = await getTestDbPool().query(
    'SELECT external_character_id, name FROM favorites WHERE external_character_id = $1',
    [characterId]
  );

  expect(result.rows).toHaveLength(1);
  expect(result.rows[0].name).toBeTruthy();
});

test('search_history registra una búsqueda y luego lee desde cache', async ({ request }) => {
  const apiBaseUrl = `${process.env.API_BASE_URL || 'http://127.0.0.1:4000'}/api`;

  await request.get(`${apiBaseUrl}/characters?name=frieza`);
  await request.get(`${apiBaseUrl}/characters?name=frieza`);

  const result = await getTestDbPool().query(
    `
      SELECT search_term, source
      FROM search_history
      WHERE search_term = 'frieza'
      ORDER BY created_at ASC
    `
  );

  expect(result.rows.length).toBeGreaterThanOrEqual(2);
  expect(result.rows[0].source).toBe('external');
  expect(result.rows[1].source).toBe('cache');
});

test('api_cache guarda la respuesta de detalle cuando se crea un favorito', async ({ request }) => {
  const apiBaseUrl = `${process.env.API_BASE_URL || 'http://127.0.0.1:4000'}/api`;
  const searchResponse = await request.get(`${apiBaseUrl}/characters?name=piccolo`);
  const searchBody = await searchResponse.json();
  const characterId = searchBody.items[0].id;

  await request.post(`${apiBaseUrl}/favorites`, {
    data: { characterId },
  });

  const result = await getTestDbPool().query(
    'SELECT cache_key, response_json->>\'name\' AS name FROM api_cache WHERE cache_key = $1',
    [`characters:detail:${characterId}`]
  );

  expect(result.rows).toHaveLength(1);
  expect(result.rows[0].name).toBeTruthy();
});
