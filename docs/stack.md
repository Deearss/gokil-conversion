# Tech Stack & Why

This application (`gokil-conversion`) is built as a Frontend MVP, focusing on browser-side data processing without a backend.

## Stack 

1. **Framework**: Next.js (App Router, TypeScript)
    - *Why*: Strict modern standard, optimal file-based routing.
2. **Styling**: Tailwind CSS v4 + `clsx` + `tailwind-merge`
    - *Why*: Rapid UI iteration, standard utility convention, `clsx` manages responsive breakpoints clearly.
3. **State Management**: Zustand (+ persist middleware)
    - *Why*: Stores simple history and user settings strictly on the client (localStorage). Doesn't store base64 files to avoid quota limits.
4. **Icons & Animations**: `lucide-react`, `react-icons`, `motion` (Framer Motion)
    - *Why*: Premium feel, fluid micro-interactions, robust iconography.
5. **Logic**: HTML5 Canvas
    - *Why*: Allows client-side conversion of `.png` to `.jpg` natively without backend infrastructure.
