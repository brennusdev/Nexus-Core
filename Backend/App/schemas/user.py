# ====================================================================
# NEXUS CORE - Schemas Pydantic de Usuario / Autenticacao
# ====================================================================
# Responsabilidade: validar payloads de entrada e formatar respostas.
# MOTIVO: A API nunca deve aceitar/retornar o model SQLAlchemy direto
#         (exporia a coluna 'password'). Schemas separam as camadas.
# ====================================================================
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------- Entrada (request bodies) ----------

class UserRegister(BaseModel):
    """Payload de POST /auth/register."""
    name: str = Field(min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=255)


class UserLogin(BaseModel):
    """Payload de POST /auth/login."""
    email: EmailStr
    password: str = Field(min_length=1)


# ---------- Saida (responses) ----------

class UserOut(BaseModel):
    """Dados seguros do usuario (NUNCA expoe o hash da senha)."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    created_at: datetime


class Token(BaseModel):
    """Resposta de POST /auth/login (JWT de acesso)."""
    access_token: str
    token_type: str = "bearer"
    user: UserOut
