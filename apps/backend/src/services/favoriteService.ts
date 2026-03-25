import { deleteFavorite, listFavorites, upsertFavorite } from '../repositories/favoritesRepository';
import { getCharacterById } from './dragonBallService';

export async function getFavorites() {
  return {
    items: await listFavorites(),
  };
}

export async function createFavorite(characterId: number) {
  const { item } = await getCharacterById(characterId);
  const favorite = await upsertFavorite(item);

  return {
    item: favorite,
  };
}

export async function removeFavorite(favoriteId: number) {
  const deleted = await deleteFavorite(favoriteId);
  return { deleted };
}
