# ====================================================================
# CORRECAO: database.py - Completa infraestrutura SQLAlchemy
# MOTIVO: Arquivo original estava DUPLICADO do config.py (continha
#         apenas DATABASE_URL, SECRET_KEY, ALGORITHM e ACCESS_TOKEN...).
#         Era necessario ter: engine, SessionLocal, Base e get_db()
#         para o ORM SQLAlchemy funcionar com os models (User, etc.).
# ====================================================================
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# IMPORTANTE: Importar config.py carrega o .env (load_dotenv) ANTES de
#         lermos DATABASE_URL. Sem este import, se database.py for o
#         primeiro modulo a ser carregado, o .env nunca seria lido.
from App.core.config import DATABASE_URL as configured_database_url

DATABASE_URL = configured_database_url or ""

# CORRECAO: create_engine com DATABASE_URL vazio quebrava com erro
#         obsuro. Agora valida cedo com mensagem clara.
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL nao definida. Verifique Backend/.env "
        "(veja .env.example)."
    )

engine = create_engine(DATABASE_URL)

# SessionLocal: fabrica/factory de sessoes do SQLAlchemy
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base: classe base utilizada por todos os modelos (User, etc.)
# CORRECAO: ADICIONADO - estava faltando, sem isso nenhum model funciona
Base = declarative_base()


def get_db():
    """
    CORRECAO: ADICIONADO - Dependencia injetavel do FastAPI.
    MOTIVO: Sem esta funcao generator, as rotas da API nao conseguem
            obter uma sessao do banco de dados.
    Uso: @app.get('/users') -> def list_users(db: Session = Depends(get_db))
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
