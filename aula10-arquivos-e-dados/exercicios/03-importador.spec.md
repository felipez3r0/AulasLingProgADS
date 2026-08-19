# Especificação para o agente — exercício 3

> **Antes de tudo: `git status` limpo e trabalho commitado.** Este exercício mexe
> em arquivos de verdade, e um agente com permissão de escrita pode apagar o que
> você não queria. `git restore .` só te salva se houver um commit para onde voltar.

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-importador
```

## O agente PODE alterar

- `aula10-arquivos-e-dados/exercicios/03-importador.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula10-arquivos-e-dados/`
- **nenhum arquivo fora do repositório**

## Restrições

- [ ] Escrita atômica (temporário + rename)
- [ ] Nenhum caminho fixo no código: tudo vem por parâmetro
- [ ] Nenhum `catch` vazio; linha problemática é registrada, não engolida
- [ ] Sem dependências novas

## Contexto que o agente deve ler antes

- `aula10-arquivos-e-dados/exercicios/03-importador.test.ts`
- `AGENTS.md`

---

## Depois: sua revisão

Código que mexe em arquivo é onde um `catch` descuidado causa perda de dados.

Rode `git diff` e responda:

1. Há algum `catch` que descarta o erro sem registrar nada em `problemas`?
2. A escrita é atômica? Ele deixa `.tmp` para trás em caso de falha?
3. Ele fixou algum caminho no código, ou tudo vem por parâmetro?
4. Ele leu os arquivos em ordem alfabética? A ordem afeta qual RA duplicado vence.
5. O que você mudaria antes de aprovar?
