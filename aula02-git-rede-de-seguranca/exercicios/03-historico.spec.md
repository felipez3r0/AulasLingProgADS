# Especificação para o agente — exercício 3

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-historico
```

## O agente PODE alterar

- `aula02-git-rede-de-seguranca/exercicios/03-historico.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula02-git-rede-de-seguranca/`

## Restrições

- [ ] Sem dependências novas
- [ ] A função não pode modificar o array recebido
- [ ] Ordenação estável e determinística (empate resolvido pelo nome)

## Contexto que o agente deve ler antes

- `aula02-git-rede-de-seguranca/exercicios/03-historico.test.ts`
- `AGENTS.md`

---

## Depois: sua revisão

**Rode `git diff` e responda:**

1. Quantas linhas o agente mudou? Você leu todas?
2. Ele usou `.sort()` direto no array recebido? (Se sim, o teste pega.)
3. Como ele resolveu o empate? Confere com a regra?
4. O que você mudaria antes de aprovar?
