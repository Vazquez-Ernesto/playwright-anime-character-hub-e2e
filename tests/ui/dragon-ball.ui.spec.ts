import { expect, test } from '@playwright/test';
import { resetDomainTables } from '../support/db';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async () => {
  await resetDomainTables();
});

test('buscar personaje, abrir detalle y guardar favorito', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('character-search-input').fill('Goku');
  await page.getByTestId('character-search-button').click();

  await expect(page.getByTestId('character-results')).toContainText('Goku');

  await page.getByTestId('character-results').locator('article').first().getByRole('link', { name: 'Ver detalle' }).click();

  await expect(page.getByTestId('character-detail')).toBeVisible();
  await expect(page.getByTestId('character-detail-name')).toContainText('Goku');

  await page.getByTestId('add-favorite-button').click();
  await expect(page.getByText('fue guardado en favoritos')).toBeVisible();

  await page.getByRole('link', { name: 'Volver al buscador' }).click();

  await expect(page.getByTestId('favorites-list')).toContainText('Goku');
});

test('muestra estado vacio y permite eliminar un favorito guardado', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('character-search-input').fill('zzznonexistentcharacter');
  await page.getByTestId('character-search-button').click();

  await expect(page.getByText('No hay resultados para la búsqueda actual.')).toBeVisible();
  await expect(page.getByTestId('search-status')).toContainText('Se encontraron 0 resultados');

  await page.getByTestId('character-search-input').fill('Goku');
  await page.getByTestId('character-search-button').click();
  await expect(page.getByTestId('character-results')).toContainText('Goku');

  await page.getByTestId('character-results').locator('article').first().getByRole('link', { name: 'Ver detalle' }).click();
  await page.getByTestId('add-favorite-button').click();
  await expect(page.getByText('fue guardado en favoritos')).toBeVisible();

  await page.getByRole('link', { name: 'Volver al buscador' }).click();
  const favoriteCard = page.getByTestId('favorites-list').locator('article').filter({ hasText: 'Goku' }).first();
  await expect(favoriteCard).toBeVisible();

  await favoriteCard.getByRole('button', { name: 'Eliminar' }).click();

  await expect(page.getByText('No hay favoritos guardados todavía.')).toBeVisible();
  await expect(page.getByTestId('favorites-count')).toHaveText('0');
});
