export interface DragonBallTransformation {
  id: number;
  name: string;
  image: string;
  ki: string;
}

export interface DragonBallOriginPlanet {
  id: number;
  name: string;
  isDestroyed: boolean;
  description?: string;
  image?: string;
}

export interface DragonBallCharacter {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  image: string;
  affiliation: string;
  originPlanet?: DragonBallOriginPlanet | null;
  transformations?: DragonBallTransformation[];
}

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
