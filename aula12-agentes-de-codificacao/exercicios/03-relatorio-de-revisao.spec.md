# Especificação para o agente — exercício 3

> Você está delegando a um agente a construção da ferramenta que decide se o
> trabalho de um agente pode ser aprovado. Revise com o cuidado que isso merece.

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-relatorio-de-revisao
npm run typecheck
```

## O agente PODE alterar

- `aula12-agentes-de-codificacao/exercicios/03-relatorio-de-revisao.ts`

## O agente NÃO PODE alterar

- `02-alertas-de-diff.ts` (o tipo `Alerta` vem de lá)
- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula12-agentes-de-codificacao/`

## Restrições

- [ ] A ordem dos motivos é exatamente a da especificação
- [ ] `precisaLerComCuidado` é independente da decisão
- [ ] Sem dependências novas

## Contexto que o agente deve ler antes

- `aula12-agentes-de-codificacao/exercicios/03-relatorio-de-revisao.test.ts`
- `aula12-agentes-de-codificacao/exercicios/02-alertas-de-diff.ts`
- `AGENTS.md`

---

## Depois: sua revisão

Aplique a este diff o próprio checklist que a função implementa.

1. Quantas linhas o agente mudou? Você leu **todas**?
2. Ele respeitou a ordem dos motivos, ou reagrupou por conveniência?
3. Ele acrescentou alguma regra, limiar ou campo que a especificação não pedia?
   (Releia a seção 2 da aula: decisões não pedidas são o defeito característico.)
4. Se este PR chegasse a você no GitHub, você aprovaria? Por quê?
