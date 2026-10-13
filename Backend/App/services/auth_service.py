# ====================================================================
# NEXUS CORE - Servico de Autenticacao (regras de negocio)
# ====================================================================
# Responsabilidade: hash de senha, verificacao e geracao de JWT.
# MOTIVO: Routers nao devem conter regra de negocio - apenas orquestrar
#         chamadas (padrao em camadas). Facilita testes unitarios.
# ====================================================================
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt
from passlib.context import CryptContext

import App.core.config as config

# Contexto de hash: bcrypt (sal embutido, resistente a forca bruta).
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    """Gera hash bcrypt de uma senha em texto puro."""
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Compara senha em texto puro com o hash armazenado."""
    return pwd_context.verify(plain, hashed)


def create_access_token(subject: Any) -> str:
    """
    Gera um JWT de acesso assinado com SECRET_KEY/ALGORITHM do .env.
    subject: normalmente o user_id (serializavel).
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": str(subject), "exp": expire}
    return jwt.encode(payload, config.SECRET_KEY, algorithm=config.ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Decodifica/valida um JWT. Retorna payload ou None se invalido/expirado."""
    try:
        return jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
    except Exception:
        return None
