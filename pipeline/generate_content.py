"""
generate_content.py — Paso 1: Genera el texto de cada capítulo con OpenAI
Salida: pipeline/content/<slug>/<lang>/ch<N>.txt
"""
import os, json, sys, time
sys.path.insert(0, os.path.dirname(__file__))
from config import *
from logger import log

# Datos base de los libros (sincronizados con catalog.js)
BOOKS = [
    {
        "id": "claridad-mental",
        "title_es": "Claridad Mental",
        "subtitle_es": "Domina tu mente. Decide con precisión.",
        "chapters": [
            {"id": 1, "title_es": "El ruido que nunca para", "target_minutes": 5},
            {"id": 2, "title_es": "La arquitectura del pensamiento", "target_minutes": 6},
            {"id": 3, "title_es": "Foco sin esfuerzo", "target_minutes": 5},
            {"id": 4, "title_es": "Emociones como datos", "target_minutes": 6},
            {"id": 5, "title_es": "Decisiones de alto impacto", "target_minutes": 6},
            {"id": 6, "title_es": "La mente en descanso", "target_minutes": 5},
            {"id": 7, "title_es": "Hábitos cognitivos", "target_minutes": 5},
            {"id": 8, "title_es": "Tu mente, tu ventaja", "target_minutes": 4},
        ]
    },
    {
        "id": "tiempo-consciente",
        "title_es": "Tiempo Consciente",
        "subtitle_es": "Recupera tu tiempo. Vive con intención.",
        "chapters": [
            {"id": 1, "title_es": "El tiempo que se escapa", "target_minutes": 5},
            {"id": 2, "title_es": "Diseña tu día", "target_minutes": 6},
            {"id": 3, "title_es": "El poder del bloque", "target_minutes": 5},
            {"id": 4, "title_es": "Menos pero mejor", "target_minutes": 6},
            {"id": 5, "title_es": "Ritmos y energía", "target_minutes": 5},
            {"id": 6, "title_es": "Tu semana ideal", "target_minutes": 5},
        ]
    },
    {
        "id": "habitos-que-transforman",
        "title_es": "Hábitos que Transforman",
        "subtitle_es": "El cambio no es fuerza de voluntad. Es sistema.",
        "chapters": [
            {"id": 1, "title_es": "Por qué los hábitos fallan", "target_minutes": 5},
            {"id": 2, "title_es": "El ciclo del hábito", "target_minutes": 5},
            {"id": 3, "title_es": "Identidad primero", "target_minutes": 6},
            {"id": 4, "title_es": "Stacking y anclas", "target_minutes": 5},
            {"id": 5, "title_es": "El entorno como aliado", "target_minutes": 5},
            {"id": 6, "title_es": "Hábitos de mañana", "target_minutes": 5},
            {"id": 7, "title_es": "Resistencia y fricción", "target_minutes": 5},
            {"id": 8, "title_es": "Medir sin obsesión", "target_minutes": 5},
            {"id": 9, "title_es": "Cuando rompes la racha", "target_minutes": 4},
            {"id": 10, "title_es": "El sistema completo", "target_minutes": 4},
        ]
    },
    {
        "id": "tu-proposito",
        "title_es": "Tu Propósito",
        "subtitle_es": "Encuentra tu norte. Actúa desde lo que importa.",
        "chapters": [
            {"id": 1, "title_es": "La pregunta que cambia todo", "target_minutes": 5},
            {"id": 2, "title_es": "Valores como brújula", "target_minutes": 6},
            {"id": 3, "title_es": "El rol que eliges", "target_minutes": 5},
            {"id": 4, "title_es": "Miedo vs. propósito", "target_minutes": 6},
            {"id": 5, "title_es": "Trabajar con sentido", "target_minutes": 5},
            {"id": 6, "title_es": "Tu legado cotidiano", "target_minutes": 5},
            {"id": 7, "title_es": "Vivir alineado", "target_minutes": 3},
        ]
    },
    {
        "id": "capital-inteligente",
        "title_es": "Capital Inteligente",
        "subtitle_es": "Dinero que trabaja contigo. Libertad real.",
        "chapters": [
            {"id": 1, "title_es": "Tu relación con el dinero", "target_minutes": 5},
            {"id": 2, "title_es": "El primer paso financiero", "target_minutes": 5},
            {"id": 3, "title_es": "Flujo de caja personal", "target_minutes": 5},
            {"id": 4, "title_es": "Invertir sin miedo", "target_minutes": 6},
            {"id": 5, "title_es": "Deuda estratégica", "target_minutes": 5},
            {"id": 6, "title_es": "Ingresos paralelos", "target_minutes": 5},
            {"id": 7, "title_es": "El portafolio simple", "target_minutes": 5},
            {"id": 8, "title_es": "Libertad financiera real", "target_minutes": 3},
        ]
    },
    {
        "id": "el-arte-de-vender",
        "title_es": "El Arte de Vender",
        "subtitle_es": "Vende con alma. Sin presión. Con resultados.",
        "chapters": [
            {"id": 1, "title_es": "La venta como servicio", "target_minutes": 5},
            {"id": 2, "title_es": "Escuchar antes de hablar", "target_minutes": 5},
            {"id": 3, "title_es": "Conversaciones que convierten", "target_minutes": 6},
            {"id": 4, "title_es": "El precio con confianza", "target_minutes": 5},
            {"id": 5, "title_es": "Objeciones como datos", "target_minutes": 5},
            {"id": 6, "title_es": "Seguimiento sin ruido", "target_minutes": 5},
            {"id": 7, "title_es": "Tu sistema de ventas", "target_minutes": 3},
        ]
    },
]

