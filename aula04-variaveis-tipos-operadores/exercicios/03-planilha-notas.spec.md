# Especificação para o agente — exercício 3

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-planilha-notas
```

## O agente PODE alterar

- `aula04-variaveis-tipos-operadores/exercicios/03-planilha-notas.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula04-variaveis-tipos-operadores/`

## Restrições

- [ ] Sem dependências novas
- [ ] Nenhum campo pode virar `NaN` silenciosamente
- [ ] A função não pode modificar o array recebido

## Contexto que o agente deve ler antes

- `aula04-variaveis-tipos-operadores/exercicios/03-planilha-notas.test.ts`
- `AGENTS.md`

---

## Depois: sua revisão

Este exercício tem **três** validações distintas, e a ordem entre elas importa
(um campo com texto inválido não pode ser reportado como "fora da faixa").
Rode `git diff` e responda:

1. Em que ordem o agente colocou as três validações? Isso bate com os testes?
2. Ele usou `Number()`, `parseFloat()` ou `parseInt()`? Qual a diferença aqui?
3. Ele checou `Number.isNaN` ou comparou com `NaN` usando `===`? (A segunda nunca funciona.)
4. O que você mudaria antes de aprovar?
