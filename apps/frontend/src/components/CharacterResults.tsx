import { Link } from 'react-router-dom';
import type { CharacterSummary } from '../types';

interface CharacterResultsProps {
  items: CharacterSummary[];
  emptyMessage: string;
}

export function CharacterResults({ items, emptyMessage }: CharacterResultsProps) {
  if (!items.length) {
    return (
      <section className="panel">
        <h2>Resultados</h2>
        <p>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Resultados</h2>
        <span>{items.length} personaje(s)</span>
      </div>
      <div className="card-grid" data-testid="character-results">
        {items.map((character) => (
          <article key={character.id} className="character-card" data-testid={`character-card-${character.id}`}>
            <img src={character.image} alt={character.name} />
            <div className="character-card-body">
              <h3>{character.name}</h3>
              <p>{character.race}</p>
              <p>{character.affiliation}</p>
              <Link data-testid={`view-character-${character.id}`} to={`/characters/${character.id}`}>
                Ver detalle
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
