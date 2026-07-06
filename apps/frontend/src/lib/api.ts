import type { CharacterDetail, CharacterSummary, Favorite, SearchHistoryEntry } from '../types';

const apiBaseUrl = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errorBody?.error || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function fetchHealth() {
  return request<{ status: string; service: string }>('/health');
}

export async function searchCharacters(name: string) {
  return request<{ items: CharacterSummary[]; metadata: { total: number; source: string; query: string } }>(
    `/characters?name=${encodeURIComponent(name)}`
  );
}

export async function fetchCharacterDetail(id: number) {
  return request<{ item: CharacterDetail; metadata: { source: string } }>(`/characters/${id}`);
}

export async function fetchFavorites() {
  return request<{ items: Favorite[] }>('/favorites');
}

export async function createFavorite(characterId: number) {
  return request<{ item: Favorite }>('/favorites', {
    method: 'POST',
    body: JSON.stringify({ characterId }),
  });
}

export async function deleteFavorite(favoriteId: number) {
  return request<void>(`/favorites/${favoriteId}`, {
    method: 'DELETE',
  });
}

export async function fetchSearchHistory() {
  return request<{ items: SearchHistoryEntry[] }>('/search-history');
}

export async function clearSearchHistory() {
  return request<void>('/search-history', { method: 'DELETE' });
}
