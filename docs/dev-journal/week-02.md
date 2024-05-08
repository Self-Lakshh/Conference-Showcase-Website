# Developer Journal — Week 02 (Feb 2024)

## Goals
- Seed database to meet global launch minimum counts (50+ conferences, 120+ papers, etc.).
- Build a customized entrance animation loader to impress researchers.

## Decisions & Architecture
- **Procedural Seeding**: Wrote a dynamic loop generator in `src/db/seedData.ts`. It takes static base domains and universities, then uses combinations to generate a high volume of interconnected papers, speakers, and events.
- **Canvas Loader**: Implemented a pure canvas-based particle network loader. Connected nodes fade lines dynamically based on distance, and it simulates a loading bar that automatically wakes the application router once completed.

## Problems Faced & Solutions
- *Problem*: Storing 500+ Unsplash image objects statically bloated code bundle.
- *Solution*: Wrote a helper function to generate Unsplash and randomuser URLs using clean indexing formulas, keeping the code under 15KB while serving premium, diverse images.