SYSTEM_PROMPT = """Eres el narrador de Joga Intelligence, un ecosistema premium de crecimiento personal.
Tu voz es: cálida, directa, inteligente. Sin relleno. Sin frases vacías.
Usas frases cortas. Párrafos de 3-4 oraciones. Lenguaje accesible pero profundo.
Cada capítulo tiene una idea central clara + ejemplos concretos + cierre con acción.
Escribe para ser NARRADO EN VOZ ALTA — nada de viñetas, títulos, ni formatos."""


def words_for_minutes(minutes):
    return minutes * 140  # ~140 palabras/minuto de narración natural


def generate_chapter(book, chapter, lang="es"):
    try:
        from openai import OpenAI
    except ImportError:
        log("ERROR: pip install openai")
        return None

    client = OpenAI(api_key=OPENAI_API_KEY)
    title = chapter[f"title_{lang}"]
    book_title = book[f"title_{lang}"]
    book_sub = book[f"subtitle_{lang}"]
    words = words_for_minutes(chapter["target_minutes"])

    prompt = f"""Escribe el capítulo {chapter['id']} del audiobook "{book_title}" ({book_sub}).
Título del capítulo: "{title}"
Extensión objetivo: aproximadamente {words} palabras.
Idioma: {"español" if lang == "es" else "inglés"}.
El capítulo debe leerse en {chapter['target_minutes']} minutos a ritmo de narración.
Comienza directamente con el contenido — sin título, sin encabezado."""

    resp = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": prompt}
        ],
        temperature=0.75,
        max_tokens=words * 2,
    )
    return resp.choices[0].message.content.strip()


def run(books_filter=None, lang="es"):
    books = [b for b in BOOKS if not books_filter or b["id"] in books_filter]
    total = sum(len(b["chapters"]) for b in books)
    done  = 0

    for book in books:
        out_dir = os.path.join(CONTENT_DIR, book["id"], lang)
        os.makedirs(out_dir, exist_ok=True)

        for ch in book["chapters"]:
            out_file = os.path.join(out_dir, f"ch{ch['id']:02d}.txt")
            if os.path.exists(out_file):
                log(f"SKIP (ya existe): {book['id']}/ch{ch['id']:02d}.txt")
                done += 1
                continue

            log(f"Generando [{done+1}/{total}]: {book['id']} — {ch[f'title_{lang}']}")
            text = generate_chapter(book, ch, lang)
            if text:
                with open(out_file, "w", encoding="utf-8") as f:
                    f.write(text)
                log(f"  ✓ {len(text.split())} palabras → {out_file}")
                done += 1
                time.sleep(1)  # Rate limit
            else:
                log(f"  ✗ Error generando {book['id']} ch{ch['id']}")

    log(f"\n✓ Contenido completo: {done}/{total} capítulos")


if __name__ == "__main__":
    run(books_filter=BOOKS_TO_PROCESS, lang=LANG)
