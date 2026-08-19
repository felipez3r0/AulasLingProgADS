# Especificação para o agente — exercício 3

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-api-biblioteca
npm run typecheck
```

## O agente PODE alterar

- `aula13-http-rest-e-express/exercicios/03-api-biblioteca.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula13-http-rest-e-express/`

## Restrições

- [ ] Status HTTP corretos: 4xx para erro do cliente, 5xx só para falha do servidor
- [ ] Nenhuma rota devolve 200 para recurso inexistente
- [ ] Sem dependências novas (Express e supertest já estão instalados)

## Contexto que o agente deve ler antes

- `aula13-http-rest-e-express/exercicios/03-api-biblioteca.test.ts`
- `aula13-http-rest-e-express/exemplos/api/app.ts` (o padrão de `criarApp`)
- `AGENTS.md`

---

## Depois: sua revisão

Esta API tem **estado compartilhado entre dois recursos**: emprestar um livro muda
o livro. É onde a consistência costuma escapar.

Rode `git diff` e responda:

1. Ao criar um empréstimo, ele marca o livro como indisponível **na mesma
   operação**? E ao devolver, volta a marcar disponível?
2. A ordem das validações no `POST /emprestimos` bate com a especificação?
   (Livro inexistente é 404; indisponível é 409 — inverter muda a resposta.)
3. Ele contou "empréstimos ativos" corretamente, ou contou o histórico todo?
4. Alguma rota devolve 500 para erro do cliente?
5. O que você mudaria antes de aprovar?
