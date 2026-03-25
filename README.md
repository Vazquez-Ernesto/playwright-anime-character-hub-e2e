# anime-character-hub-e2e

Portfolio full stack orientado a demostrar QA Automation moderna de punta a punta sobre un dominio reconocible: Dragon Ball.

La arquitectura evita que el frontend consuma servicios externos de forma directa. El flujo real queda así:

`React frontend -> Express backend -> Dragon Ball external API`

Además, el backend persiste trazabilidad y estado en PostgreSQL para cubrir automatización UI, API y DB con el mismo sistema bajo prueba.

## Qué demuestra

- frontend propio en React + TypeScript
- backend propio en Express + TypeScript
- PostgreSQL para favoritos, historial y cache
- integración con una API externa real de Dragon Ball
- tests Playwright de UI, API y base de datos

## Arquitectura

```text
.
|-- apps/
|   |-- backend/
|   `-- frontend/
|-- tests/
|   |-- api/
|   |-- db/
|   |-- support/
|   `-- ui/
|-- docker-compose.yml
|-- playwright.config.ts
`-- .env.example
```

## Casos de uso implementados

- búsqueda de personajes por nombre
- detalle de personaje
- guardar favoritos
- listar favoritos
- eliminar favoritos
- registrar historial de búsquedas
- cachear respuestas externas por búsqueda y por detalle

## Modelo de datos

- `favorites`: snapshot mínimo del personaje favorito
- `search_history`: término buscado, cantidad de resultados y origen (`external` o `cache`)
- `api_cache`: cache key, payload JSON, estado HTTP y expiración

## Endpoints backend

```text
GET    /api/health
GET    /api/characters?name=
GET    /api/characters/:id
GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:id
GET    /api/search-history
```

## Inicio rápido

1. Copiar variables:

```bash
cp .env.example .env
```

2. Instalar dependencias:

```bash
npm install
npx playwright install chromium
```

3. Levantar PostgreSQL:

```bash
npm run db:up
```

Si no querés Docker, podés usar cualquier PostgreSQL local apuntando `DATABASE_URL` o las variables `DB_*`.

4. Levantar frontend y backend:

```bash
npm run dev
```

5. Ejecutar tests:

```bash
npm test
```

## Scripts principales

```bash
npm run dev
npm run dev:backend
npm run dev:frontend
npm run build
npm run db:up
npm run db:down
npm run test
npm run test:ui
npm run test:api
npm run test:db
```

## Variables de entorno

Las variables están centralizadas en la raíz para facilitar desarrollo local, Playwright y futura integración CI.

```bash
NODE_ENV=development
PORT=4000
FRONTEND_PORT=4173
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173
API_BASE_URL=http://127.0.0.1:4000
VITE_API_URL=http://127.0.0.1:4000/api
DRAGON_BALL_API_BASE_URL=https://dragonball-api.com/api
CACHE_TTL_SECONDS=3600
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/anime_character_hub
```

## Testing

La suite Playwright cubre tres niveles:

- UI: flujo de búsqueda, navegación a detalle y gestión de favoritos
- API: salud, búsqueda y CRUD básico de favoritos
- DB: validación directa de persistencia de favoritos, historial y cache

## CI

El repositorio incluye un workflow base de GitHub Actions en `.github/workflows/ci.yml` que:

- levanta PostgreSQL como servicio
- instala dependencias y Chromium
- ejecuta `npm test`
- publica el reporte HTML de Playwright como artefacto

## Estado del proyecto

La base está preparada para evolucionar hacia:

- autenticación
- más dominios anime o The Simpsons
- CI/CD con GitHub Actions
- ambientes por branch
- observabilidad más profunda
