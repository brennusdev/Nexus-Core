# ====================================================================
# CORRECAO: database.py - Completa infraestrutura SQLAlchemy
# MOTIVO: Arquivo original estava DUPLICADO do config.py (continha
#         apenas DATABASE_URL, SECRET_KEY, ALGORITHM e ACCESS_TOKEN...).
#         Era necessario ter: engine, SessionLocal, Base e get_db()
#         para o ORM SQLAlchemy funcionar com os models (User, etc.).
# ====================================================================
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# CORRECAO: Importando DATABASE_URL do config.py para EVITAR DUPLICACAO
# MOTIVO: config.py ja define DATABASE_URL, SECRET_KEY, etc. Nao faz
#         sentido database.py redefinir as mesmas variaveis.
from App.core.config import DATABASE_URL

# engine: ponto de conexao com o banco de dados PostgreSQL
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
