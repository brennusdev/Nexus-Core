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
| 1 | `Frontend/index.html` | Login redesenhado SEM foto + modo escuro | ✅ |
| 2 | `Frontend/cores.css` | Variáveis + estilos de autenticação + dark mode | ✅ |
| 3 | `Frontend/js/app.js` | Validação + redirecionamento + toggle tema | ✅ |
| 4 | `Frontend/dashboard.html` | Dashboard reestruturado (faixas + sidebar completa) | ✅ |
| 5 | `Frontend/dashboard.css` | Estilos + dark mode | ✅ |
| 6 | `Frontend/js/dashboard.js` | Relógio, calendário, tema, widgets, música | ✅ |
| 7 | `Frontend/app.html` | Página genérica de ferramentas/sistema | ✅ |
| 8 | `Frontend/music.html` | Configuração de serviços de música | ✅ |
| 9 | `Frontend/js/music.js` | Lógica de vínculo dos serviços | ✅ |

## 📌 Funcionalidades implementadas
- **Modo escuro** 🌙: toggle no login e no dashboard (persistido em localStorage)
- **Navbar completa**: Acesso Rápido (Life OS, Cyber Desk, Code Vault, Second Brain, Project Generator, Analytics Center, Automation Hub) + FERRAMENTAS (Terminal, Database, Api Hub, Snippets, File Manager, Notas Rápidas) + SISTEMA (Configurações, Temas, Perfil, Segurança, Backup & Restore)
- **Layout**: saudação compacta + foco/tarefas/estudos/metas/hora na mesma faixa; calendário abaixo da hora com botão de adicionar; "Widgets Rápidos" em mini gradientes
- **Música**: player no dashboard + página de configuração para vincular YouTube/Spotify/Deezer/SoundCloud

## 📌 Como executar
1. **Backend:** `cd Backend && uvicorn App.main:app --reload`
2. **Frontend:** abrir `Frontend/index.html` no navegador
