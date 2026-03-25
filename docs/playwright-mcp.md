# Playwright MCP

Esta guía deja preparado el camino para usar Playwright MCP con este proyecto desde Codex u otro cliente MCP.

## Cuándo conviene usar MCP acá

Para este repo, Playwright MCP sirve especialmente para:

- exploración asistida del frontend en navegador real
- inspección iterativa de estados UI sin escribir código primero
- flujos de debugging donde querés mantener contexto persistente del browser

Para ejecución de tests automatizados del proyecto, la suite Playwright normal del repo sigue siendo el camino principal.

## Requisitos

- Node.js 18 o superior
- `npx` disponible
- backend y frontend del proyecto levantados localmente

## Levantar la app del proyecto

```bash
cd ~/playwright-ts-demo
npm run dev
```

Si preferís levantar cada parte por separado:

```bash
cd ~/playwright-ts-demo
npm run dev:backend
npm run dev:frontend
```

Puertos esperados:

- frontend: `http://127.0.0.1:4173` o `http://127.0.0.1:4174`
- backend: `http://127.0.0.1:4000`

## Alta rápida en Codex

Según la documentación oficial de `microsoft/playwright-mcp`, para Codex podés registrar el servidor así:

```bash
codex mcp add playwright npx "@playwright/mcp@latest"
```

## Configuración manual en Codex

Alternativamente, podés editar `~/.codex/config.toml` y agregar:

```toml
[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
```

## Configuración recomendada para este repo

Si querés restringir el uso a tus hosts locales de desarrollo, una variante razonable es:

```toml
[mcp_servers.playwright]
command = "npx"
args = [
  "@playwright/mcp@latest",
  "--isolated",
  "--allowed-hosts", "127.0.0.1,localhost",
  "--allowed-origins", "http://127.0.0.1:4173;http://127.0.0.1:4174;http://localhost:4173;http://localhost:4174"
]
```

Notas:

- `--isolated` evita reutilizar perfil persistente entre sesiones.
- `--allowed-hosts` limita navegación a hosts locales.
- `--allowed-origins` es útil para este frontend local con más de un puerto de desarrollo.

## Modo headless opcional

Si querés correrlo sin abrir ventana de navegador:

```toml
[mcp_servers.playwright]
command = "npx"
args = [
  "@playwright/mcp@latest",
  "--isolated",
  "--headless",
  "--allowed-hosts", "127.0.0.1,localhost",
  "--allowed-origins", "http://127.0.0.1:4173;http://127.0.0.1:4174;http://localhost:4173;http://localhost:4174"
]
```

## Uso recomendado con este proyecto

Una vez levantada la app y registrado el MCP:

1. Abrí el frontend local.
2. Navegá al buscador principal.
3. Validá búsqueda, detalle, favoritos e historial.
4. Usá MCP para explorar regresiones de UX antes de escribir o ajustar tests.

## Qué dejaría para una segunda etapa

- agregar un script de arranque dedicado para sesiones MCP
- preparar un entorno de datos más determinista para exploración manual
- documentar prompts o rutinas estándar para debugging asistido
