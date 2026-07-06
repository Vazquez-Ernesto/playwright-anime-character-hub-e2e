import { bootstrapApp } from '../apps/backend/src/app';
import type { IncomingMessage, ServerResponse } from 'node:http';

const handlerPromise = bootstrapApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await handlerPromise;
  app(req, res);
}
