# NEXUS CORE — Unificação do Design System

## Etapas do Plano

- [x] 0. Análise da arquitetura atual (cores.css, dashboard.css, dashboard.html, app.html, music.html, JS)
- [ ] 1. Unificar tokens em `cores.css` (fonte, cores, espaçamento, raios, sombras, dark theme)
  - [ ] Adicionar tokens ausentes (`--color-text-primary`, `--color-text-secondary`, `--color-sidebar`, `--font-size-base`, line-heights, z-index, layout)
  - [ ] Aliases de compatibilidade (`--color-text`, `--color-text-soft`, `--font-size-md`, `--radius`)
  - [ ] Adicionar bloco `[data-theme="dark"]` global
  - [ ] Corrigir `--color-error` → `--color-danger`
  - [ ] Alinhar `--color-background` com dashboard.css
- [ ] 2. Cards mais quadrados: `--radius-lg` 16px → 12px (dashboard.css + cores.css)
- [ ] 3. Corrigir `app.html` (tokens legados inexistentes → tokens canônicos)
- [ ] 4. Corrigir `music.html` (tokens legados inexistentes + `--color-primary-dark` → `--color-primary-hover`)
- [ ] 5. Corrigir JS: `var(--color-error)` → `var(--color-danger)` (dashboard.js + app.js)
- [ ] 6. Atualizar comentários do design system (radius 16px → 12px)
- [ ] 7. Testar visualmente no navegador

