import { getPool } from '../config/database';
import { DragonBallCharacter } from '../types/dragonball';

export interface FavoriteRecord {
  id: number;
  externalCharacterId: number;
  name: string;
  image: string;
  race: string | null;
  gender: string | null;
  ki: string | null;
  maxKi: string | null;
  affiliation: string | null;
  originPlanetName: string | null;
  createdAt: string;
}

function mapFavoriteRow(row: {
  id: number;
  external_character_id: number;
  name: string;
  image: string;
  race: string | null;
  gender: string | null;
  ki: string | null;
  max_ki: string | null;
  affiliation: string | null;
  origin_planet_name: string | null;
  created_at: string;
}): FavoriteRecord {
  return {
    id: row.id,
    externalCharacterId: row.external_character_id,
    name: row.name,
    image: row.image,
    race: row.race,
    gender: row.gender,
    ki: row.ki,
    maxKi: row.max_ki,
    affiliation: row.affiliation,
    originPlanetName: row.origin_planet_name,
    createdAt: row.created_at,
  };
}

export async function listFavorites(): Promise<FavoriteRecord[]> {
  const result = await getPool().query(
    `
      SELECT *
      FROM favorites
      ORDER BY created_at DESC
    `
  );

  return result.rows.map(mapFavoriteRow);
}

export async function upsertFavorite(character: DragonBallCharacter): Promise<FavoriteRecord> {
  const result = await getPool().query(
    `
      INSERT INTO favorites (
        external_character_id,
        name,
        image,
        race,
        gender,
        ki,
        max_ki,
        affiliation,
        origin_planet_name
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (external_character_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        image = EXCLUDED.image,
        race = EXCLUDED.race,
        gender = EXCLUDED.gender,
        ki = EXCLUDED.ki,
        max_ki = EXCLUDED.max_ki,
        affiliation = EXCLUDED.affiliation,
        origin_planet_name = EXCLUDED.origin_planet_name
      RETURNING *
    `,
    [
      character.id,
      character.name,
      character.image,
      character.race,
      character.gender,
      character.ki,
      character.maxKi,
      character.affiliation,
      character.originPlanet?.name ?? null,
    ]
  );

  return mapFavoriteRow(result.rows[0]);
}

export async function deleteFavorite(favoriteId: number): Promise<boolean> {
  const result = await getPool().query('DELETE FROM favorites WHERE id = $1', [favoriteId]);
  return (result.rowCount ?? 0) > 0;
}
