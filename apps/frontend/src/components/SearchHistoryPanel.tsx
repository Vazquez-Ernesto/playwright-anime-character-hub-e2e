import type { SearchHistoryEntry } from '../types';

interface SearchHistoryPanelProps {
  items: SearchHistoryEntry[];
}

export function SearchHistoryPanel({ items }: SearchHistoryPanelProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Historial de búsquedas</h2>
        <span>{items.length}</span>
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
