# Flipper Zero Firmware Hub

Piattaforma web didattica, in stile terminale/CRT, che raccoglie, cataloga e confronta firmware e repository per **Flipper Zero**.

Stack: **React 18 + Vite 5 + TypeScript + Tailwind CSS 3 + lucide-react**. È un sito 100% statico, senza backend.

## Struttura

```
.github/workflows/deploy.yml   build + deploy su GitHub Pages (push su main, cron giornaliero)
scripts/prefetch-github.mjs    genera public/github-cache.json in fase di build
src/
  data/
    types.ts                   tipi Entry, Feature, InstallMethod
    firmwares.ts               dati curati: firmware, app, script, risorse + matrice feature
    labs.ts                    esercitazioni della Lab Guide (da compilare)
  lib/
    github.ts                  client API GitHub: localStorage → snapshot → API live
    githubContext.tsx          provider React con stato di sync e refresh
    settings.tsx               toggle CRT / suoni (persistiti in localStorage)
    sound.ts, format.ts
  hooks/useHashRoute.ts        routing #/, #/compare, #/lab, #/repo/:id
  components/                  Header, FilterBar, FirmwareCard, DetailModal,
                               InstallationModal, CompareTable, LabGuide, Footer, ui
```

## Sviluppo locale

```bash
npm install
npm run dev          # http://localhost:5173
npm run build:full   # prefetch dati GitHub + build in dist/
```

## Dati GitHub e rate limit

Per ogni repository il client usa, in quest'ordine:

1. la cache in `localStorage` (valida 6 ore)
2. lo snapshot `github-cache.json` generato dalla Action con `GITHUB_TOKEN`
3. l'API pubblica (60 richieste/ora per IP)

Il pulsante ↻ nell'header svuota la cache e forza l'API live.

## Deploy su GitHub Pages

1. Crea la repository e fai push su `main`.
2. Vai in **Settings → Pages → Source: GitHub Actions**.
3. Il workflow calcola da solo `BASE_PATH=/<nome-repo>/`. Se usi un dominio custom, impostalo a `/`.

Il routing usa l'hash (`#/...`), quindi non serve alcun fallback 404.

## Migrazione a una repository privata

Il progetto non dipende da GitHub Pages: `npm run build:full` produce una cartella `dist/` statica.

| Destinazione | Build command | Output | Variabili |
|---|---|---|---|
| GitHub Pages (repo privata, piano Pro/Team/Enterprise) | workflow incluso | `dist` | nessuna |
| Cloudflare Pages | `npm run build:full` | `dist` | `GITHUB_TOKEN` (opzionale), `BASE_PATH=/` |
| Vercel | `npm run build:full` | `dist` | `GITHUB_TOKEN` (opzionale) |
| GitLab Pages | `npm run build:full && mv dist public` | `public` | `BASE_PATH=/<progetto>/` |

Il token serve solo in build per alzare il rate limit e **non** finisce nel bundle client.

## Aggiungere contenuti

- **Nuova repository:** aggiungi un oggetto `Entry` in `src/data/firmwares.ts`. Lo script di prefetch la rileva da solo.
- **Nuovo laboratorio:** segui lo schema commentato in `src/data/labs.ts`.

## Nota etica

Il progetto ha scopo didattico. Ogni scheda riporta note su uso responsabile, normativa radio e reati informatici. Usa il dispositivo solo su sistemi di tua proprietà o per cui hai autorizzazione scritta.

## License / Licenza

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Questo progetto è distribuito con licenza MIT - consulta il file [LICENSE](LICENSE) per maggiori dettagli.
