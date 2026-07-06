import type { SearchHistoryEntry } from '../types';

interface SearchHistoryPanelProps {
  items: SearchHistoryEntry[];
  onClear: () => void;
}

export function SearchHistoryPanel({ items, onClear }: SearchHistoryPanelProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Historial de búsquedas</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{items.length}</span>
          {items.length > 0 && (
            <button
              data-testid="clear-history-button"
              type="button"
              onClick={onClear}
              style={{ fontSize: '0.7rem', padding: '2px 6px' }}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
      {!items.length ? <p>Todavía no hay búsquedas registradas.</p> : null}
      <ul className="history-list" data-testid="search-history-list">
        {items.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.searchTerm}</strong>
            <span>{entry.resultCount} resultados</span>
            <span className={`pill ${entry.source}`}>{entry.source}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
