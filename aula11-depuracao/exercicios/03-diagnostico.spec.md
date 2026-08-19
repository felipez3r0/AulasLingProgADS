# Especificação para o agente — exercício 3

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-diagnostico
```

## O agente PODE alterar

- `aula11-depuracao/exercicios/03-diagnostico.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula11-depuracao/`

## Restrições

- [ ] A função **nunca lança**, para nenhuma entrada
- [ ] Cadeia circular de causas não pode causar laço infinito
- [ ] Sem dependências novas

## Contexto que o agente deve ler antes

- `aula11-depuracao/exercicios/03-diagnostico.test.ts`
- `AGENTS.md`

---

## Depois: sua revisão

Esta é uma função defensiva: ela existe para funcionar quando **tudo o mais já
deu errado**. Um `throw` aqui esconde o erro original que você estava tentando
diagnosticar.

Rode `git diff` e responda:

1. Existe algum caminho em que a função pode lançar? (`erro.message` quando `erro`
   é `null`, por exemplo.)
2. Como ele protegeu contra a cadeia circular? `Set` de visitados, contador, ou
   nada?
3. A extração de arquivo e linha usa regex? O que acontece se o stack tiver outro
   formato?
4. O que você mudaria antes de aprovar?
