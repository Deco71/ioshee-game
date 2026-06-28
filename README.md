# ioshee-game

`ioshee-game` is a React + TypeScript + Vite game prototype built around a falling-objects board loop. The current implementation includes a single-player mode and a multiplayer flow that is still in progress.

## What it does

- Renders the game board on an HTML canvas.
- Preloads game assets before the play screen is shown.
- Supports single-player play locally.
- Connects to a game room for multiplayer, with the multiplayer experience still marked as work in progress.

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Available scripts

- `npm run dev` starts the Vite development server.
- `npm run buildDev` runs the TypeScript build and then produces a production bundle.
- `npm run lint` runs ESLint across the project.
- `npm run preview` serves the production build locally.

## Project notes

- The game is rendered in `src/CanvasWrapper.tsx` and driven by the engine in `src/gameEngine/GameEngine.ts`.
- Room connection and socket handling live under `src/socket/`.
- Multiplayer is still WIP, so connection and gameplay behavior may change as the feature is completed.

## Tech stack

- React 19
- TypeScript
- Vite
- Sass Embedded for styling support
