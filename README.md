# Josin Joseph — Portfolio

A vintage editorial portfolio built around four interactive rooms: the Garage (projects), Studio (about), Workshop (skills), and Railway (experience and education), with a Post Office for contact.

## Stack

- React 18 and Vite
- React Router
- Three.js with React Three Fiber and Drei
- GSAP for scene and page animations
- Lucide icons

## Run locally

```sh
npm install
npm run dev
```

Create a local `.env` from `.env.example` and set the EmailJS values if you want the contact form to send messages. The site can still be browsed without those values.

## Production build

```sh
npm run build
npm run preview
```

The build writes static files to `dist/`. The app uses `BrowserRouter` and the `/` base path for the personal site repository `josin-joseph.github.io`. The GitHub Actions workflow builds and deploys the site to Pages and copies `index.html` to `404.html` so deep links can render on refresh. In the repository settings, set Pages' build and deployment source to **GitHub Actions**.

To enable the contact form in production, add `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` as repository Actions secrets. Until then, the page keeps its direct email link and marks the form as awaiting setup.

## Structure

- `src/pages/` — route pages
- `src/data/` — portfolio content
- `src/search/` — on-demand search index, scorer and overlay
- `src/three/` — 3D scenes and shared door canvas
- `public/` — portrait, resume and favicon assets

## Assets

The share card uses `public/portrait.jpg`. Replace it with a dedicated 1200×630 social preview image if you prepare one.
