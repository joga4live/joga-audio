# Joga Audio — Pipeline

Genera contenido con IA → convierte a audio con Azure TTS → actualiza el catálogo → deploy.

```
pipeline/
├── run_pipeline.py       ← Orquestador principal (punto de entrada)
├── config.py             ← EDITA AQUÍ tus API keys y preferencias
├── generate_content.py   ← Paso 1: OpenAI GPT-4o → .txt por capítulo
├── generate_audio.py     ← Paso 2: Azure TTS → .mp3
├── update_catalog.py     ← Paso 3: Actualiza rutas de audio en catalog.js
├── deploy.py             ← Paso 4: git commit + push → GitHub Pages
├── logger.py             ← Logger compartido
├── requirements.txt      ← pip install -r requirements.txt
└── content/              ← Textos generados (auto-creado)
    └── <slug>/es/ch01.txt
```

## Setup inicial (1 sola vez)

```bash
cd /Users/josegallardo/joga-audio
source .venv/bin/activate
pip install -r pipeline/requirements.txt
```

Edita `pipeline/config.py` y pon tus credenciales:

```python
AZURE_SPEECH_KEY    = "tu-key-aquí"
AZURE_SPEECH_REGION = "eastus"       # la región de tu recurso
OPENAI_API_KEY      = "tu-key-aquí"  # para generar el texto
```

**Dónde obtener el Azure Speech Key:**
1. portal.azure.com → Crear recurso → "Speech"
2. Una vez creado → Keys and Endpoint → KEY 1

## Uso

```bash
# Activar entorno
source .venv/bin/activate

# Pipeline completo (texto → audio → catalog → deploy)
python pipeline/run_pipeline.py

# Solo un libro para probar
python pipeline/run_pipeline.py --books claridad-mental

# Solo generar audios (ya tienes los .txt)
python pipeline/run_pipeline.py --step 2 --skip-content

# Ya tienes textos, generar audio + deploy
python pipeline/run_pipeline.py --skip-content

# En inglés
python pipeline/run_pipeline.py --lang en

# Ambos idiomas
python pipeline/run_pipeline.py --lang both
```

## Voces Azure

| Idioma | Voz | Estilo |
|---|---|---|
| ES | `es-MX-DaliaNeural` | Cálida, natural, mexicana |
| EN | `en-US-AriaNeural` | Clara, profesional |

Cambia las voces en `config.py` → `AZURE_VOICE_ES` / `AZURE_VOICE_EN`.
Voces disponibles: https://aka.ms/SpeechServiceVoices

## Costos estimados (Azure)

| Recurso | Precio | 1 capítulo (~700 palabras ~4,500 chars) | 46 capítulos |
|---|---|---|---|
| Azure Speech (Neural) | $4 USD / millón chars | ~$0.018 | ~$0.83 |
| OpenAI GPT-4o | $2.50 / millón tokens | ~$0.008 | ~$0.37 |

**Total los 6 libros completos: ~$1.20 USD** — prácticamente gratis.

## Flujo de archivos

```
pipeline/content/<slug>/es/ch01.txt  →  [Azure TTS]  →  audio/<slug>/es/ch01.mp3
                                                      →  catalog.js (rutas actualizadas)
                                                      →  GitHub Pages (deploy)
```
