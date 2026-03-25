import { expect, test } from '@playwright/test';
import { resetDomainTables } from '../support/db';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async () => {
  await resetDomainTables();
});

test('buscar personajes devuelve resultados de Dragon Ball', async ({ request }) => {
  const response = await request.get('characters?name=goku');

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.items.length).toBeGreaterThan(0);
  expect(body.items[0].name.toLowerCase()).toContain('goku');
  expect(['external', 'cache']).toContain(body.metadata.source);
});

test('alta y listado de favoritos persisten un personaje', async ({ request }) => {
  const searchResponse = await request.get('characters?name=vegeta');
  const searchBody = await searchResponse.json();
  const characterId = searchBody.items[0].id;

  const createResponse = await request.post('favorites', {
    data: { characterId },
  });

  expect(createResponse.status()).toBe(201);

  const createBody = await createResponse.json();
  expect(createBody.item.externalCharacterId).toBe(characterId);

  const listResponse = await request.get('favorites');
  const listBody = await listResponse.json();

  expect(listBody.items).toHaveLength(1);
  expect(listBody.items[0].externalCharacterId).toBe(characterId);
});

test('requests invalidos devuelven errores controlados', async ({ request }) => {
  const missingQueryResponse = await request.get('characters');
  expect(missingQueryResponse.status()).toBe(400);
  await expect(missingQueryResponse.json()).resolves.toEqual({
    error: 'Query parameter "name" is required.',
  });

  const invalidFavoriteResponse = await request.post('favorites', {
    data: { characterId: 0 },
  });
  expect(invalidFavoriteResponse.status()).toBe(400);
  await expect(invalidFavoriteResponse.json()).resolves.toEqual({
    error: 'Body field "characterId" must be a positive integer.',
  });

  const missingFavoriteResponse = await request.delete('favorites/999999');
  expect(missingFavoriteResponse.status()).toBe(404);
  await expect(missingFavoriteResponse.json()).resolves.toEqual({
    error: 'Favorite not found.',
  });
});
