# Acessibilidade (WCAG 2.1 — Nível AA)

Este documento descreve as ações tomadas para atingir conformidade WCAG 2.1 AA.

## 1) Navegação por teclado
- Todos os controles interativos são foco-navegáveis (`tabindex` apenas quando necessário).
- Ordem de foco segue a ordem visual.
- States de foco visíveis (ex.: outline claro).

## 2) Estrutura semântica
- Uso apropriado de tags semânticas: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`.
- Títulos hierárquicos (`h1`→`h2`→...).

## 3) Contraste
- Texto normal: contraste mínimo 4.5:1.
- Texto grande (>=18pt ou 14pt em negrito): contraste mínimo 3:1.
- Ferramentas sugeridas: Lighthouse, WebAIM Contrast Checker.

## 4) Leitores de tela
- Atributos ARIA apenas quando semântica nativa não for suficiente (ex.: `role="dialog"`, `aria-expanded`, `aria-controls`).
- Imagens: `alt` significativas; ícones decorativos com `alt=""` ou `role="presentation"`.

## 5) Modo escuro e alto contraste
- Suporte via classes (`.dark`, `.high-contrast`) e preferências do usuário.
- Alternador com persistência (localStorage) e controle por teclado.

## 6) Testes sugeridos
- Navegação completa por teclado (sem mouse).
- Teste com NVDA (Windows) e VoiceOver (macOS).
- Lighthouse (Accessibility), axe-core e WAVE.

## 7) Checklist rápido
- [ ] Todas as imagens têm `alt`.
- [ ] Todos os controles têm labels/aria-labels.
- [ ] Ordem de leitura lógica.
- [ ] Contraste >= 4.5:1.
- [ ] Modo escuro e alto contraste implementados.

