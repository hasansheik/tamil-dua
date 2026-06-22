# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tamil Dua** is an Ionic + Angular + Capacitor mobile app for Android that presents Islamic duas in Tamil. It uses an iOS visual style (`mode: 'ios'` in AppModule) despite targeting Android.

## Commands

```bash
npm start          # Dev server (ng serve)
npm run build      # Production build (outputs to /www)
npm run lint       # ESLint (Angular rules)
npm run test       # Unit tests (Karma + Jasmine)
ng build           # Build (alias)
```

To sync to Android after a web build:
```bash
npx cap sync android
npx cap open android   # Opens Android Studio
```

## Architecture

### Navigation & Routing
Lazy-loaded Angular modules with a split-pane layout. The sidebar menu (defined in `app.component.html`) lists all chapters plus Home, Favorites, Settings, and Prayer Acceptance guide pages. Custom iOS-style page transitions are in `src/app/shared/animations/page-transition.ts`.

### Key Pages
- `home/` — Dashboard with greeting, daily dua count, chapter grid, search bar
- `folder/` — Main dua viewer; receives a chapter ID via route param, renders `dua-list-modal`
- `favorites/` — Favorited duas with reader mode, share, and copy
- `settings/` — Font size, theme accent, visibility toggles (transliteration, translation), backup/restore
- `prayer-acceptance/` — Static guide content (4 sub-pages: preface, optimal times, purity, corrections)

### Services (`src/app/shared/service/`)
- **`dua.service.ts`** — Loads `Dua-Full.json`, caches with 24-hour TTL via Capacitor Preferences, provides search/filtering. This is the primary data source.
- **`setting.service.ts`** — User preferences (font size, theme accent, visibility flags) via Capacitor Preferences. Exposes `BehaviorSubject` observables that pages subscribe to for live updates.
- **`storage.service.ts`** — Thin wrapper over `@capacitor/preferences`.
- **`network.service.ts`** — Monitors connectivity; triggers dua data refresh on reconnection.

### Shared Component
`src/app/components/dua-list-modal/` — The single component that renders any list of duas. Used by both `folder/` and `favorites/`. Handles reader mode, copy, share, and haptic feedback.

### Data
All dua content lives in `src/assets/data/`. The primary file is `Dua-Full.json` (full database). Supporting files: `BookPreface.json`, `PrayerAcceptance.json`, `Corrections.json`.

### Theme System
CSS custom properties in `src/theme/variables.scss`. Six dynamic accent themes (Gold, Emerald, Crimson, Sapphire, Rose Gold, Amethyst) applied by adding a class to `document.body`. Glassmorphism effects use `backdrop-filter`. Dark mode toggles via `prefers-color-scheme` and a manual override stored in settings.

### Localization
No i18n library. All Tamil strings are hardcoded. UI language is Tamil with English fallbacks in code comments.

### Persistence
Capacitor Preferences API is used for everything: cached dua data, favorites (Base64-encoded backup/restore), last-visited pages, and all settings. There is no remote backend.
