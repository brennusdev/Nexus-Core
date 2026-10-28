import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# CORRECAO: Importa os models no startup da aplicacao.
# MOTIVO: Sem isso o SQLAlchemy nao registra as tabelas (Base.metadata)
#         e o Alembic nao encontra os models para gerar migracoes.
import App.models.user  # noqa: F401
from App.api.auth import router as auth_router

app = FastAPI(
    title="Nexus Core API",
    description="Backend oficial do Nexus Core",
    version="1.1.0",
)

# ============================================================
# CORS - OBRIGATORIO para o frontend chamar a API no navegador
# ============================================================
# MOTIVO: Sem CORS o browser bloqueia fetch de http://localhost:5500
#         (Live Server) ou :8000 para http://localhost:8000 (API).
# FRONTALIZADO: CORS_ORIGINS no .env (lista separada por virgula),
#         com fallback para os portes de dev mais comuns.
_default_origins = "http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000,http://localhost:8080"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", _default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Routers
# ============================================================
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "project": "Nexus Core",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health():
    # CORRECAO: health check agora testa o banco de verdade.
    from sqlalchemy import text
    from App.core.database import engine
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db = "up"
    except Exception:
        db = "down"
    return {
        "status": "healthy" if db == "up" else "degraded",
        "database": db
    }