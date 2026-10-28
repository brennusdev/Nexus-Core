# 🚀 Nexus Core

> Plataforma pessoal de inteligência, produtividade e desenvolvimento contínuo.

## 📌 Sobre o Projeto

O **Nexus Core** é uma plataforma desenvolvida para centralizar, monitorar e analisar o desenvolvimento pessoal e profissional do usuário.

O sistema transforma atividades como **estudos, projetos, hábitos, metas, exercícios, leituras e outras atividades** em dados organizados, permitindo acompanhar métricas, identificar padrões de desempenho e visualizar a evolução ao longo do tempo.

A proposta é transformar o desenvolvimento diário em um processo **mensurável, analisável e orientado por dados**.

---

## 🎯 Objetivo

O Nexus Core foi criado para responder a três perguntas principais:

* **O que estou fazendo?**
* **Como estou evoluindo?**
* **O que deveria priorizar agora?**

Em vez de funcionar apenas como uma lista de tarefas, o Nexus utiliza os dados registrados pelo usuário para gerar uma visão integrada de sua evolução.

---

## 🧠 Principais Funcionalidades

### 📊 Dashboard

Centralização dos principais indicadores do sistema:

* Progresso diário
* Metas
* Hábitos
* Atividades recentes
* Projetos
* Estatísticas
* Conquistas
* Alertas

### 📈 Analytics

Sistema de análise responsável por transformar os dados registrados em indicadores de desempenho.

Exemplos:

* Consistência
* Produtividade
* Evolução semanal
* Evolução mensal
* Taxa de conclusão
* Streaks
* Comparação entre períodos
* Tendências de desempenho

### 🎯 Goals

Gerenciamento de objetivos de curto, médio e longo prazo.

Cada objetivo pode possuir:

* Descrição
* Prazo
* Prioridade
* Status
* Progresso
* Histórico
* Métricas relacionadas

### 🔄 Habits

Sistema de acompanhamento de hábitos e consistência.

Exemplos:

* Estudos
* Leitura
* Exercícios
* Idiomas
* Desenvolvimento de projetos
* Revisões

### 🗂️ Projects

Gerenciamento dos projetos em desenvolvimento, permitindo acompanhar:

* Status
* Progresso
* Tecnologias
* Tarefas
* Histórico de desenvolvimento
* Atualizações
* Métricas

### 🔔 Intelligent Notifications

Sistema responsável por identificar eventos importantes e gerar notificações.

Exemplos:

* Metas próximas do vencimento
* Hábitos interrompidos
* Atividades atrasadas
* Conquistas desbloqueadas
* Mudanças relevantes nas métricas

### ⚡ Command Palette

Sistema de acesso rápido através de comandos.

Atalho planejado:

`Ctrl + K`

Permite pesquisar rapidamente:

* Projetos
* Tarefas
* Hábitos
* Metas
* Notas
* Configurações
* Módulos

### 🎯 Focus Mode

Modo destinado à concentração.

Ao ser ativado, o sistema reduz informações secundárias e destaca apenas:

* Tarefa atual
* Objetivo
* Cronômetro
* Progresso
* Informações essenciais

### 🏆 Achievement System

Sistema de conquistas baseado na evolução do usuário.

Exemplos:

* Primeiro projeto concluído
* 7 dias consecutivos
* 30 dias consecutivos
* Primeira meta concluída
* 100 atividades realizadas
* Determinado número de commits

### 🧠 AI Insights

Camada de inteligência responsável por analisar os dados do sistema e produzir insights.

Exemplos:

* Resumo diário
* Tendências
* Recomendações
* Alertas
* Identificação de padrões
* Sugestões de prioridades

### 🕒 Activity Timeline

Histórico cronológico das atividades realizadas.

Pode registrar:

* Estudos
* Projetos
* Commits
* Exercícios
* Leituras
* Hábitos
* Metas concluídas
* Conquistas

### 🩺 System Health

Centro de monitoramento da aplicação.

Permite acompanhar:

* API
* Banco de dados
* Serviços
* Integrações
* Jobs
* Logs
* Status da aplicação

---

## 🏗️ Arquitetura

O projeto foi estruturado visando separação de responsabilidades e possibilidade de evolução.

```text
Nexus Core/
├── Frontend/              # Site estático multipágina (HTML, CSS e JavaScript)
│   ├── index.html         # Entrada do site
│   └── js/
│       ├── config.js      # URL da API
│       ├── app.js         # Login e cadastro
│       └── ...
├── Backend/               # API FastAPI, persistência e autenticação
│   ├── App/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   └── migrations/        # Migrações Alembic
├── docs/
├── docker-compose.yaml
└── vercel.json            # Publica Frontend/ como diretório estático
```

O frontend e a API são deploys separados: o Vercel publica somente os arquivos estáticos em `Frontend/`; o FastAPI e o PostgreSQL precisam ser hospedados/configurados separadamente.

---

## 🛠️ Tecnologias

### Backend

