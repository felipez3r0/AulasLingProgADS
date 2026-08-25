# projeto-base — aula10

## Como rodar

```bash
npm install
npm test
```

Usa um arquivo SQLite temporário (`test/teste.db`, recriado a cada teste
e ignorado pelo Git) via `@libsql/client` com `file:`. Em produção, a
mesma função `criarClienteDb` aponta para o Turso trocando só a
variável de ambiente `DATABASE_URL` (e `DATABASE_AUTH_TOKEN`) — nenhum
código muda entre os dois ambientes.
