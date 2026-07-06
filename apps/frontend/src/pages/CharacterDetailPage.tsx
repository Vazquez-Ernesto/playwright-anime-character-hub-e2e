import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createFavorite, fetchCharacterDetail, fetchFavorites } from '../lib/api';
import type { CharacterDetail, Favorite } from '../types';

export function CharacterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [favorite, setFavorite] = useState<Favorite | null>(null);
  const [status, setStatus] = useState('Cargando personaje...');
  const loadedRef = useRef<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) {
        setStatus('No se indicó un personaje válido.');
        return;
      }

      if (loadedRef.current === id) {
        return;
      }

      loadedRef.current = id;

      try {
        const [detailResponse, favoritesResponse] = await Promise.all([
          fetchCharacterDetail(Number(id)),
          fetchFavorites(),
        ]);

        setCharacter(detailResponse.item);
        setFavorite(
          favoritesResponse.items.find((item) => item.externalCharacterId === detailResponse.item.id) ?? null
        );
        setStatus(`Detalle cargado desde ${detailResponse.metadata.source}.`);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'No se pudo cargar el detalle.');
      }
    }

    void load();
  }, [id]);

  async function handleAddFavorite() {
    if (!character) {
      return;
    }

    const response = await createFavorite(character.id);
    setFavorite(response.item);
    setStatus(`${character.name} fue guardado en favoritos.`);
  }

  async function refreshFavorite() {
    if (!character) {
      return;
    }

    const favoritesResponse = await fetchFavorites();
    setFavorite(favoritesResponse.items.find((item) => item.externalCharacterId === character.id) ?? null);
  }

  useEffect(() => {
    void refreshFavorite();
  }, [character?.id]);

  if (!character) {
    return (
      <section className="panel">
        <Link to="/">Volver</Link>
        <p>{status}</p>
      </section>
    );
  }

  return (
    <div className="detail-layout">
      <section className="panel detail-panel" data-testid="character-detail">
        <button type="button" className="link-button" onClick={() => navigate(-1)}>
          Volver
        </button>
        <div className="detail-hero">
          <img src={character.image} alt={character.name} />
          <div>
            <p className="eyebrow">Dragon Ball Character</p>
            <h2 data-testid="character-detail-name">{character.name}</h2>
            <p>{character.description}</p>
            <dl className="detail-grid">
              <div>
                <dt>Race</dt>
                <dd>{character.race}</dd>
              </div>
              <div>
                <dt>Affiliation</dt>
                <dd>{character.affiliation}</dd>
              </div>
              <div>
                <dt>KI</dt>
                <dd>{character.ki}</dd>
              </div>
              <div>
                <dt>Max KI</dt>
                <dd>{character.maxKi}</dd>
              </div>
              <div>
                <dt>Origin planet</dt>
                <dd>{character.originPlanet?.name || 'Unknown'}</dd>
              </div>
            </dl>
            <div className="detail-actions">
              <button
                data-testid="add-favorite-button"
                type="button"
                onClick={() => void handleAddFavorite()}
                disabled={Boolean(favorite)}
              >
                {favorite ? 'Ya está en favoritos' : 'Guardar favorito'}
              </button>
              <button
                data-testid="search-by-race-button"
                type="button"
                onClick={() => void navigate(`/?race=${encodeURIComponent(character.race)}`)}
              >
                Buscar más de {character.race}
              </button>
              <Link to="/">Volver al buscador</Link>
            </div>
            <p className="detail-status">{status}</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Transformaciones</h2>
          <span>{character.transformations?.length || 0}</span>
        </div>
        {!character.transformations?.length ? <p>No hay transformaciones listadas.</p> : null}
        <div className="transformation-grid">
          {character.transformations?.map((transformation) => (
            <article key={transformation.id} className="transformation-card">
              <img src={transformation.image} alt={transformation.name} />
              <div>
                <h3>{transformation.name}</h3>
                <p>{transformation.ki}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
