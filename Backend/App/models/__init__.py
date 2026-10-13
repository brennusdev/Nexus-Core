# Pacote de models do Nexus Core.
# MOTIVO: Sem este __init__.py, `App.models.user` pode falhar em algumas
#         ferramentas (Alembic, autodiscovery do SQLAlchemy) mesmo que o
#         Python 3 trate namespace packages. Padroniza como pacote real.
