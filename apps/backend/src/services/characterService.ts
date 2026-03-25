import { createSearchHistoryEntry, listSearchHistory } from '../repositories/searchHistoryRepository';
import { getCharacterById, searchCharactersByName } from './dragonBallService';

export async function searchCharacters(name: string) {
  const response = await searchCharactersByName(name);

  await createSearchHistoryEntry(name.trim(), response.items.length, response.source);

  return {
    items: response.items,
    metadata: {
      query: name.trim(),
      total: response.items.length,
      source: response.source,
    },
  };
}

export async function getCharacterDetail(characterId: number) {
  const response = await getCharacterById(characterId);

  return {
    item: response.item,
    metadata: {
      source: response.source,
    },
  };
}

export async function getSearchHistory() {
  return {
    items: await listSearchHistory(20),
  };
}
