# Template de scaffolding

Modelo-base reaproveitado por toda aula que precisa de código executável
(aulas 06, 09, 10, 11, 13-14): `package.json` + `tsconfig.json` + `src/` +
`test/`, com **Vitest** como test runner/framework.

## Como rodar

```bash
npm install
npm test
```

## Convenção

- `src/`: esqueleto tipado da aula (às vezes só assinaturas/stubs; às vezes o contrato já pronto).
- `test/`: testes em Vitest (`describe`/`it`/`expect`), arquivo `*.test.ts`.
- Script `npm test` roda `vitest run` (execução única, sem watch — adequado para verificação em aula/CI).
- Cada `projeto-base/` de aula é autocontido: própria instalação, próprio `npm test`. Não há `package.json`/`vitest.config.ts` compartilhado na raiz do repositório — uma pasta de aula deve funcionar isolada se copiada/zipada.
