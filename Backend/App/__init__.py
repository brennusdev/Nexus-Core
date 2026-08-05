# ====================================================================
# CORRECAO: App/__init__.py - Adicionado para tornar "App" um pacote
# MOTIVO: Sem este arquivo, o diretorio "App" nao e reconhecido como
#         um pacote Python valido. Isso quebra imports como:
#         from App.core.config import DATABASE_URL
#         from App.models.user import User
#         em ambientes Linux (Docker/producao).
# ====================================================================
