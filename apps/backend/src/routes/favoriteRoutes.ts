import { Router } from 'express';
import { createFavorite, getFavorites, removeFavorite } from '../services/favoriteService';

export const favoriteRoutes = Router();

favoriteRoutes.get('/favorites', async (_request, response, next) => {
  try {
    response.json(await getFavorites());
  } catch (error) {
    next(error);
  }
});

favoriteRoutes.post('/favorites', async (request, response, next) => {
  try {
    const characterId = Number(request.body?.characterId);

    if (!Number.isInteger(characterId) || characterId <= 0) {
      response.status(400).json({ error: 'Body field "characterId" must be a positive integer.' });
      return;
    }

    response.status(201).json(await createFavorite(characterId));
  } catch (error) {
    next(error);
  }
});

favoriteRoutes.delete('/favorites/:id', async (request, response, next) => {
  try {
    const favoriteId = Number(request.params.id);

    if (!Number.isInteger(favoriteId) || favoriteId <= 0) {
      response.status(400).json({ error: 'Favorite id must be a positive integer.' });
      return;
    }

    const result = await removeFavorite(favoriteId);

    if (!result.deleted) {
      response.status(404).json({ error: 'Favorite not found.' });
      return;
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
