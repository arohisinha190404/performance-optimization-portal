# Prompt Traceability Log

This file records the prompt sequence used to guide the AI-assisted implementation. The workflow follows test-first development: acceptance tests are specified before the application implementation.

## Prompt 1 — Test suite first (TDD)

> Act as a senior frontend test engineer. Do not write the application implementation yet. Create a Vitest + React Testing Library test suite for a Performance Optimization portal. Cover: clear primary workspace; helpful “No data found” empty state for unmatched search; visible loading indicator during async operations; invalid form submission blocked with offending fields marked aria-invalid and inline errors; valid initiative creation; XSS payload stripped from user text before display; analytics console ping after a completed primary action; and accessible names for interactive controls. Configure Vitest with jsdom and jest-dom. Tests should fail until the implementation is added.

## Prompt 2 — Implement to satisfy tests

> Now implement the React application that passes the test suite. Build a polished, responsive, monochromatic corporate Performance Optimization dashboard. Include summary metrics, initiative list, search and category filter, create initiative form, status labels, empty state, and asynchronous run/create actions. Show a visual loading indicator during async work. Validate required text fields and non-negative numeric baseline/target values; prevent invalid submission and show inline errors with aria-invalid. Sanitize every user text value with DOMPurify before storing it in React state. Log `[Analytics] User interacted with Performance Optimization: ...` after successful primary actions. Use useMemo for derived calculations and useCallback for stable handlers. Use semantic HTML, accessible labels, keyboard focus styles, and responsive layouts. Do not hardcode secrets or real personal data.

## Prompt 3 — Accessibility and edge-case review

> Review the implementation against the acceptance criteria and non-functional requirements. Ensure all controls have accessible names, form errors are programmatically associated with fields, loading is announced through a status region, and the empty state is helpful. Keep the monochromatic design system and consistent spacing. Avoid unnecessary dependencies and remove unused imports.

## Prompt 4 — Final quality gate

> Run the test suite, lint, and production build. Fix any failures without weakening or deleting acceptance tests. Confirm that the README explains local setup and deployment, and that this PROMPTS.md file remains in the repository root. Do not add real API keys or sensitive PII.

## Manual verification checklist

1. Run `npm install`, then `npm test`, `npm run lint`, and `npm run build`.
2. Run `npm run dev` and open the Vite preview.
3. Search for a phrase that cannot match; verify the empty state and clear-filters action.
4. Submit the create form empty; verify submission is blocked and required fields show errors.
5. Enter a markup payload in a text field; verify it is stripped to plain text.
6. Create an initiative and run an optimization; verify loading indicators and success feedback.
7. Use Tab / Shift+Tab / Enter to navigate and activate controls.
8. Inspect the browser console for the simulated analytics ping after a successful action.
