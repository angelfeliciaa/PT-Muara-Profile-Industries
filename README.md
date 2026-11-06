# MPI Muara Profile Industries marketing site

Pastel cyan single page marketing site with a WebGL hero (Three.js procedural gradient plus floating glossy 3D polymer pellets), built with React, TypeScript, Vite and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deploy to GitHub

```bash
git init
git add .
git commit -m "MPI marketing site"
git branch -M main
git remote add origin https://github.com/<your-user>/mpi-site.git
git push -u origin main
```

## Deploy to Vercel

Import the GitHub repository at vercel.com. The included `vercel.json` sets the Vite framework, build command and `dist` output directory, so no extra configuration is needed. Vercel will build and serve the site automatically on every push to `main`.
