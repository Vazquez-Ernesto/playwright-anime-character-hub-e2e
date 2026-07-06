import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CharacterSummary } from '../types';

interface CharacterResultsProps {
  items: CharacterSummary[];
  emptyMessage: string;
}

type SortKey = 'name' | 'ki';

function parseKi(ki: string): number {
  return Number(ki.replace(/[^0-9]/g, '')) || 0;
}

export function CharacterResults({ items, emptyMessage }: CharacterResultsProps) {
  const [sortBy, setSortBy] = useState<SortKey>('name');

  if (!items.length) {
    return (
      <section className="panel">
        <h2>Resultados</h2>
        <p>{emptyMessage}</p>
      </section>
    );
  }

  const sorted = [...items].sort((a, b) =>
    sortBy === 'name' ? a.name.localeCompare(b.name) : parseKi(b.ki) - parseKi(a.ki)
  );

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Resultados</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{items.length} personaje(s)</span>
          <select
            data-testid="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            style={{ fontSize: '0.75rem' }}
          >
            <option value="name">Nombre A-Z</option>
            <option value="ki">Ki ↓</option>
          </select>
        </div>
      </div>
      <div className="card-grid" data-testid="character-results">
        {sorted.map((character) => (
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
