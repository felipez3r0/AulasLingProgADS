# Especificação para o agente — exercício 3

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-maquina
npm run typecheck
```

## O agente PODE alterar

- `aula08-estruturas-e-tipos-proprios/exercicios/03-maquina-de-estados.ts`

## O agente NÃO PODE alterar

- `01-estados-impossiveis.ts` (o tipo `Pedido` é o seu, do exercício 1)
- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula08-estruturas-e-tipos-proprios/`

## Restrições

- [ ] A função **não lança exceção**: falha é valor de retorno
- [ ] A função não modifica o pedido recebido
- [ ] Sem dependências novas

## Contexto que o agente deve ler antes

- `aula08-estruturas-e-tipos-proprios/exercicios/03-maquina-de-estados.test.ts`
- `aula08-estruturas-e-tipos-proprios/exercicios/01-estados-impossiveis.ts`
- `AGENTS.md`

---

## Depois: sua revisão

Este exercício depende do tipo que **você** modelou no exercício 1. Se o seu tipo
estiver frouxo, o agente vai conseguir escrever código que compila e está errado.
Se estiver fechado, o compilador barra o agente antes de você precisar revisar.

Rode `git diff` e responda:

1. Ele usou `throw` em algum lugar? A especificação proíbe.
2. Como ele tratou "enviado + qualquer evento"? Enumerou caso a caso ou usou um
   `default`?
3. Ao construir o estado `enviado`, ele preservou `dataPagamento` do estado `pago`?
4. O que você mudaria antes de aprovar?
