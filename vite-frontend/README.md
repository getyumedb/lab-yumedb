# YumeDB Lab · Vite frontend

Vite 6 + React 19 + React Router + Tailwind CSS 4 prototype of the YumeDB frontend, reading live data from the public [Jikan API](https://jikan.moe).

![Home page with the hero slider of the season](screenshots/home.webp)

| Anime list | Anime detail |
|---|---|
| ![Anime list with covers, studios and airing status](screenshots/anime-list.webp) | ![Anime detail page with genres, year, episodes, score and synopsis](screenshots/anime-detail.webp) |

| Manga list | Airing schedule |
|---|---|
| ![Manga list with scores](screenshots/manga-list.webp) | ![Weekly airing schedule with day picker](screenshots/schedule.webp) |

<img src="screenshots/home-mobile.webp" alt="Home page on a phone" width="300">

The Jikan API was down when these were taken (November 2026), so the data comes from Internet Archive copies of its responses.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # type check
```

No environment variables or API keys are needed.

See the [main README](../README.md) for context.
