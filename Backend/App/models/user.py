# ====================================================================
# CORRECAO: user.py - Import corrigido para case-sensitive
# MOTIVO: O import original usava "app.core.database" (minusculo),
#         mas o pacote correto e "App.core.database" (maiusculo).
#         No Windows nao da erro (case-insensitive), mas no Linux
#         (Docker/producao) quebra com ModuleNotFoundError.
# ====================================================================
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

# CORRECAO: "app.core.database" -> "App.core.database"
# MOTIVO: Case-sensitive! "App" com A maiusculo, nao "app" com minusculo.
from App.core.database import Base


class User(Base):
    """
    Modelo de Usuario do Nexus Core.
    Mapeia a tabela 'users' no banco PostgreSQL.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
