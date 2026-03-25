import type { Favorite } from '../types';

interface FavoritesPanelProps {
  items: Favorite[];
  onRemove: (favoriteId: number) => void;
}

export function FavoritesPanel({ items, onRemove }: FavoritesPanelProps) {
  return (
    <section className="panel favorites-panel">
      <div className="section-heading">
        <h2>Favoritos</h2>
        <span data-testid="favorites-count">{items.length}</span>
      </div>
      {!items.length ? <p>No hay favoritos guardados todavía.</p> : null}
      <div className="favorite-list" data-testid="favorites-list">
        {items.map((favorite) => (
          <article key={favorite.id} className="favorite-card">
            <img src={favorite.image} alt={favorite.name} />
            <div>
              <h3>{favorite.name}</h3>
              <p>{favorite.race || 'Race not available'}</p>
            </div>
            <button
              data-testid={`remove-favorite-${favorite.id}`}
              type="button"
              onClick={() => onRemove(favorite.id)}
            >
              Eliminar
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
