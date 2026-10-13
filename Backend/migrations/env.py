from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# ====================================================================
# NEXUS CORE - Integracao do Alembic com o projeto
# MOTIVO: env.py padrao nao sabe onde estao o .env nem os models.
#         1) Garante que a raiz do Backend esteja no sys.path (import
#            App.* funciona rodando alembic de qualquer lugar).
#         2) Injeta DATABASE_URL do .env no sqlalchemy.url do alembic.ini.
#         3) Aponta target_metadata para o Base.metadata dos models
#            (necessario para autogenerate detectar a tabela users).
# ====================================================================
import os
import sys

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import App.core.config as app_config  # noqa: E402  (carrega o .env)
import App.models.user  # noqa: E402,F401  (registra as tabelas)
from App.core.database import Base  # noqa: E402

config = context.config

# Sobrepoem sqlalchemy.url com a DATABASE_URL real do .env.
if app_config.DATABASE_URL:
    config.set_main_option("sqlalchemy.url", app_config.DATABASE_URL)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
