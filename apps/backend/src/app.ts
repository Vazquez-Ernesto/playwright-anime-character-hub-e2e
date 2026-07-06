import express from 'express';
import { ensureSchema } from './db/migrate';
import { characterRoutes } from './routes/characterRoutes';
import { favoriteRoutes } from './routes/favoriteRoutes';
import { healthRoutes } from './routes/healthRoutes';

export const app = express();

const defaultOrigins = [
  'http://127.0.0.1:4173',
  'http://127.0.0.1:4174',
  'http://localhost:4173',
  'http://localhost:4174',
];

const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultOrigins, ...extraOrigins]);

app.use((request, response, next) => {
  const requestOrigin = typeof request.headers.origin === 'string' ? request.headers.origin : undefined;

  if (requestOrigin) {
    if (!allowedOrigins.has(requestOrigin)) {
      response.status(403).json({ error: `Origin ${requestOrigin} is not allowed by CORS.` });
      return;
    }

    response.header('Access-Control-Allow-Origin', requestOrigin);
    response.header('Vary', 'Origin');
  }

  response.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.header('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(204).send();
    return;
  }

  next();
});
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', characterRoutes);
app.use('/api', favoriteRoutes);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  response.status(500).json({ error: message });
});

export async function bootstrapApp(): Promise<typeof app> {
  await ensureSchema();
  return app;
}
