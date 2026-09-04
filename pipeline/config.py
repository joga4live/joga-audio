"""
config.py — Joga Audio Pipeline
Las credenciales se leen del archivo .env (nunca en código fuente).
"""
import os
from pathlib import Path

# ── Cargar .env ───────────────────────────────────────────────────
_env_file = Path(__file__).parent / ".env"
if _env_file.exists():
    for line in _env_file.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

# ── CREDENCIALES (desde .env) ─────────────────────────────────────
def _clean_key(val: str) -> str:
    """Quita prefijos que Hermes agrega automáticamente (sc:, sk:, etc.)"""
    for prefix in ("sc:", "sk:", "secret:"):
        if val.startswith(prefix):
            val = val[len(prefix):]
    return val.strip()

OPENAI_API_KEY      = _clean_key(os.environ.get("OPENAI_API_KEY", ""))
AZURE_SPEECH_KEY    = _clean_key(os.environ.get("AZURE_SPEECH_KEY", ""))
AZURE_SPEECH_REGION = os.environ.get("AZURE_SPEECH_REGION", "eastus")
ELEVENLABS_API_KEY  = _clean_key(os.environ.get("ELEVENLABS_API_KEY", ""))

# ── GitHub ────────────────────────────────────────────────────────
GITHUB_REPO   = "joga4live/joga-audio"
GITHUB_BRANCH = "main"

# ── Voces ─────────────────────────────────────────────────────────
AZURE_VOICE_ES  = "es-MX-DaliaNeural"
AZURE_VOICE_EN  = "en-US-AriaNeural"
VOICE_ID_ES     = "cgSgspJ2msm6clMCkdW9"
VOICE_ID_EN     = "EXAVITQu4vr4xnSDxMaL"

# ── Paths ─────────────────────────────────────────────────────────
ROOT_DIR     = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PIPELINE_DIR = os.path.dirname(__file__)
CONTENT_DIR  = os.path.join(PIPELINE_DIR, "content")
AUDIO_DIR    = os.path.join(ROOT_DIR, "audio")
LOG_FILE     = os.path.join(PIPELINE_DIR, "pipeline.log")

# ── Proveedor TTS ─────────────────────────────────────────────────
# "openai" | "azure"
TTS_PROVIDER = "openai"

# ── Idioma ────────────────────────────────────────────────────────
# "es" | "en" | "both"
LANG = "es"

# ── Libros a procesar ─────────────────────────────────────────────
# None = todos | lista = solo esos
BOOKS_TO_PROCESS = None
# BOOKS_TO_PROCESS = ["claridad-mental"]
