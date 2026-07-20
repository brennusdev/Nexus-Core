"""Cadastro de usuário - corrige importações relativas quando o módulo
estiver dentro de um package e fornece mensagens de erro claras se
dependências estiverem ausentes.
"""

import importlib

try:
    fastapi = importlib.import_module("fastapi")
    FastAPI = fastapi.FastAPI
    Form = fastapi.Form
except ImportError:  # pragma: no cover
    raise ImportError("FastAPI não está instalado. Instale com: pip install fastapi")


def _import_database_connector():
    try:
        if __package__:
            database = importlib.import_module(".database", package=__package__)
        else:
            raise ImportError
    except ImportError:
        try:
            database = importlib.import_module("database")
        except ImportError:  # pragma: no cover
            raise ImportError("Módulo 'database' não encontrado. Verifique database.py e PYTHONPATH")
    return database.conectar


conectar = _import_database_connector()

app = FastAPI()


@app.post("/cadastro")
def cadastro(nome: str = Form(...), senha: str = Form(...)):
    """Insere um usuário na base de dados.

    Usa conectar() do módulo database para obter uma conexão.
    """
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO usuarios(nome, senha) VALUES(?,?)", (nome, senha))
    conn.commit()
    conn.close()

    return {"msg": "Usuário cadastrado"}