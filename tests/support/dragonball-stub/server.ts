// Stub determinista de https://dragonball-api.com/api para la suite.
//
// El backend lee la URL de DRAGON_BALL_API_BASE_URL; playwright.config.ts
// la apunta acá salvo que DRAGON_BALL_API_MODE=live. Así los tests no dependen
// de la disponibilidad ni de los datos de un servicio de terceros.
//
// Imita solo lo que consume apps/backend/src/services/dragonBallService.ts:
//   GET /api/characters?name=&race=  -> array filtrado (como la API real con filtros)
//   GET /api/characters              -> respuesta paginada { items, meta, links }
//   GET /api/characters/:id          -> personaje o 404
import { readFileSync } from 'node:fs';
import { createServer, type ServerResponse } from 'node:http';
import path from 'node:path';

interface FixtureCharacter {
  id: number;
  name: string;
  race: string;
  [key: string]: unknown;
}

const characters = JSON.parse(readFileSync(path.join(__dirname, 'characters.json'), 'utf8')) as FixtureCharacter[];
const port = Number(process.env.DRAGON_BALL_STUB_PORT || 4010);

function send(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

function withoutDetail({ originPlanet: _originPlanet, transformations: _transformations, ...summary }: FixtureCharacter) {
  return summary;
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://127.0.0.1:${port}`);

  if (request.method !== 'GET') {
    send(response, 405, { message: 'Method not allowed' });
    return;
  }

  if (url.pathname === '/api/health') {
    send(response, 200, { status: 'ok', service: 'dragonball-api-stub' });
    return;
  }

  if (url.pathname === '/api/characters') {
    const name = url.searchParams.get('name')?.toLowerCase();
    const race = url.searchParams.get('race')?.toLowerCase();

    if (!name && !race) {
      send(response, 200, {
        items: characters.map(withoutDetail),
        meta: { totalItems: characters.length, itemCount: characters.length, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
        links: {},
      });
      return;
    }

    const matches = characters.filter(
      (character) =>
        (!name || character.name.toLowerCase().includes(name)) &&
        (!race || character.race.toLowerCase() === race)
    );
    send(response, 200, matches.map(withoutDetail));
    return;
  }

  const detail = url.pathname.match(/^\/api\/characters\/(\d+)$/);
  if (detail) {
    const character = characters.find((item) => item.id === Number(detail[1]));
    if (character) {
      send(response, 200, character);
    } else {
      send(response, 404, { message: 'Character not found', error: 'Not Found', statusCode: 404 });
    }
    return;
  }

  send(response, 404, { message: 'Not found' });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Dragon Ball API stub listening on http://127.0.0.1:${port}/api`);
});
