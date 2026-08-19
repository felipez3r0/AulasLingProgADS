# Especificação para o agente — exercício 3

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-carrinho
```

## O agente PODE alterar

- `aula07-vetores-e-referencia/exercicios/03-carrinho-compartilhado.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula07-vetores-e-referencia/`

## Restrições

- [ ] Nada dentro do carrinho devolvido pode ser compartilhado com o original
- [ ] Cópia rasa (`[...itens]`) **não** basta: os itens são objetos
- [ ] Sem dependências novas

## Contexto que o agente deve ler antes

- `aula07-vetores-e-referencia/exercicios/03-carrinho-compartilhado.test.ts`
- `AGENTS.md`

---

## Depois: sua revisão

Este é o exercício em que o aliasing morde de verdade. `{ ...carrinho }` copia o
objeto de cima, mas `itens` continua sendo **o mesmo array**, e cada item dentro
dele continua sendo **o mesmo objeto**.

Rode `git diff` e responda:

1. Como o agente copiou os itens? `[...itens]` sozinho não protege os objetos.
2. Ele copiou o array de cupons, ou reaproveitou a referência?
3. Ele usou `structuredClone`, spread aninhado, ou `map` criando objetos novos?
   Qual você preferiria manter, e por quê?
4. O que você mudaria antes de aprovar?
