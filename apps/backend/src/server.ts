import { bootstrapApp } from './app';
import { env } from './config/env';

async function startServer() {
  const application = await bootstrapApp();

  application.listen(env.port, '0.0.0.0', () => {
    console.log(`Backend listening on http://0.0.0.0:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
