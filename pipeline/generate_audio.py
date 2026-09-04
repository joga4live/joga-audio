"""
generate_audio.py — Paso 2: Texto → MP3 con OpenAI TTS
Lee: pipeline/content/<slug>/<lang>/ch<N>.txt
Escribe: audio/<slug>/<lang>/ch<N>.mp3

Voz: alloy (neutral, cálida) — cambia en config.py OPENAI_VOICE_ES/EN
Modelo: tts-1 ($15/millón chars) o tts-1-hd ($30/millón chars)
Límite OpenAI: 4096 chars por request → se divide automáticamente
"""
import os, sys, time, re
sys.path.insert(0, os.path.dirname(__file__))
from config import *
from logger import log


# ── Voces OpenAI disponibles ──────────────────────────────────────
# alloy, echo, fable, onyx, nova, shimmer
OPENAI_VOICE_ES = "nova"    # cálida, femenina — ideal español
OPENAI_VOICE_EN = "alloy"   # neutral, clara


# ── Dividir texto (límite 4096 chars por request) ─────────────────
def split_text(text: str, max_chars: int = 3800) -> list:
    paras = [p.strip() for p in re.split(r"\n{2,}", text) if p.strip()]
    chunks, current = [], ""
    for p in paras:
        if len(current) + len(p) + 2 <= max_chars:
            current = (current + "\n\n" + p).lstrip()
        else:
            if current:
                chunks.append(current)
            if len(p) > max_chars:
                # Párrafo enorme → cortar por oraciones
                sentences = re.split(r"(?<=[.!?])\s+", p)
                buf = ""
                for s in sentences:
                    if len(buf) + len(s) + 1 <= max_chars:
                        buf = (buf + " " + s).strip()
                    else:
                        if buf:
                            chunks.append(buf)
                        buf = s
                current = buf
            else:
                current = p
    if current:
        chunks.append(current)
    return chunks


# ── Concatenar MP3s ───────────────────────────────────────────────
def concat_mp3s(parts: list, out_path: str):
    with open(out_path, "wb") as out:
        for p in parts:
            with open(p, "rb") as f:
                out.write(f.read())
    for p in parts:
        try: os.remove(p)
        except OSError: pass


# ── Llamada OpenAI TTS ────────────────────────────────────────────
def tts_openai(text: str, voice: str, out_path: str) -> bool:
    try:
        from openai import OpenAI
    except ImportError:
        log("ERROR: pip install openai")
        return False

    client = OpenAI(api_key=OPENAI_API_KEY)
    try:
        response = client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text,
            response_format="mp3",
        )
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        response.stream_to_file(out_path)
        return True
    except Exception as e:
        log(f"  ERROR OpenAI TTS: {e}")
        return False


# ── Procesar un capítulo ──────────────────────────────────────────
def process_chapter(book_id: str, ch_num: str, txt_path: str,
                    mp3_path: str, lang: str) -> bool:
    with open(txt_path, encoding="utf-8") as f:
        text = f.read().strip()

    voice = OPENAI_VOICE_ES if lang == "es" else OPENAI_VOICE_EN
    chunks = split_text(text)
    log(f"  {len(chunks)} chunk(s) | {len(text)} chars | voz: {voice}")

    if len(chunks) == 1:
        return tts_openai(chunks[0], voice, mp3_path)

    # Múltiples chunks → combinar
    parts = []
    for i, chunk in enumerate(chunks):
        part_path = mp3_path.replace(".mp3", f"__part{i:02d}.mp3")
        ok = tts_openai(chunk, voice, part_path)
        if not ok:
            for p in parts:
                try: os.remove(p)
                except OSError: pass
            return False
        parts.append(part_path)
        time.sleep(0.5)

    os.makedirs(os.path.dirname(mp3_path), exist_ok=True)
    concat_mp3s(parts, mp3_path)
    return True


# ── Main ──────────────────────────────────────────────────────────
def run(books_filter=None, lang="es"):
    if not OPENAI_API_KEY or OPENAI_API_KEY in ("TU_OPENAI_API_KEY", "PEGA_TU_KEY_AQUI"):
        log("ERROR: Configura OPENAI_API_KEY en pipeline/config.py")
        return

    # Recopilar tareas
    tasks = []
    for book_id in sorted(os.listdir(CONTENT_DIR)):
        if books_filter and book_id not in books_filter:
            continue
        lang_dir = os.path.join(CONTENT_DIR, book_id, lang)
        if not os.path.isdir(lang_dir):
            continue
        for fname in sorted(os.listdir(lang_dir)):
            if not fname.endswith(".txt"):
                continue
            ch_num = fname.replace(".txt", "")
            txt_path = os.path.join(lang_dir, fname)
            mp3_path = os.path.join(AUDIO_DIR, book_id, lang, f"{ch_num}.mp3")
            tasks.append((book_id, ch_num, txt_path, mp3_path))

    if not tasks:
        log("Sin archivos .txt para procesar.")
        log("Genera el contenido primero: python pipeline/run_pipeline.py --step 1")
        return

    log(f"OpenAI TTS | {len(tasks)} capítulos | idioma: {lang}")
    log(f"Modelo: tts-1 | Voz ES: {OPENAI_VOICE_ES} | Voz EN: {OPENAI_VOICE_EN}")
    log("")

    done, errors = 0, 0
    for i, (book_id, ch_num, txt_path, mp3_path) in enumerate(tasks):
        if os.path.exists(mp3_path):
            log(f"SKIP [{i+1}/{len(tasks)}] {book_id}/{ch_num}.mp3 (ya existe)")
            done += 1
            continue

        log(f"TTS  [{i+1}/{len(tasks)}] {book_id}/{ch_num}")
        ok = process_chapter(book_id, ch_num, txt_path, mp3_path, lang)

        if ok:
            size_kb = os.path.getsize(mp3_path) // 1024
            log(f"  ✓ {size_kb} KB → audio/{book_id}/{lang}/{ch_num}.mp3")
            done += 1
        else:
            log(f"  ✗ Error — {book_id}/{ch_num}")
            errors += 1

        time.sleep(1)

    log("")
    log(f"✓ Audio completo: {done} OK | {errors} errores")


if __name__ == "__main__":
    run(books_filter=BOOKS_TO_PROCESS, lang=LANG)
