# elvora.my

A clean Next.js App Router starter for elvora.my, built with React, TypeScript and Tailwind CSS.

## Getting started

Use Node.js 22.18 or newer in the 22.x series, or Node.js 24.11 or newer. Install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The homepage is in `src/app/page.tsx`, and global styles are in `src/app/globals.css`.

## Checks and production

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

The app can be deployed as a standard Next.js project, including on Vercel. Direct dependencies are pinned to exact versions; `package-lock.json` locks the full dependency tree. ESLint uses the Next.js plugin and Babel's TypeScript/JSX parser, alongside ESLint's recommended rules.
