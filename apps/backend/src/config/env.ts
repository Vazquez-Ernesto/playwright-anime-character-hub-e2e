import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config();

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  frontendPort: Number(process.env.FRONTEND_PORT || 4173),
  dragonBallApiBaseUrl: requireEnv('DRAGON_BALL_API_BASE_URL', 'https://dragonball-api.com/api'),
  databaseUrl: process.env.DATABASE_URL,
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: Number(process.env.DB_PORT || 5432),
  dbName: process.env.DB_NAME || 'anime_character_hub',
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'postgres',
  dbSsl: process.env.DB_SSL === 'true',
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS || 3600),
  isTest: process.env.NODE_ENV === 'test',
};
