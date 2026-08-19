# Especificação para o agente — exercício 3

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-pipeline-pedidos
```

## O agente PODE alterar

- `aula06-funcoes-e-decomposicao/exercicios/03-pipeline-pedidos.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula06-funcoes-e-decomposicao/`

## Restrições

- [ ] Decomposto em funções pequenas, não um bloco único
- [ ] Nenhuma função modifica o pedido ou os itens recebidos
- [ ] Item inválido é ignorado, não lança erro

## Contexto que o agente deve ler antes

- `aula06-funcoes-e-decomposicao/exercicios/03-pipeline-pedidos.test.ts`
- `AGENTS.md`

---

## Depois: sua revisão

O ponto de atenção aqui é a **ordem das regras**: o desconto só vale se o subtotal
passar de 50, e o subtotal só conta itens válidos. Aplicar o desconto antes de
filtrar dá outro resultado.

Rode `git diff` e responda:

1. Ele decompôs em funções pequenas ou entregou um bloco único? Se foi bloco único,
   peça a decomposição — e note que os testes passariam mesmo assim.
2. Em que ordem ele aplicou filtro → subtotal → limite de 50 → desconto?
3. Ele usou `filter`/`reduce` ou laço? Alguma das duas muta o array de entrada?
4. O que você mudaria antes de aprovar?
