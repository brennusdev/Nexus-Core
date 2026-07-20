try:
    from fastapi import FastAPI, Form, HTTPException  # type: ignore[import]
except ImportError as exc:
    raise ImportError(
        "O pacote 'fastapi' não está instalado. Instale-o com 'pip install fastapi'."
    ) from exc

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "usuarios.db"


def conectar():
    return sqlite3.connect(DB_PATH)


app = FastAPI()


@app.post("/cadastro")
def cadastro(
    nome: str = Form(...),
    senha: str = Form(...)
):
    conn = conectar()

    try:
        cursor = conn.cursor()

        # Verifica se o usuário já existe
        cursor.execute(
            "SELECT id FROM usuarios WHERE nome = ?",
            (nome,)
        )

        if cursor.fetchone():
            raise HTTPException(
                status_code=400,
                detail="Usuário já cadastrado."
            )

        cursor.execute(
            "INSERT INTO usuarios(nome, senha) VALUES (?, ?)",
            (nome, senha)
        )

        conn.commit()

        return {
            "msg": "Usuário cadastrado com sucesso!"
        }

    finally:
        conn.close()


@app.post("/login")
def login(
    nome: str = Form(...),
    senha: str = Form(...)
):
    conn = conectar()

    try:
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM usuarios WHERE nome = ? AND senha = ?",
            (nome, senha)
        )

        usuario = cursor.fetchone()

        if not usuario:
            raise HTTPException(
                status_code=401,
                detail="Usuário ou senha inválidos."
            )

        return {
            "status": "ok",
            "msg": "Login realizado com sucesso!"
        }

    finally:
        conn.close()