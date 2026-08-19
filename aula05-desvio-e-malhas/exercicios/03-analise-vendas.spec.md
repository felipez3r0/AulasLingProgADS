# Especificação para o agente — exercício 3

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-analise-vendas
```

## O agente PODE alterar

- `aula05-desvio-e-malhas/exercicios/03-analise-vendas.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula05-desvio-e-malhas/`

## Restrições

- [ ] Sem dependências novas
- [ ] `piorMes` ignora meses sem venda; `sequenciaMaiorCrescimento` **não** ignora
- [ ] A função não pode modificar o array recebido

## Contexto que o agente deve ler antes

- `aula05-desvio-e-malhas/exercicios/03-analise-vendas.test.ts`
- `AGENTS.md`

---

## Depois: sua revisão

Este exercício tem uma assimetria proposital: `piorMes` considera apenas meses com
venda, mas a sequência de crescimento percorre os 12 meses, zerados incluídos. É
exatamente o tipo de detalhe que se perde numa geração rápida.

Rode `git diff` e responda:

1. O agente tratou a assimetria, ou aplicou a mesma regra nos dois?
2. Como ele contou a sequência? Uma sequência de 3 meses crescendo dá 2 ou 3?
   (Confira no teste antes de julgar.)
3. Os laços dele vão de 1 a 12 ou de 0 a 11? Onde ele ajustou o índice?
4. O que você mudaria antes de aprovar?
