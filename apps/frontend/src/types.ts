export interface CharacterSummary {
  id: number;
  name: string;
  race: string;
  gender: string;
  ki: string;
  maxKi: string;
  affiliation: string;
  image: string;
}

export interface CharacterDetail extends CharacterSummary {
  description: string;
  originPlanet?: {
    id: number;
    name: string;
    isDestroyed: boolean;
    description?: string;
    image?: string;
  } | null;
  transformations?: Array<{
    id: number;
    name: string;
    image: string;
    ki: string;
  }>;
}

export interface Favorite {
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

export interface SearchHistoryEntry {
  id: number;
  searchTerm: string;
  resultCount: number;
  source: 'external' | 'cache';
  createdAt: string;
}
