# ====================================================================
# CORRECAO: __init__.py - Adicionados imports dos modulos core
# MOTIVO: O arquivo estava VAZIO. Sem os imports aqui, outros modulos
#         nao conseguem fazer `from App.core import DATABASE_URL`
#         ou `from App.core import Base, engine, SessionLocal, get_db`.
# ====================================================================

# CORRECAO: ADICIONADO - Import das configuracoes do config.py
# MOTIVO: Permite acesso direto via from App.core import DATABASE_URL, SECRET_KEY, etc.
from App.core.config import DATABASE_URL, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# CORRECAO: ADICIONADO - Import da infraestrutura do database.py
# MOTIVO: Permite acesso direto via from App.core import Base, engine, SessionLocal, get_db
from App.core.database import Base, engine, SessionLocal, get_db
