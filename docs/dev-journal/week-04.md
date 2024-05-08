# Developer Journal — Week 04 (May 2024)

## Goals
- Build the researcher community dashboard.
- Create the Admin Control CRUD Panel.
- Validate viewport grids and compile the build.

## Decisions & Architecture
- **Stateful CRUD**: Connected forms in the Admin panel to the Zustand actions. When an admin registers a conference or indexes a paper, it writes to LocalStorage. Navigating back to the Explorer immediately renders the updated list.
- **confetti triggers**: Used canvas-confetti upon newsletter subscription and conference ticket registration to add premium micro-interactions.

## Problems Faced & Solutions
- *Problem*: Creating forms for 4 separate collection types was highly repetitive.
- *Solution*: Designed a tabbed workspace in the Admin panel with structured context layouts, reusing classes and form elements.
