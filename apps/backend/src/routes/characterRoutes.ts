import { Router } from 'express';
import { getCharacterDetail, getSearchHistory, searchCharacters } from '../services/characterService';

export const characterRoutes = Router();

characterRoutes.get('/characters', async (request, response, next) => {
  try {
    const name = String(request.query.name || '').trim();

    if (!name) {
      response.status(400).json({ error: 'Query parameter "name" is required.' });
      return;
    }

    response.json(await searchCharacters(name));
  } catch (error) {
    next(error);
  }
});

characterRoutes.get('/characters/:id', async (request, response, next) => {
  try {
    const characterId = Number(request.params.id);

    if (!Number.isInteger(characterId) || characterId <= 0) {
      response.status(400).json({ error: 'Character id must be a positive integer.' });
      return;
    }

    response.json(await getCharacterDetail(characterId));
  } catch (error) {
    next(error);
  }
});

characterRoutes.get('/search-history', async (_request, response, next) => {
  try {
    response.json(await getSearchHistory());
  } catch (error) {
    next(error);
  }
});
