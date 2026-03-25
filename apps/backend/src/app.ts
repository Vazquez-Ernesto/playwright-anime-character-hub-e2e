import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { ensureSchema } from './db/migrate';
import { characterRoutes } from './routes/characterRoutes';
import { favoriteRoutes } from './routes/favoriteRoutes';
import { healthRoutes } from './routes/healthRoutes';

export const app = express();

app.use(
  cors({
    origin: [`http://127.0.0.1:${env.frontendPort}`, `http://localhost:${env.frontendPort}`],
  })
);
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
