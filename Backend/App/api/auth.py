# ====================================================================
# NEXUS CORE - Router de Autenticacao (App/api/auth.py)
# ====================================================================
# Responsabilidade: expor POST /auth/register e POST /auth/login.
# Regra: routers apenas orquestram (validam via schemas, chamam services,
#         acessam o banco via Depends(get_db)). Sem regra de negocio aqui.
# ====================================================================
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from App.core.database import get_db
from App.models.user import User
from App.schemas.user import Token, UserLogin, UserOut, UserRegister
from App.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais invalidas ou expiradas.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not credentials:
        raise credentials_error

    payload = auth_service.decode_access_token(credentials.credentials)
    subject = payload.get("sub") if isinstance(payload, dict) else None
    if not isinstance(subject, str) or not subject.isascii() or not subject.isdigit():
        raise credentials_error

    user = db.query(User).filter(User.id == int(subject)).first()
    if not user:
        raise credentials_error
    return user


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
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="E-mail ja cadastrado.",
        ) from exc
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


@router.get(
    "/me",
    response_model=UserOut,
    summary="Retorna o usuario autenticado",
)
def current_user(user: User = Depends(get_current_user)) -> User:
    return user
