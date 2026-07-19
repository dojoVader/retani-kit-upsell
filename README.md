# Retani Kit Upsell

An embedded Shopify app for building post-add-to-cart and cart-drawer upsell rules — bundles, thresholds, product upsells, tags/segments, "returning customer" offers, and countdown timers — with a configurable free-shipping bar and drawer design.

## Architecture

The app is split into two Shopify "web" processes (see `shopify.app.toml`), run together by the Shopify CLI:

| Process | Role | Location | Stack |
|---|---|---|---|
| `React Router` | `frontend` — embedded admin UI | [`/app`](./app) | React Router v7, Polaris/App Bridge, Tailwind CSS v4, Vite |
| `web` | `backend` — API service | [`/web`](./web) | NestJS 11, TypeORM, PostgreSQL, Redis |

```
                ┌────────────────────┐        ┌─────────────────────┐
Merchant  ───▶  │ React Router (app) │  ───▶  │ NestJS API (web)    │  ───▶  PostgreSQL
  Admin         │ Shopify auth,      │        │ Shopify auth,       │        Redis (cache /
                │ Polaris UI, routes │        │ upsell rule engine, │        sessions)
                └────────────────────┘        └─────────────────────┘
```

- `/app` handles embedded-admin auth/session via `@shopify/shopify-app-react-router`, using Prisma + SQLite to persist Shopify sessions.
- `/web` is a separate NestJS backend (auth via `@nestjs-shopify/*`, TypeORM entities, Redis-backed session storage/cache) that owns the upsell rule data model and business logic.
- `old_nest/` is a superseded/legacy backend kept for reference and is not part of the active build.

## Domain model

Upsell behavior is defined by `UpsellRule` records (see `web/src/entities/upsell-rule.entity.ts`), each with a `type` and a JSON `config` validated against that type:

- **Threshold** — spend-based upsell (e.g. "spend $50, get X")
- **Product** — direct product upsell/cross-sell
- **Bundle** — bundled product offers
- **Tag / Segment** — customer-tag or segment targeted offers
- **Returning** — offers for returning customers
- **Timer** — countdown/last-chance offers

Each rule type has a corresponding admin form component in [`app/rules`](./app/rules) (e.g. `ThreshRule.tsx`, `ProductRule.tsx`, `BundleRule.tsx`, `TagRule.tsx`, `ReturningRule.tsx`, `TimerRule.tsx`) and cart-facing preview component in [`app/rules/cart-type`](./app/rules/cart-type).

Design references and mockups live in [`/ui`](./ui).

## Prerequisites

- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli/getting-started)
- Node.js `>=20.19 <22` or `>=22.12`
- PostgreSQL (for the NestJS backend)
- Redis (for backend sessions/cache)

## Setup

```shell
npm install
cd web && yarn install
```

Environment variables are split between the two processes:

**Root `.env`** (React Router frontend)
```
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_APP_URL=
SCOPES=
FRONTEND_PORT=
```

**`web/.env`** (NestJS backend)
```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_APP_URL=
SCOPES=
SHOP_CUSTOM_DOMAIN=
FRONTEND_PORT=
HOST=
```

## Local development

```shell
shopify app dev
```

This starts both web processes per `shopify.web.toml` (`predev`/`dev` commands run Prisma migrations and `react-router dev` for the frontend; `web/shopify.web.toml` runs `npm run start:dev` for the NestJS backend), logs into your Partner account, connects the app, and opens a tunnel. Press `P` to open the app URL and install it on your dev store.

### Running the pieces individually

```shell
# React Router frontend
npm run dev

# NestJS backend
cd web && npm run start:dev
```

## Database

- **Frontend (Prisma/SQLite)** — stores Shopify sessions for the React Router app.
  ```shell
  npx prisma migrate deploy
  npx prisma generate
  ```
- **Backend (TypeORM/PostgreSQL)** — stores upsell rules, products, attribution, and rule events. Schema is currently synchronized automatically in development (`synchronize: true` in `web/src/app.module.ts`); use a proper migration strategy before running against production data.

## Scripts

**Root** (`package.json`)
| Script | Description |
|---|---|
| `npm run dev` | Alias for `shopify app dev` |
| `npm run build` | `react-router build` |
| `npm start` | Serve the built app (`react-router-serve`) |
| `npm run setup` | `prisma generate && prisma migrate deploy` |
| `npm run typecheck` | React Router typegen + `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run deploy` | `shopify app deploy` |

**`web/`** (`web/package.json`)
| Script | Description |
|---|---|
| `npm run start:dev` | Start NestJS in watch mode |
| `npm run build` | `nest build` |
| `npm run test` / `test:e2e` / `test:cov` | Jest unit / e2e / coverage |
| `npm run lint` | ESLint (`--fix`) |
| `npm run format` | Prettier |

## Deployment

```shell
shopify app deploy
```

Build and run the frontend in a container via the included [`Dockerfile`](./Dockerfile) (`npm run docker-start` runs Prisma setup then starts the server). The NestJS backend under `/web` is deployed/hosted separately and requires its own PostgreSQL and Redis connections in production.

## Tech stack

- **Frontend:** React Router v7, React 18, Shopify App Bridge / Polaris web components, Tailwind CSS v4, Vite
- **Backend:** NestJS 11, TypeORM, PostgreSQL, Redis (`@keyv/redis`, `cache-manager`), `@nestjs-shopify/*`
- **Auth & sessions:** `@shopify/shopify-app-react-router` (frontend), `@nestjs-shopify/auth` + custom Redis session storage (backend), Prisma/SQLite session storage (frontend)
- **Tooling:** Shopify CLI, TypeScript, ESLint, Prettier, Jest