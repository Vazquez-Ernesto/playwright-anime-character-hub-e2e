import { useEffect, useRef, useState } from 'react';
import { CharacterResults } from '../components/CharacterResults';
import { FavoritesPanel } from '../components/FavoritesPanel';
import { SearchHistoryPanel } from '../components/SearchHistoryPanel';
import { SearchPanel } from '../components/SearchPanel';
import { fetchFavorites, fetchSearchHistory, searchCharacters, deleteFavorite } from '../lib/api';
import type { CharacterSummary, Favorite, SearchHistoryEntry } from '../types';

export function HomePage() {
  const [query, setQuery] = useState('Goku');
  const [results, setResults] = useState<CharacterSummary[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Listo para buscar personajes.');
  const initializedRef = useRef(false);

  async function loadSidebarData() {
    const [favoriteResponse, historyResponse] = await Promise.all([fetchFavorites(), fetchSearchHistory()]);
    setFavorites(favoriteResponse.items);
    setSearchHistory(historyResponse.items);
  }

  async function handleSearch() {
    if (!query.trim()) {
      setStatus('Ingresá un nombre para buscar.');
      return;
    }

    setLoading(true);

    try {
      const response = await searchCharacters(query);
      setResults(response.items);
      setStatus(`Se encontraron ${response.metadata.total} resultados desde ${response.metadata.source}.`);
      await loadSidebarData();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo ejecutar la búsqueda.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavorite(favoriteId: number) {
    await deleteFavorite(favoriteId);
    await loadSidebarData();
  }

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    void loadSidebarData();
    void handleSearch();
  }, []);

  return (
    <div className="dashboard">
      <section className="main-column">
        <SearchPanel value={query} loading={loading} onChange={setQuery} onSubmit={() => void handleSearch()} />
        <section className="status-banner" data-testid="search-status">
          {status}
        </section>
        <CharacterResults items={results} emptyMessage="No hay resultados para la búsqueda actual." />
      </section>
      <aside className="sidebar">
        <FavoritesPanel items={favorites} onRemove={(favoriteId) => void handleRemoveFavorite(favoriteId)} />
        <SearchHistoryPanel items={searchHistory} />
      </aside>
    </div>
  );
}
