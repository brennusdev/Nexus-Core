# TODO — Implementação das melhorias solicitadas

## Objetivos
1. 📊 **Visão Geral**: legibilidade + encaixe com o gráfico radar (legenda interativa + contraste dos rótulos).
2. 🎯 **Meta do Mês**: CRUD (adicionar, editar, remover) com categorias demarcadas (Desenvolvimento Pessoal, Networking, Hobbie, Outros) e persistência em localStorage.
3. 🧠 **Second Brain**: nova aba navegável com Painel de Insights IA (resumo diário, recomendações, tendências, alertas) e Notas.

## Etapas
- [ ] **Passo 1**: Editar `Frontend/dashboard.html`
  - Adicionar legenda interativa no widget de Visão Geral.
  - Reformular o widget Meta do Mês (categorias + CRUD).
- [ ] **Passo 2**: Editar `Frontend/dashboard.css`
  - Estilos da legenda, rótulos do radar com contraste, e componentes do Meta do Mês (categorias/CRUD).
- [ ] **Passo 3**: Editar `Frontend/js/dashboard.js`
  - Lógica de legenda da Visão Geral.
  - Lógica CRUD das metas com localStorage.
- [ ] **Passo 4**: Editar `Frontend/app.html`
  - Renderizador do módulo `second-brain` com abas (Painel de Insights IA + Notas).
  - Atualizar `APP_META` do second-brain.
- [ ] **Passo 5**: Validar sintaxe/balanceamento e testar.

