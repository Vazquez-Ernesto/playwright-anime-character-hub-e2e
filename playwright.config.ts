import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

// La API de Dragon Ball es un servicio de terceros: por defecto los tests usan
// un stub local con fixtures (tests/support/dragonball-stub). Con
// DRAGON_BALL_API_MODE=live el backend usa DRAGON_BALL_API_BASE_URL (la API real).
const useDragonBallStub = process.env.DRAGON_BALL_API_MODE !== 'live';
const dragonBallStubPort = Number(process.env.DRAGON_BALL_STUB_PORT || 4010);
const dragonBallStubUrl = `http://127.0.0.1:${dragonBallStubPort}/api`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Los proyectos ui, api y db comparten una base y cada test la trunca en su
  // beforeEach: con más de un worker, archivos de proyectos distintos corren en
  // paralelo y se borran los datos entre sí.
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    ...(useDragonBallStub
      ? [
          {
            command: 'npx tsx tests/support/dragonball-stub/server.ts',
            url: `${dragonBallStubUrl}/health`,
            env: { DRAGON_BALL_STUB_PORT: String(dragonBallStubPort) },
            reuseExistingServer: !process.env.CI,
            timeout: 30_000,
          },
        ]
      : []),
    {
      command: 'npm run dev -w apps/backend',
      url: `${process.env.API_BASE_URL || 'http://127.0.0.1:4000'}/api/health`,
      env: useDragonBallStub ? { DRAGON_BALL_API_BASE_URL: dragonBallStubUrl } : {},
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -w apps/frontend -- --host 127.0.0.1 --port 4173',
      url: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'ui',
      testMatch: /.*\.ui\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: `${process.env.API_BASE_URL || 'http://127.0.0.1:4000'}/api/`,
      },
    },
    {
      name: 'db',
      testMatch: /.*\.db\.spec\.ts/,
    },
  ],
});
