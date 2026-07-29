# TODO - Correção de Erros de Sintaxe

## ✅ Concluído
- [ ] 1. Criar `docker-compose.yaml` na raiz (corrigir estrutura de pasta)
- [ ] 2. Corrigir `Backend/dockerfile` — caminho `app.main` → `App.main`
- [ ] 3. Corrigir `Backend/requirements.txt` — versões incorretas
     - `python-jose[cryptography]==3.5.0` → `3.3.0`
     - `pydantic[email]==2.11.7` → `2.13.4`
     - `uvicorn[standard]==0.35.0` → `0.34.0`
- [ ] 4. Popular `Backend/App/core/__init__.py` — adicionar imports
- [ ] 5. Corrigir `Backend/App/core/database.py` — adicionar engine SQLAlchemy
- [ ] 6. Testar validação das correções

