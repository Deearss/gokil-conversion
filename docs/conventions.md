# Conventions

- **Next.js**: Use App Router (`app/`). Server components by default, use `"use client"` only when hook or browser APIs (like Canvas) are needed.
- **Styling**: Tailwind CSS with `clsx` and `tailwind-merge` in `cn` utility.
- **Responsiveness**: Always construct classes splitting responsive bounds for `clsx`:
  ```tsx
  className={clsx(
    "flex flex-col gap-4 p-6", // desktop
    "max-sm:flex-col max-sm:p-3" // mobile
  )}
  ```
- **State**: Zustand for global metadata, local React state (`useState`) for transient file blobs in view.
- **Comments**: Only comment non-obvious logic. No comments on self-explanatory codes.
