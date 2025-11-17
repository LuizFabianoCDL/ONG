# Processo de Release e Versionamento Semântico

Usamos SemVer: `MAJOR.MINOR.PATCH`

- **MAJOR**: mudanças incompatíveis com versões anteriores.
- **MINOR**: funcionalidades compatíveis com versões anteriores.
- **PATCH**: correções e pequenas melhorias.

## Passos para criar uma release
1. Garantir que `develop` esteja estável e todas as features mescladas.
2. Criar branch `release/x.y.z`:
```bash
git checkout develop
git checkout -b release/1.0.0
```
3. Atualizar `CHANGELOG.md` e `package.json` (`version`).
4. Abrir PR `release/x.y.z` → `main`, solicitar revisão.
5. Após aprovação, merge em `main` e criar tag:
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```
6. Merge `main` em `develop` para sincronizar.

