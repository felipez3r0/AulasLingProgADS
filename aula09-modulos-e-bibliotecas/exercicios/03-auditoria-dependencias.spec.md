# Especificação para o agente — exercício 3

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-auditoria
```

## O agente PODE alterar

- `aula09-modulos-e-bibliotecas/exercicios/03-auditoria-dependencias.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula09-modulos-e-bibliotecas/`

## Restrições

- [ ] **Sem instalar nenhuma dependência** — seria irônico neste exercício
- [ ] Comparação de datas sem depender do fuso da máquina
- [ ] A função não modifica o array recebido

## Contexto que o agente deve ler antes

- `aula09-modulos-e-bibliotecas/exercicios/03-auditoria-dependencias.test.ts`
- `AGENTS.md`

---

## Depois: sua revisão

Este exercício é sobre auditar dependências, então preste atenção especial ao que
o agente propõe **instalar**.

Rode `git diff` e responda:

1. Ele sugeriu instalar alguma biblioteca (`date-fns`, `semver`, `dayjs`)? Você
   conferiu se cada uma existe de fato no npm?
2. Como ele comparou as datas? Usou `new Date(texto)`? Isso é sensível a fuso.
3. A ordem dos motivos bate com a especificação, ou ele reorganizou?
4. O que você mudaria antes de aprovar?
