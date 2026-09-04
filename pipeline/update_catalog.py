"""
update_catalog.py — Paso 3: Actualiza catalog.js con las rutas reales de audio
Lee los MP3 en /audio/<slug>/<lang>/ch<N>.mp3
Escribe las rutas en el array CATALOG de catalog.js
"""
import os, sys, re
sys.path.insert(0, os.path.dirname(__file__))
from config import *
from logger import log


def get_audio_path(book_id: str, ch_id: int, lang: str) -> str:
    """Ruta relativa desde la raíz del sitio."""
    mp3 = os.path.join(AUDIO_DIR, book_id, lang, f"ch{ch_id:02d}.mp3")
    if os.path.exists(mp3):
        rel = os.path.relpath(mp3, ROOT_DIR)
        return rel.replace(os.sep, "/")
    return ""


def run(lang="es"):
    catalog_path = os.path.join(ROOT_DIR, "catalog.js")
    with open(catalog_path, encoding="utf-8") as f:
        content = f.read()

    # Buscar todos los capítulos en el catalog.js y actualizar audio paths
    # Pattern: { id: N, title_es: "...", ..., free: bool, audio: '' }
    updated = 0

    def replace_audio(match):
        nonlocal updated
        # Extraer datos del match
        block = match.group(0)
        # Extraer book_id del contexto — necesitamos trabajar bloque por bloque
        return block  # placeholder — usamos método de bloques abajo

    # Método más robusto: procesar libro por libro
    # Parsear los IDs de los libros del archivo
    book_ids = re.findall(r"id:\s*'([^']+)'", content)
    book_ids = [b for b in book_ids if not b.startswith("ch") and not b[0].isdigit()]

    for book_id in book_ids:
        # Encontrar el bloque del libro
        pattern = rf"(id:\s*'{re.escape(book_id)}'.*?chapters:\s*\[)(.*?)(\])"
        match = re.search(pattern, content, re.DOTALL)
        if not match:
            continue

        chapters_block = match.group(2)

        def replace_ch_audio(m):
            nonlocal updated
            ch_block = m.group(0)
            # Extraer chapter id
            id_match = re.search(r"id:\s*(\d+)", ch_block)
            if not id_match:
                return ch_block
            ch_id = int(id_match.group(1))
            audio_path = get_audio_path(book_id, ch_id, lang)
            if audio_path:
                new_block = re.sub(r"audio:\s*'[^']*'", f"audio: '{audio_path}'", ch_block)
                if new_block != ch_block:
                    updated += 1
                return new_block
            return ch_block

        new_chapters = re.sub(
            r"\{[^}]+id:\s*\d+[^}]+\}",
            replace_ch_audio,
            chapters_block,
            flags=re.DOTALL
        )

        content = content.replace(
            match.group(0),
            match.group(1) + new_chapters + match.group(3)
        )

    with open(catalog_path, "w", encoding="utf-8") as f:
        f.write(content)

    log(f"✓ catalog.js actualizado — {updated} rutas de audio escritas")


if __name__ == "__main__":
    run(lang=LANG)
