from dotenv import load_dotenv
import os
from pathlib import Path
from urllib.parse import urlparse

# CORRECAO: Carrega o .env da pasta Backend (raiz do backend), nao do CWD.
# MOTIVO: load_dotenv() sem argumento procura ./.env (CWD). Quando o backend
#         e executado a partir da raiz do projeto, o .env fica em ./Backend/.env.
#         Aqui usamos o caminho relativo ao arquivo para ser robusto em qualquer
#         local de execucao (Docker, terminal, IDE).
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent  # .../Backend
load_dotenv(BACKEND_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").strip().lower()
if ENVIRONMENT not in {"development", "production", "test"}:
    raise RuntimeError("ENVIRONMENT deve ser development, production ou test.")

SECRET_KEY = os.getenv("SECRET_KEY", "").strip()
if (
    len(SECRET_KEY) < 32
    or SECRET_KEY.lower().startswith(("troque", "replace", "change-me", "substitua"))
):
    raise RuntimeError(
        "SECRET_KEY deve conter pelo menos 32 caracteres aleatorios. "
        "Gere uma chave exclusiva e configure-a no ambiente."
    )

ALGORITHM = os.getenv("ALGORITHM", "HS256").strip().upper()
if ALGORITHM != "HS256":
    raise RuntimeError("ALGORITHM deve ser HS256.")

try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
except ValueError as exc:
    raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES deve ser um inteiro positivo.") from exc

if ACCESS_TOKEN_EXPIRE_MINUTES <= 0:
    raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES deve ser um inteiro positivo.")

# Origens CORS permitidas (separadas por virgula). Ex:
#   CORS_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
_configured_origins = os.getenv("CORS_ORIGINS", "").strip()
if ENVIRONMENT == "production" and not _configured_origins:
    raise RuntimeError("CORS_ORIGINS deve ser configurada em producao.")

CORS_ORIGINS = [
    origin.strip()
    for origin in (
        _configured_origins
        or "http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000,http://localhost:8080"
    ).split(",")
    if origin.strip()
]

if not CORS_ORIGINS:
    raise RuntimeError("CORS_ORIGINS deve conter ao menos uma origem.")

if "*" in CORS_ORIGINS:
    raise RuntimeError("CORS_ORIGINS nao pode conter '*'.")

for origin in CORS_ORIGINS:
    parsed_origin = urlparse(origin)
    if (
        parsed_origin.scheme not in {"http", "https"}
        or not parsed_origin.hostname
        or parsed_origin.path
        or parsed_origin.query
        or parsed_origin.fragment
        or parsed_origin.username
        or parsed_origin.password
    ):
        raise RuntimeError("Cada origem CORS deve ser uma URL sem caminho.")

if ENVIRONMENT == "production" and any(
    not origin.startswith("https://") for origin in CORS_ORIGINS
):
    raise RuntimeError("Todas as origens CORS de producao devem usar HTTPS.")
