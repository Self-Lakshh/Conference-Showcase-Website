# Developer Journal — Week 03 (Mar 2024)

## Goals
- Build the interactive publication citation map.
- Develop the tabbed conference workspace dashboards.

## Decisions & Architecture
- **Interactive Graph**: Implemented a force-directed physical particle solver in a React simulation loop. Rendered nodes and links using SVG circles and lines, enabling physics-based attraction/repulsion. Clicking nodes exposes citation stubs.
- **Tabbed Workspaces**: Divided conference details into Overview, Schedule, Speakers, Papers, and Media downloads. This keeps the page visually clean while packing extensive features.

## Problems Faced & Solutions
- *Problem*: Re-rendering the SVG map in every physics frame caused high CPU usage.
- *Solution*: Limited the node count to 22 relevant papers and optimized state updates in the physics tick loop, resulting in a smooth 60fps render.
