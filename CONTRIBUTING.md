# Contribuição e GitFlow

## Branches principais
- `main` — código em produção
- `develop` — integração de features
- `feature/<nome>` — desenvolvimento de funcionalidade
- `release/x.y.z` — preparação de release
- `hotfix/x.y.z` — correções emergenciais

## Fluxo (exemplo rápido)
1. Criar branch de feature a partir de `develop`:
```bash
git checkout develop
git checkout -b feature/nome-da-feature
```
2. Fazer commits semânticos (veja abaixo).
3. Abrir Pull Request `feature/...` → `develop`.
4. Quando `develop` estiver pronto, criar `release/x.y.z`, revisar, testar e merge em `main` com tag `vX.Y.Z`.

## Commits semânticos (recomendado)
Formato:
```
tipo(escopo): descrição curta
```
Tipos mais usados:
- `feat:` nova funcionalidade
- `fix:` correção
- `docs:` documentação
- `style:` formatação/semântica
- `refactor:` refatoração
- `chore:` tarefas de manutenção

Exemplo:
```
feat(nav): adicionar navegação por teclado
fix(contrast): garantir contraste 4.5:1 nos botões
```

## Pull Request
- Título: `feat(scope): descrição curta`
- Descrição: explique o que foi feito, por que, screenshots e passos para testar.
- Vincule issues relacionadas (`Closes #12`).

## Issues e Milestones
- Use labels: `bug`, `feature`, `enhancement`, `accessibility`, `docs`.
- Crie milestones para cada entrega (ex: `Entrega Final`).

