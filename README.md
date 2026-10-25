# Faizan Shah · Portfolio

A futuristic portfolio for Faizan Shah (software development, AI engineering and process automation) built with Next.js 15 (App Router) and TypeScript. No UI libraries; all styling is in `app/globals.css`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build for production

```bash
npm run build
npm start
```

## Edit content

Every piece of text, every project and every credential lives in `data/profile.ts`. Change it there and the whole site updates.

* **Photo**: `profile.photo` points to the photo on the old Wix site. To host it yourself, save it as `public/profile.jpg` and set `photo: "/profile.jpg"`.
* **Projects**: Reserve Bank work is in `rbfWork`, your own products in `ventures`, university work in `research`. Each card has a `plain` line for non technical readers, a `helps` line, and `tech` tags. Set `featured: true` for the wide banner card. In `rbfWork`, `kind` drives the filter buttons.
* **Status pills**: `Deployed` and `Live` show green, `In development` shows amber, `Completed` shows cyan.
* **Game facts**: edit `gameFacts` at the bottom of `data/profile.ts`.
* **Status console** in the hero reads from `console_` in `data/profile.ts`.

## Deploy

Push the folder to a GitHub repository and import it on Vercel. No environment variables are needed.

## Structure

```
app/
  layout.tsx      Fonts, metadata
  page.tsx        All sections
  globals.css     Design tokens and styles
components/
  Hero.tsx        Name, rotating roles, portrait, status console
  NeuralField.tsx Animated neural network behind the hero
  RoleCycler.tsx  Decoding role text
  WorkGrid.tsx    Project cards with optional filters
  Reveal.tsx      Fade in on scroll
  CopyField.tsx   Copy to clipboard contact cards
  ThemeToggle.tsx Light and dark mode switch (saved per visitor)
  DigitalCard.tsx Digital ID card: save to contacts (.vcf) or as an image
  SpaceDefender.tsx Arcade game that unlocks facts about me
data/
  profile.ts      Site content
public/
  favicon.svg
```
