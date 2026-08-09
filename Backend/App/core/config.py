from dotenv import load_dotenv
import os
from pathlib import Path

# CORRECAO: Carrega o .env da pasta Backend (raiz do backend), nao do CWD.
# MOTIVO: load_dotenv() sem argumento procura ./.env (CWD). Quando o backend
#         e executado a partir da raiz do projeto, o .env fica em ./Backend/.env.
#         Aqui usamos o caminho relativo ao arquivo para ser robusto em qualquer
#         local de execucao (Docker, terminal, IDE).
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent  # .../Backend
load_dotenv(BACKEND_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv("ALGORITHM")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
)
