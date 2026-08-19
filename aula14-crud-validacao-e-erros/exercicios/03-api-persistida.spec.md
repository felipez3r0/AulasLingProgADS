# Especificação para o agente — exercício 3

> **`git status` limpo antes de soltar o agente.** Esta tarefa escreve arquivos.

## Objetivo

<!-- O QUE precisa existir ao final. -->

## Critério de aceite

```bash
npm run ex -- 03-api-persistida
npm run typecheck
```

## O agente PODE alterar

- `aula14-crud-validacao-e-erros/exercicios/03-api-persistida.ts`

## O agente NÃO PODE alterar

- qualquer arquivo `*.test.ts` ou `*.spec.ts`
- qualquer arquivo fora de `aula14-crud-validacao-e-erros/`

## Restrições

- [ ] Nenhum caminho fixo: o arquivo de dados vem por parâmetro
- [ ] Escrita atômica (temporário + rename)
- [ ] Arquivo corrompido **não** vira lista vazia
- [ ] Nenhuma resposta de erro expõe stack ou mensagem interna
- [ ] Sem dependências novas (Express e Zod já estão instalados)

## Contexto que o agente deve ler antes

- `aula14-crud-validacao-e-erros/exercicios/03-api-persistida.test.ts`
- `aula14-crud-validacao-e-erros/exemplos/api/` (o padrão de camadas)
- `aula14-crud-validacao-e-erros/exemplos/02-persistencia.ts` (escrita atômica)
- `AGENTS.md`

---

## Depois: sua revisão

Esta é a entrega mais parecida com o projeto final. Aplique o
[checklist completo](../../recursos/checklist-revisao-de-codigo-ia.md).

1. A escrita é atômica, ou ele usou `writeFile` direto no destino?
2. Arquivo corrompido: ele lança, ou trata como vazio? (A segunda opção apaga tudo.)
3. Onde ficou a lógica — nas rotas, ou numa camada de serviço?
4. Alguma resposta de erro vaza mensagem interna?
5. A rota `/notas/media` foi registrada **antes** de `/notas/:id`? Se não, `media`
   é capturado como se fosse um id.
6. O que você mudaria antes de aprovar?
