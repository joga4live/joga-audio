"""
logger.py — Logger compartido del pipeline Joga Audio
"""
import os, sys, datetime
sys.path.insert(0, os.path.dirname(__file__))

_log_path = os.path.join(os.path.dirname(__file__), "pipeline.log")

def log(msg: str, also_print: bool = True):
    ts = datetime.datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    if also_print:
        print(line, flush=True)
    with open(_log_path, "a", encoding="utf-8") as f:
        f.write(line + "\n")
