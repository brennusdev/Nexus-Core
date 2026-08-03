# TODO - Correção de Erros de Sintaxe

## ✅ Status dos Backend Fixes

| # | Arquivo | Correcao | Status |
|---|---------|----------|--------|
| 1 | `docker-compose/yaml` → `docker-compose.yaml` | Arquivo YAML valido na raiz, `build` corrigido | ✅ |
| 2 | `Backend/dockerfile` | `CMD` corrigido: `app.main:app` → `App.main:app` | ✅ |
| 3 | `Backend/requirements.txt` | Versões corrigidas (jose 3.3.0, pydantic 2.13.4, uvicorn 0.34.0) | ✅ |
| 4 | `Backend/App/core/__init__.py` | Imports adicionados (estava vazio) | ✅ |
| 5 | `Backend/App/core/database.py` | engine, SessionLocal, Base e get_db() adicionados | ✅ |
| 6 | `Backend/App/models/user.py` | Import corrigido: `app.core` → `App.core` | ✅ |

## ✅ Frontend - Reestruturação

| # | Arquivo | Correcao | Status |
|---|---------|----------|--------|
| 1 | `Frontend/index.html` | Página criada com login/registro Nexus Core | ✅ |
| 2 | `Frontend/cores.css` | Reorganizado: `:root` com variáveis, sem duplicações, seções comentadas | ✅ |
| 3 | `Frontend/js/app.js` | Interatividade: tabs, validação, loader | ✅ |

## 📌 Como executar

1. **Backend:** `cd Backend && uvicorn App.main:app --reload`
2. **Frontend:** abrir `Frontend/index.html` no navegador

