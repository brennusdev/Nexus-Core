# TODO - Nexus Core (Backend + Frontend)

## ✅ Backend Fixes
| # | Arquivo | Correcao | Status |
|---|---------|----------|--------|
| 1 | `docker-compose.yaml` | YAML valido na raiz, `build` corrigido | ✅ |
| 2 | `Backend/dockerfile` | `app.main:app` → `App.main:app` | ✅ |
| 3 | `Backend/requirements.txt` | Versoes corrigidas | ✅ |
| 4 | `Backend/App/core/__init__.py` | Imports adicionados | ✅ |
| 5 | `Backend/App/core/database.py` | engine, SessionLocal, Base, get_db | ✅ |
| 6 | `Backend/App/models/user.py` | Import case-sensitive corrigido | ✅ |

## ✅ Frontend - Fase 2 (Login + Dashboard)
| # | Arquivo | Tarefa | Status |
|---|---------|--------|--------|
| 1 | `Frontend/index.html` | Login redesenhado SEM foto do produto | ✅ |
| 2 | `Frontend/cores.css` | Variáveis + estilos de autenticação | ✅ |
| 3 | `Frontend/js/app.js` | Validação + redirecionamento pós-login | ✅ |
| 4 | `Frontend/dashboard.html` | Dashboard com sidebar + 29 grades | ✅ |
| 5 | `Frontend/dashboard.css` | Estilos do dashboard | ✅ |
| 6 | `Frontend/js/dashboard.js` | Relógio, calendário, pomodoro, widgets | ✅ |

## 📌 Como executar
1. **Backend:** `cd Backend && uvicorn App.main:app --reload`
2. **Frontend:** abrir `Frontend/index.html` no navegador
