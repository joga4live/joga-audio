"""
deploy.py — Paso 4: Git commit + push a GitHub Pages
Hace commit de todos los cambios y sube al repo configurado.
"""
from __future__ import annotations
import os, sys, subprocess
sys.path.insert(0, os.path.dirname(__file__))
from config import *
from logger import log


def run_git(args: list, cwd: str) -> tuple:
    result = subprocess.run(
        ["git"] + args,
        cwd=cwd,
        capture_output=True,
        text=True
    )
    return result.returncode, result.stdout.strip(), result.stderr.strip()


def run(message_es: str | None = None, message_en: str | None = None):
    if not message_es:
        message_es = "feat: actualizar audios y catálogo"
    if not message_en:
        message_en = "feat: update audio files and catalog"

    commit_msg = f"{message_es} / {message_en}"

    log("── Deploy Joga Audio ──────────────────")

    # 1. Verificar que es un repo git
    code, out, err = run_git(["status", "--short"], ROOT_DIR)
    if code != 0:
        log(f"ERROR: No es un repo git en {ROOT_DIR}")
        log("Inicializa con: git init && git remote add origin <url>")
        return False

    if not out.strip():
        log("Sin cambios — nada que hacer")
        return True

    log(f"Cambios detectados:\n{out}")

    # 2. Git add
    code, _, err = run_git(["add", "."], ROOT_DIR)
    if code != 0:
        log(f"ERROR git add: {err}")
        return False

    # 3. Git commit
    code, out, err = run_git(["commit", "-m", commit_msg], ROOT_DIR)
    if code != 0:
        log(f"ERROR git commit: {err}")
        return False
    log(f"✓ Commit: {commit_msg}")

    # 4. Git push
    code, out, err = run_git(["push", "origin", GITHUB_BRANCH], ROOT_DIR)
    if code != 0:
        log(f"ERROR git push: {err}")
        log("TIP: Asegúrate de tener el repo conectado (git remote -v)")
        return False

    log(f"✓ Push exitoso → https://github.com/{GITHUB_REPO}")
    log(f"✓ Live en: https://joga4live.github.io/joga-audio/")
    return True


if __name__ == "__main__":
    msg_es = sys.argv[1] if len(sys.argv) > 1 else None
    msg_en = sys.argv[2] if len(sys.argv) > 2 else None
    run(msg_es, msg_en)
