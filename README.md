# Joga Audio

App web completa de audiobooks del ecosistema Joga Intelligence.

## Stack
- HTML / CSS / JS puro — sin dependencias (desplegable en GitHub Pages)
- Fuentes: Playfair Display (serif) + Inter (sans)
- TTS: Azure Cognitive Services (por implementar)
- Pagos: Stripe (por implementar)

## Estructura
```
joga-audio/
├── index.html     — App completa (hero + catálogo + pricing + player)
├── style.css      — Tokens, componentes, responsive
├── catalog.js     — Datos de libros y render de tarjetas
├── player.js      — Motor del reproductor de audio
├── i18n.js        — Bilingüe ES/EN via localStorage (jiLang)
└── README.md
```

## Reglas del proyecto
1. i18n via `STRINGS.es{}` / `STRINGS.en{}` + `t(key)` — NO usar `data-i18n`
2. Commits bilingüe ES+EN
3. Capítulo 1 de cada libro es gratis (gate en player.js)
4. Precio por libro: $19 USD | Biblioteca completa: $79/año

## Audio (Azure TTS)
Endpoint: `https://<region>.tts.speech.microsoft.com/cognitiveservices/v1`
Voz recomendada: `es-MX-DaliaNeural` / `en-US-AriaNeural`
Los archivos `.mp3` van en `/audio/<slug>/ch<N>.mp3`

## Deploy
```bash
git init
git add .
git commit -m "feat: init Joga Audio — app completa ES+EN / init complete app"
gh repo create joga4live/joga-audio --public --source=. --push
# Activar GitHub Pages → Settings → Pages → Branch: main / root
```
