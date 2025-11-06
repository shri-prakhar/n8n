# n8n (monorepo) — Detailed developer README

This repository contains a compact implementation of a workflow automation platform inspired by n8n. It provides a visual workflow editor (frontend), an Express API (backend), and a shared Prisma-based database package. The goal of this README is to document what the project does, the concrete frontend and backend technologies used, how the pieces interact, and how you (or other contributors) should run and extend the project.

Contents of this README

- About the project — what the app does and workflow concepts
- Architecture & project layout — packages and apps
- Frontend: detailed stack and React Flow usage (nodes, edges, custom nodes)
- Backend & persistence: Express, Prisma, MongoDB, queues
- Observability and realtime: WebSocket usage
- Local setup and reproducible dev environment
- Environment variables and important runtime settings
- Troubleshooting & common errors
- Suggested improvements and best practices for contributors

## About the project — what n8n does here

This project implements a visual workflow automation studio where users can:

- Create workflows composed of nodes and connections (edges). A workflow typically starts with a trigger node (webhook/manual) and connects to processing nodes such as AI agents, email senders, or custom tools.
- Configure node inputs and credentials using forms displayed when nodes are opened/double-clicked.
- Persist workflows (nodes & connections) using a backend API and a MongoDB-backed Prisma ORM package.
- Execute workflows — nodes can run (status updates flow back to the UI via WebSocket) and results are shown inline next to nodes.

Key concepts used in the codebase:
- Workflow: a persisted collection of nodes, edges (connections), viewport and UI state.
- Node: a single processing unit (Webhook, Email, AI Agent, Tool).
- Edge: a connection from a source node to a target node (may carry handle ids to identify ports).
- Trigger: a node that starts a workflow run (webhook, manual trigger, etc.).

Example user flow (UI):
1. Create a new workflow and add a Webhook trigger node.
2. Add an AI Agent node connected to the webhook node.
3. Configure credentials and node-specific settings in the right-hand panel.
4. Save the workflow. The front-end sends nodes, connections, viewport, and UI state to the Express API which persists using Prisma.
5. Execute the workflow (via the execute button or when the webhook receives a request). The backend runs nodes, emits progress to a WebSocket channel, and the frontend updates node statuses in real time.

## Architecture & project layout

Top-level layout (important folders):

- `apps/`
  - `web/` — Next.js frontend (React, app dir). Contains the visual editor, pages, components, and client state.
  - `express/` — Express API (TypeScript). Handles auth, workflow CRUD, execution orchestration, and WebSocket server.
  - `docs/` — Documentation site (Next.js)
- `packages/`
  - `db/` — Prisma schema + DB client wrapper (MongoDB datasource)
  - `ui/` — shared UI primitives / components for internal usage
  - `eslint-config/`, `typescript-config/` — shareable configs used across the monorepo

Top-level tooling
- pnpm workspaces (fast installs) + Turbo (task runner/caching)
- TypeScript for type safety across apps and packages

## Frontend — detailed tech stack and React Flow usage

Location: `apps/web`

Main libraries used by the frontend:
- Next.js (App Router) — server + client routing and SSR where needed
- React 19 — the UI library
- @xyflow/react / react-flow-renderer — visual node editor (React Flow core) — the project uses React Flow to render nodes, edges, mini-map, background and controls
- Tailwind CSS — styling utilities (Tailwind config found in `apps/web`)
- Zustand — lightweight client state management used for small, isolated global stores (save button state, node forms, credentials, node outputs). Stores live under `apps/web/components/globalstateVaribles`.
- axios — API calls to the Express backend
- WebSocket API (browser WebSocket) — for realtime node execution updates from the server (see `apps/web/lib/useWebsocket.ts`)
- framer-motion, lucide-react, react-icons — UI polish and icons

React Flow specifics (what the code does and how nodes are implemented):
- The main visual editor is implemented in `apps/web/components/canvasWorkspace.tsx`.
  - React Flow components used: <ReactFlow>, <Background>, <MiniMap>, <Controls>, custom node types and default edge options.
  - Node types are registered via `nodeTypes` and map to React components in `apps/web/components/nodes/*`.
  - Custom nodes (examples): `WebhookNode`, `EmailNode`, `AIAgentNode`, `ManualTriggerNode`, `ToolNode`. See `apps/web/components/nodes/customnodes.tsx` for implementations — each node uses React Flow `Handle`s to declare target/source ports and custom SVG handles for better UX.
  - The editor implements helpers to: rehydrate nodes from the server, normalize edges, keep UI state (active node, right panel open, viewport), and persist workflows via the API.
  - Node forms and schemas: node input schemas live under `apps/web/components/globalstateVaribles/nodeformschemas` and forms are rendered via `NodeConfigForm` to edit node-specific data.
  - Node execution status integration: the UI shows node status and border color changes based on outputs received via WebSocket (see `useWebsocket` and `useNodeOutputstore` Zustand store).

State management
- Zustand stores are used for small, focused global state: save button state, node forms, credentials options, node outputs and tool panel state. These stores are in `apps/web/components/globalstateVaribles/Reactflow.ts/ReactflowVariables.ts` and are intentionally small to avoid over-architecting.

