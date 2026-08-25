# Aula 10 - Persistência com SQLite (libSQL): padrão repository

**Modo de IA: Par** — você revisa o SQL/código gerado (injeção, parâmetros, tipos).

## Objetivos da Aula

- TODO (Fase 3): definir objetivos como "saber fazer" — ex.: revisar código de acesso a dados gerado por IA quanto a segurança (injeção de SQL) e tipagem; configurar `@libsql/client` para rodar com `file:` em dev e Turso em produção via variável de ambiente.

## Leitura prévia

- TODO (Fase 3)

## Conteúdo

- TODO (Fase 3): `@libsql/client` (não `better-sqlite3` nem `node:sqlite`, para que o mesmo código rode local e no Turso); padrão repository.

## Atividades em sala

- TODO (Fase 3)

## Exercícios para casa

- TODO (Fase 3)

## Critério de entrega

- TODO (Fase 3)

---

> Nota de reescrita: a forma do repository (assinaturas de `listarTodos`/`buscarPorId`/`criar`/`atualizar`/`remover`) pode ser herdada do `aluno-repository.ts` da antiga `aula13-express-crud-middlewares` (removida desta branch — ver histórico do Git anterior ao commit de reestruturação), trocando a implementação de `fs`/JSON por `@libsql/client`. Ver plano em `/Users/felipe/.claude/plans/users-felipe-downloads-readme-1-md-esto-rosy-hejlsberg.md`, Fase 3.
