# Especificação para o agente — exercício 3

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-agenda
```

## O agente PODE alterar

- `aula03-especificacao-e-teste/exercicios/03-agenda.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula03-especificacao-e-teste/`

## Restrições

- [ ] Sem dependências novas
- [ ] A função não pode modificar o array recebido
- [ ] Encostar não conta como conflito

## Contexto que o agente deve ler antes

- `aula03-especificacao-e-teste/exercicios/03-agenda.test.ts`
- `AGENTS.md`

---

## Depois: sua revisão

**A regra mais fácil de errar aqui é a de "encostar não é conflito"** — ela depende
de usar `<` em vez de `<=` na comparação. Rode `git diff` e responda:

1. Que comparação o agente usou para detectar sobreposição?
2. Ele gerou cada par uma vez só, ou gerou o par invertido também?
3. Ele ordenou os títulos dentro do par?
4. O que você mudaria antes de aprovar?
