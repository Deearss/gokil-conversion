# Architecture Overview

## Directories
- `/src/app` - Next.js App Router (entry points and layouts)
- `/src/components` - UI Components (reusable and feature-specific)
- `/src/lib` - Utility functions (e.g. `utils.ts` for styling, `converter.ts` for HTML5 Canvas logical operations)
- `/src/store` - Zustand stores for client state management
- `/public` - Static assets

## Data Flow
- User uploads image (held in memory state).
- Canvas utility receives image blob, processes on invisible Canvas, returns `.jpg` blob.
- Result is kept in memory.
- Zustand store tracks conversion metadata (filename, success status) not the actual image blob.
