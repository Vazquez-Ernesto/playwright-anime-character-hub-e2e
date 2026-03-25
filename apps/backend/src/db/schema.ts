export const schemaSql = `
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  external_character_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  race TEXT,
  gender TEXT,
  ki TEXT,
  max_ki TEXT,
  affiliation TEXT,
  origin_planet_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_history (
  id SERIAL PRIMARY KEY,
  search_term TEXT NOT NULL,
  result_count INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('external', 'cache')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_cache (
  id SERIAL PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  response_json JSONB NOT NULL,
  status_code INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_history_search_term ON search_history(search_term);
CREATE INDEX IF NOT EXISTS idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_api_cache_expires_at ON api_cache(expires_at);
`;