Developer notes on React Flow usage
- Node IDs follow a predictable `${type}-${timestamp}` pattern. Edges created use either provided ids or a generated id `e-source-target-index`.
- Custom handles: the app uses named handles (e.g., `${nodeId}-out`, `tool-target`, and bottom handles for tools) to support multiple ports per node.
- UI uses `reactFlowInstance.toObject()` for saving viewport and node states to the server.

## Backend & persistence

Location: `apps/express` and `packages/db`

Key technologies:
- Express (TypeScript) — API routes are in `apps/express/src/` (auth, workflows, credentials, etc.)
- Prisma (MongoDB) — models defined in `packages/db/prisma/schema.prisma`. Prisma is used as the DB client and requires `prisma generate` to build the generated client code.
- JSON Web Tokens (`jsonwebtoken`) — authentication tokens for the API are used (see `apps/express/src/jwt.ts`).
- BullMQ + ioredis — background queue and worker patterns (present in dependencies) if workflows are executed in background jobs.

Persistence model highlights (from `schema.prisma` in `packages/db`):
- `Users` — stores user info and relations to credentials and workflows.
- `Credentials` — encrypted or JSON-stored credentials linked to users.
- `Workflows` — stores nodes, connections, UI state and an owner (userId).
- `WorkflowExecutions` & `NodeExecutions` — capture execution runs and node-level results/logs.

Important: Because the Prisma generator outputs a runtime client that the code imports, you must run `prisma generate` after `pnpm install` or after schema changes. See setup section below.

## Observability & realtime

- The frontend opens a WebSocket to `ws://localhost:8081` (see `apps/web/lib/useWebsocket.ts`) and subscribes to workflow execution updates; the backend emits node execution progress to subscribed clients so the editor shows live status updates.
- Console logs and Node stack traces are primary debugging points for now; consider adding application logging and structured logs if you plan to operate this in production.

## Local setup (detailed)

Prerequisites
- Node.js 18.x or later (use nvm / nvm-windows to manage versions)
- pnpm v9.x installed globally (recommended)
- A MongoDB instance reachable at `DATABASE_URL` (local Docker or cloud)
- Optional: Redis for BullMQ background queues

Quick start commands (root):

```pwsh
# install workspace deps
pnpm install

# generate Prisma client for the db package
pnpm --filter @repo/db exec prisma generate

# start all apps (turbo will run per-package dev scripts)
pnpm dev

# or run apps individually (recommended for debugging)
# in terminal 1 (db package)
cd packages/db
pnpm run dev

# in terminal 2 (express server)
cd apps/express
pnpm run dev

# in terminal 3 (frontend)
cd apps/web
pnpm dev
```

Notes about automation
- A `predev` script in the root `package.json` will run the Prisma generate step before `pnpm dev` to reduce the chance of missing generated client errors. `postinstall` also runs a filtered `prisma generate` for convenience.

## Environment variables (create a `.env` in repo root or in packages/db)

Required / common variables (see `env.example`):
- DATABASE_URL — MongoDB connection string, e.g. `mongodb://localhost:27017/n8n`
- JWT_SECRET — secret string used for signing JWTs
- PORT — API port (optional)
- REDIS_URL — redis connection if using BullMQ queues
- SMTP_* — optional SMTP settings used by nodemailer

Keep secrets out of version control; add a sanitized `env.example` (already added) for contributors to copy.

## Troubleshooting & common errors

- Error: `@prisma/client did not initialize yet` — run `pnpm --filter @repo/db exec prisma generate` in the repository root or `cd packages/db && pnpm prisma generate`.
- If a Next.js page fails with SSR warnings for React Flow: React Flow requires specific client-side handling; ensure imports of React Flow and its CSS are only used in client components (this project uses `"use client"` in `canvasWorkspace.tsx`).
- If sockets don't connect, confirm the backend WebSocket server is running and the URL in `apps/web/lib/useWebsocket.ts` matches (default `ws://localhost:8081`).

## Recommended improvements (short-term)

- Add strong automated checks: `pnpm lint`, `pnpm test` (if tests added), and `pnpm run check-types` to CI.
- Centralize env configuration with a `.env.example` and document security practices for credentials.
- Add a lightweight integration test that spins up the API and runs a simple workflow execution to assert end-to-end wiring.
- Move WebSocket URL to an env var and support fallback/reconnect logic in `useWebsocket`.

## How to contribute

1. Create an issue describing the change or bug.
2. Fork, create a branch, run `pnpm install` and `pnpm --filter @repo/db exec prisma generate`.
3. Implement minimal changes, run `pnpm lint` and `pnpm run check-types` locally.
4. Open a PR and include how to test the change locally.

---

If you'd like, I will:
- Add a short `CONTRIBUTING.md` and add the WebSocket URL to env variables.
- Create a small automated smoke test that starts `packages/db` and `apps/express` and asserts the API health endpoint.

Tell me which follow-up you prefer and I'll implement it next.


This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
