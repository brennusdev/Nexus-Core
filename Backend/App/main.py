from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# CORRECAO: Importa os models no startup da aplicacao.
# MOTIVO: Sem isso o SQLAlchemy nao registra as tabelas (Base.metadata)
#         e o Alembic nao encontra os models para gerar migracoes.
import App.models.user  # noqa: F401
from App.api.auth import router as auth_router
from App.core.config import CORS_ORIGINS

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
        "version": app.version,
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