* Python
* API REST
* FastAPI
* Pydantic

### Frontend

* HTML5
* CSS3
* JavaScript

### Database

* SQL
* PostgreSQL

### DevOps

* Docker
* Docker Compose
* Git
* GitHub

### Qualidade e observabilidade

* Pytest
* Logging
* Health Checks
* Métricas
* Monitoramento

### Inteligência Artificial

* Integração com modelos de IA
* Geração de insights
* Análise de dados
* Recomendações personalizadas

---

## 📊 Métricas

O Nexus Core trabalha com métricas para transformar atividades em indicadores objetivos.

### Produtividade

* Atividades concluídas
* Taxa de conclusão
* Tempo dedicado
* Atividades atrasadas

### Consistência

* Streak atual
* Melhor streak
* Frequência de hábitos
* Dias ativos

### Desenvolvimento

* Projetos ativos
* Projetos concluídos
* Tecnologias utilizadas
* Evolução por período

### Metas

* Metas concluídas
* Metas em andamento
* Metas atrasadas
* Percentual médio de progresso

---

## 🔐 Segurança

O projeto considera desde sua arquitetura inicial aspectos relacionados à segurança:

* Autenticação
* Autorização
* Validação de dados
* Proteção de informações
* Controle de acesso
* Variáveis de ambiente
* Gerenciamento seguro de credenciais

---

## 🧪 Testes

A aplicação utiliza testes automatizados para validar seus principais componentes.

```text
tests/
├── unit/
├── integration/
└── e2e/
```

O objetivo é reduzir regressões e aumentar a confiabilidade da aplicação conforme novas funcionalidades são adicionadas.

---

## 🐳 Docker

O projeto utiliza Docker para facilitar a padronização do ambiente de desenvolvimento.

```bash
docker compose up --build
```

Isso permite executar os principais serviços do projeto utilizando um ambiente reproduzível.

## 🚀 Deploy do frontend na Vercel

Importe o repositório na Vercel usando a raiz do projeto como **Root Directory** (não selecione `Backend/`). O `vercel.json` desativa a detecção automática de frameworks, desativa o comando de build e define `Frontend/` como diretório de saída; como essa pasta contém `index.html`, a URL raiz passa a abrir a tela de login em vez de retornar `NOT_FOUND` ou procurar `App/main.py` na raiz.

Se o projeto Vercel já existir, confirme em **Settings → Build and Deployment** que **Root Directory** é a raiz do repositório. O `vercel.json` força o preset **Other**; não configure o projeto como FastAPI.

A Vercel publica apenas o frontend. Para login e cadastro funcionarem em produção:

1. Hospede o backend FastAPI e o PostgreSQL em serviços compatíveis.
2. Em `Frontend/js/config.js`, troque `http://localhost:8000` pela URL pública da API e faça um novo deploy.
3. Configure `CORS_ORIGINS` no backend com a origem exata do domínio Vercel (incluindo `https://`).

O endereço `localhost` é apenas para desenvolvimento local; ele aponta para o computador de cada visitante quando usado pelo navegador em produção.

---

## 📚 Documentação

A documentação do projeto será mantida em:

```text
docs/
```

Incluindo:

* Arquitetura
* API
* Banco de dados
* Decisões técnicas
* Fluxos
* Configuração
* Guia de desenvolvimento

---

## 🗺️ Roadmap

### Phase 1 — Foundation

* [x] Estrutura inicial
* [x] Dashboard
* [x] Perfil
* [x] Hábitos
* [x] Metas
* [x] Analytics

### Phase 2 — Productivity

* [ ] Command Palette
* [ ] Focus Mode
* [ ] Timeline
* [ ] Sistema de notificações
* [ ] Achievement System

### Phase 3 — Intelligence

* [ ] AI Insights
* [ ] Nexus Assistant
* [ ] Recomendações personalizadas
* [ ] Análise preditiva

### Phase 4 — Engineering

* [ ] Testes automatizados
* [ ] CI/CD
* [ ] Observabilidade
* [ ] Health Center
* [ ] Monitoramento
* [ ] Otimização de performance

### Phase 5 — Scale

* [ ] Arquitetura preparada para escala
* [ ] Cache
* [ ] Processamento assíncrono
* [ ] Filas
* [ ] Microsserviços quando necessário

---

## 💡 Filosofia

O Nexus Core foi construído sobre uma ideia simples:

> **Evolução que não é medida dificilmente pode ser analisada.**

O objetivo não é transformar produtividade em uma competição permanente, mas criar um sistema capaz de fornecer **visibilidade sobre o processo de desenvolvimento**.

---

## 📌 Status

🚧 **Em desenvolvimento**

O Nexus Core é um projeto em evolução contínua. Novas funcionalidades, melhorias arquiteturais e experimentos tecnológicos são adicionados progressivamente.

---

## 👨‍💻 Autor

Desenvolvido como projeto de estudo e portfólio em engenharia de software.

**Nexus Core — Build. Measure. Analyze. Evolve.**
