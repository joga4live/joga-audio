"""
setup_keys.py — Escribe las keys de forma segura vía teclado
Corre: python pipeline/setup_keys.py
"""
import os, getpass

env_path = os.path.join(os.path.dirname(__file__), ".env")

print("\n── Joga Audio — Configuración de API Keys ──")
print("Escribe cada key con el teclado (no se muestra en pantalla)\n")

openai_key = getpass.getpass("OpenAI API Key (sk-...): ").strip()
azure_key  = getpass.getpass("Azure Speech Key (o Enter para omitir): ").strip()
azure_region = input("Azure Region [eastus]: ").strip() or "eastus"

lines = [
    "# .env — Joga Audio Pipeline",
    "# NO subir a GitHub",
    "",
    f"OPENAI_API_KEY={openai_key}",
    f"AZURE_SPEECH_KEY={azure_key}",
    f"AZURE_SPEECH_REGION={azure_region}",
]

with open(env_path, "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"\n✓ Keys guardadas en {env_path}")
print(f"  OpenAI: {openai_key[:8]}...{openai_key[-4:] if len(openai_key) > 12 else ''}")
if azure_key:
    print(f"  Azure:  {azure_key[:6]}...")
