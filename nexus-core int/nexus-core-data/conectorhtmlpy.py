from fastapi import FastAPI, Form  # type: ignore[reportMissingImports]

app = FastAPI()


@app.post("/cadastro")
def cadastro(
    nome: str = Form(...),
    senha: str = Form(...)
):

    print(nome)
    print(senha)

    return {
        "mensagem": "Usuário cadastrado"
    }