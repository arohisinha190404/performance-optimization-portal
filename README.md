# Performance Optimization Portal

A responsive, monochromatic operations dashboard built with React + Vite. It includes initiative search/filtering, a validated create form, asynchronous loading states, empty states, simulated analytics, and XSS-safe text handling.

## Requirements

- Node.js 18.18+ (Node 20 LTS recommended)
- npm 9+

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Tests and quality checks

```bash
npm test
npm run lint
npm run build
```

## Deploy

Push the repository to GitHub, then import it into Vercel or Netlify. Use:
- Build command: `npm run build`
- Output directory: `dist`

No environment variables or API keys are required. All data and analytics are simulated locally.

## Acceptance criteria coverage

- Clear performance workspace and primary actions.
- Search/filter results show a friendly **No data found** state.
- Async create/run actions show a visible loading status.
- Required and numeric fields are validated; invalid fields expose `aria-invalid` and inline error text.
- Buttons and inputs have accessible names; semantic controls are keyboard operable.
- Successful primary actions emit `[Analytics] User interacted with Performance Optimization: ...`.
- Text inputs are sanitized with DOMPurify before entering component state.
- Derived lists/counts use `useMemo`; event handlers use `useCallback`.
- Vitest + Testing Library tests cover the acceptance criteria.
