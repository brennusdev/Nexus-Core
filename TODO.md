# TODO — Implementação das melhorias solicitadas

## Objetivos
1. 📊 **Visão Geral**: legibilidade + encaixe com o gráfico radar (legenda interativa + contraste dos rótulos).
2. 🎯 **Meta do Mês**: CRUD (adicionar, editar, remover) com categorias demarcadas (Desenvolvimento Pessoal, Networking, Hobbie, Outros) e persistência em localStorage.
3. 🧠 **Second Brain**: nova aba navegável com Painel de Insights IA (resumo diário, recomendações, tendências, alertas) e Notas.

## Etapas
- [x] **Passo 1**: Editar `Frontend/dashboard.html`
  - Legenda interativa no widget de Visão Geral: implementada.
  - Widget Meta do Mês (categorias + CRUD): implementado.
- [x] **Passo 2**: Editar `Frontend/dashboard.css`
  - Estilos da legenda, rótulos do radar com contraste, e componentes do Meta do Mês: implementados.
- [x] **Passo 3**: Editar `Frontend/js/dashboard.js`
  - Lógica de legenda da Visão Geral: implementada.
  - Lógica CRUD das metas com localStorage: implementada.
  - Assistente contextualizado com dados reais do usuário (tarefas, metas): implementado.
- [x] **Passo 4**: Editar `Frontend/app.html`
  - Renderizador do módulo `second-brain` com abas (Painel de Insights IA + Notas): implementado.
  - Insights gerados a partir dos dados reais do localStorage (tarefas, metas, notas): implementado.
  - Correção do botão "fixar nota" no Second Brain: implementada.
  - `APP_META` do second-brain atualizado.
- [x] **Passo 5**: Validar sintaxe/balanceamento e testar.
