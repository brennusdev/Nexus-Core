# ====================================================================
# NEXUS CORE - Router de Autenticacao (App/api/auth.py)
# ====================================================================
# Responsabilidade: expor POST /auth/register e POST /auth/login.
# Regra: routers apenas orquestram (validam via schemas, chamam services,
#         acessam o banco via Depends(get_db)). Sem regra de negocio aqui.
# ====================================================================
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from App.core.database import get_db
from App.models.user import User
from App.schemas.user import Token, UserLogin, UserOut, UserRegister
from App.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Cria uma nova conta de usuario",
)
def register(payload: UserRegister, db: Session = Depends(get_db)) -> User:
    """
    Cadastro de usuario.
    - Valida payload via UserRegister (Pydantic).
    - Verifica e-mail unico (409 se duplicado).
    - Salva com hash bcrypt (nunca senha em texto puro).
    """
    exists = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )
    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="E-mail ja cadastrado.",
        )

    user = User(
        name=payload.name,
        email=payload.email,
        password=auth_service.hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post(
    "/login",
    response_model=Token,
    summary="Autentica um usuario e retorna JWT",
)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    """
    Login.
    - Credenciais invalidas retornam 401 (mensagem generica por seguranca:
      nao revelar se o e-mail existe ou se a senha esta errada).
    - Sucesso retorna JWT + dados seguros do usuario.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not auth_service.verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha invalidos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_service.create_access_token(subject=user.id)
    return Token(access_token=token, user=UserOut.model_validate(user))
