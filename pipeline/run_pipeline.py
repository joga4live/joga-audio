#!/usr/bin/env python3
"""
run_pipeline.py — Orquestador principal de Joga Audio

Uso:
    python pipeline/run_pipeline.py              # pipeline completo
    python pipeline/run_pipeline.py --step 1     # solo generar texto
    python pipeline/run_pipeline.py --step 2     # solo generar audio
    python pipeline/run_pipeline.py --step 3     # solo actualizar catalog.js
    python pipeline/run_pipeline.py --step 4     # solo deploy a GitHub
    python pipeline/run_pipeline.py --books claridad-mental,tiempo-consciente
    python pipeline/run_pipeline.py --lang en
    python pipeline/run_pipeline.py --skip-content   # omite paso 1 (ya tienes .txt)
"""
import sys, os, argparse, time
sys.path.insert(0, os.path.dirname(__file__))

from config import *
from logger import log

# ── Verificar dependencias ────────────────────────────────────────
def check_deps():
    missing = []
    try:
        import requests
    except ImportError:
        missing.append("requests")
    try:
        import openai
    except ImportError:
        missing.append("openai")
    if missing:
        log(f"ERROR: pip install {' '.join(missing)}")
        return False
    return True


# ── Verificar credenciales ────────────────────────────────────────
def check_credentials(step, provider):
    if step in (None, 1) and OPENAI_API_KEY == "TU_OPENAI_API_KEY":
        log("AVISO: OPENAI_API_KEY no configurada en config.py — omitiendo paso 1")
        return False
    if step in (None, 2):
        if provider == "elevenlabs" and ELEVENLABS_API_KEY == "TU_ELEVENLABS_API_KEY":
            log("ERROR: ELEVENLABS_API_KEY no configurada en config.py")
            return False
        if provider == "azure" and not AZURE_SPEECH_KEY:
            log("ERROR: AZURE_SPEECH_KEY no configurada en config.py")
            return False
    return True


def print_banner():
    print("""
╔══════════════════════════════════════════════╗
║           JOGA AUDIO — PIPELINE              ║
║  Genera contenido → Audio → Catálogo → Deploy ║
╚══════════════════════════════════════════════╝""")


def main():
    parser = argparse.ArgumentParser(description="Joga Audio Pipeline")
    parser.add_argument("--step", type=int, choices=[1, 2, 3, 4],
                        help="Ejecutar solo un paso (1=texto, 2=audio, 3=catalog, 4=deploy)")
    parser.add_argument("--books", type=str,
                        help="Libros a procesar (slugs separados por coma)")
    parser.add_argument("--lang", type=str, default=LANG,
                        choices=["es", "en", "both"],
                        help="Idioma (es, en, both)")
    parser.add_argument("--provider", type=str, default=TTS_PROVIDER,
                        choices=["elevenlabs", "azure"],
                        help="Proveedor TTS")
    parser.add_argument("--skip-content", action="store_true",
                        help="Omitir paso 1 (generación de texto)")
    parser.add_argument("--msg-es", type=str, help="Mensaje commit español")
    parser.add_argument("--msg-en", type=str, help="Mensaje commit inglés")
    args = parser.parse_args()

    print_banner()
    start = time.time()

    books_filter = args.books.split(",") if args.books else BOOKS_TO_PROCESS
    langs = ["es", "en"] if args.lang == "both" else [args.lang]

    log(f"Config: books={books_filter or 'todos'} | lang={args.lang} | provider={args.provider}")
    log(f"Output: audio → {AUDIO_DIR}")
    log("")

    if not check_deps():
        sys.exit(1)

    # ── PASO 1: Generar texto ─────────────────────────────────────
    if args.step in (None, 1) and not args.skip_content:
        log("═══ PASO 1: Generando contenido con IA ═══")
        if check_credentials(1, args.provider):
            import generate_content
            for lang in langs:
                generate_content.run(books_filter=books_filter, lang=lang)
        else:
            log("SKIP paso 1 — configura OPENAI_API_KEY en config.py")
        log("")

    # ── PASO 2: Generar audio ─────────────────────────────────────
    if args.step in (None, 2):
        log("═══ PASO 2: Generando audio TTS ═══")
        if check_credentials(2, args.provider):
            import generate_audio
            for lang in langs:
                generate_audio.run(books_filter=books_filter, lang=lang)
        log("")

    # ── PASO 3: Actualizar catalog.js ────────────────────────────
    if args.step in (None, 3):
        log("═══ PASO 3: Actualizando catalog.js ═══")
        import update_catalog
        for lang in langs:
            update_catalog.run(lang=lang)
        log("")

    # ── PASO 4: Deploy a GitHub ───────────────────────────────────
    if args.step in (None, 4):
        log("═══ PASO 4: Deploy a GitHub Pages ═══")
        import deploy
        deploy.run(message_es=args.msg_es, message_en=args.msg_en)
        log("")

    elapsed = time.time() - start
    log(f"✓ Pipeline completo en {elapsed:.1f}s")
    log(f"📖 Log guardado en: {LOG_FILE}")


if __name__ == "__main__":
    main()
