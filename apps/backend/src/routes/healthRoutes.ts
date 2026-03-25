import { Router } from 'express';
import { getPool } from '../config/database';

export const healthRoutes = Router();

healthRoutes.get('/health', async (_request, response, next) => {
  try {
    await getPool().query('SELECT 1');

    response.json({
      status: 'ok',
      service: 'anime-character-hub-backend',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});
