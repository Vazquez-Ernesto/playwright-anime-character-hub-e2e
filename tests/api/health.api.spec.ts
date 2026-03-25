import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('GET /health responde correctamente', async ({ request }) => {
  const response = await request.get('health');

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.status).toBe('ok');
  expect(body.service).toBe('anime-character-hub-backend');
});
