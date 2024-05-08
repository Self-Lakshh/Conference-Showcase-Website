# Developer Journal — Week 01 (Feb 2024)

## Goals
- Scaffolding the React + Vite + TypeScript repository.
- Configuring PostCSS and TailwindCSS with custom design parameters.
- Drafting the database schemas.

## Decisions & Architecture
- **Dual-Mode Adapter**: Decided to write a database adapter that checks for Firebase environment variables. If missing, it uses LocalStorage. This is key to ensuring that the workspace compiles and runs out of the box for reviewers without forcing them to set up a personal Firebase project first.
- **Color Identity**: Rejected Tailwind defaults. Defined custom brand coordinates for deep navy (`#0B0F19`), neon cyan (`#00E5FF`), violet (`#8A2BE2`), and emerald (`#00FA9A`).

## Problems Faced & Solutions
- *Problem*: Vite's standard setup creates basic index templates.
- *Solution*: Reorganized root structure, removed legacy HTML links, and redirected module loads to `/src/main.tsx`.

## Future Plans
- Develop a procedural data seeder to create over 1000 interconnected academic assets.
