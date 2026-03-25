import { env } from '../config/env';
import { getCachedResponse, upsertCache } from '../repositories/cacheRepository';
import { DragonBallCharacter, CharacterSummary } from '../types/dragonball';

interface SearchCharactersResult {
  items: CharacterSummary[];
  source: 'external' | 'cache';
}

function normalizeSummary(character: DragonBallCharacter): CharacterSummary {
  return {
    id: character.id,
    name: character.name,
    race: character.race,
    gender: character.gender,
    ki: character.ki,
    maxKi: character.maxKi,
    affiliation: character.affiliation,
    image: character.image,
  };
}

async function fetchJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${env.dragonBallApiBaseUrl}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Dragon Ball API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function searchCharactersByName(name: string): Promise<SearchCharactersResult> {
  const normalizedName = name.trim().toLowerCase();
  const cacheKey = `characters:search:${normalizedName}`;
  const cached = await getCachedResponse<CharacterSummary[]>(cacheKey);

  if (cached) {
    return { items: cached, source: 'cache' };
  }

  const response = await fetchJson<DragonBallCharacter[]>(`/characters?name=${encodeURIComponent(normalizedName)}`);
  const items = response.map(normalizeSummary);

  await upsertCache({
    cacheKey,
    statusCode: 200,
    responseJson: items,
    expiresAt: new Date(Date.now() + env.cacheTtlSeconds * 1000),
  });

  return { items, source: 'external' };
}

export async function getCharacterById(id: number): Promise<{ item: DragonBallCharacter; source: 'external' | 'cache' }> {
  const cacheKey = `characters:detail:${id}`;
  const cached = await getCachedResponse<DragonBallCharacter>(cacheKey);

  if (cached) {
    return { item: cached, source: 'cache' };
  }

  const item = await fetchJson<DragonBallCharacter>(`/characters/${id}`);

  await upsertCache({
    cacheKey,
    statusCode: 200,
    responseJson: item,
    expiresAt: new Date(Date.now() + env.cacheTtlSeconds * 1000),
  });

  return { item, source: 'external' };
}
