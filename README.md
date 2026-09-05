# Joga Audio

App web completa de audiobooks del ecosistema Joga Intelligence.

## Stack
- HTML / CSS / JS puro — sin dependencias (desplegable en GitHub Pages)
- Fuentes: Playfair Display (serif) + Inter (sans)
- TTS: OpenAI (`pipeline/config.py: TTS_PROVIDER = "openai"`, voz `nova`/`alloy`) — este README decía
  Azure, pero ese es solo el proveedor alternativo ya soportado en el mismo archivo, no el activo.
  Verificar precio de cada uno antes de decidir cuál usar en producción, no quedarse con lo que diga aquí.
- Pagos: sin implementar. El botón "Obtener acceso" hoy sólo hace scroll a #pricing.

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

## Audio
Los archivos `.mp3` van en `/audio/<slug>/ch<N>.mp3`. Ver `pipeline/config.py` para el
proveedor de voz activo y sus alternativas.

## PENDIENTE — candado real (4-sep, Nico)
Nico (revisor) encontró que el candado de los capítulos de pago era sólo visual: el
JavaScript decidía si *mostraba* el reproductor, pero el archivo mp3 quedaba servido
igual para cualquiera en GitHub Pages, sin cuenta ni pago. Se retiraron del repo los
7 capítulos de pago de `claridad-mental` (queda sólo `ch01.mp3`, que es el gratis a
propósito) para cerrar la fuga de inmediato — hoy nadie ha pagado, así que no se pierde
acceso de ningún comprador real.

**Esto NO resuelve el candado, sólo saca los archivos de la vista.** Mientras el resto
de los audios se vayan grabando, hace falta servirlos desde algo que sí verifique el
pago antes de entregar el archivo — el patrón que ya usa Joga Books
(`Joga-Books/worker.js`, un Worker de Cloudflare con KV) es el modelo a copiar, no una
solución nueva que inventar. Requiere una cuenta de Cloudflare con permiso de
despliegue, que esta sesión no tiene — es un paso para José/Hermes, igual que se hizo
con `worker.js` en Joga Books.

Nota aparte: `git rm` saca los archivos de la versión actual, pero no los borra del
historial de Git. Alguien con la URL exacta de un commit viejo todavía podría
encontrarlos hasta que se reescriba el historial (`git filter-repo` o similar) — una
decisión aparte, porque reescribir historial obliga a Hermes a re-clonar el repo.

## Deploy
```bash
git init
git add .
git commit -m "feat: init Joga Audio — app completa ES+EN / init complete app"
gh repo create joga4live/joga-audio --public --source=. --push
# Activar GitHub Pages → Settings → Pages → Branch: main / root
```
