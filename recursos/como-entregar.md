# Como entregar os exercícios

## O fluxo, toda aula

```bash
# 1. Branch para a aula
git checkout main
git pull
git checkout -b aula05-exercicios

# 2. Resolva. Commite por exercício, não tudo no fim.
git add aula05-desvio-e-malhas/exercicios/01-classificador.ts
git commit -m "aula05: resolve exercicio 1 (classificador de notas)"

# 3. Antes de entregar, prove que está pronto
npm run typecheck
npm run ex -- aula05

# 4. Envie
git push -u origin aula05-exercicios
```

Abra um Pull Request no GitHub. O [template de PR](../.github/pull_request_template.md)
já traz o checklist — preencha, não marque tudo por reflexo.

---

## Regras de entrega

1. **Não altere arquivos de teste.** `*.test.ts` e `*.spec.ts` são a especificação.
   Alterar o teste para ele passar é a única coisa que reprova automaticamente.
2. **Um commit por exercício, no mínimo.** Commit único de 400 linhas no dia da
   entrega não permite ver o seu processo — e o processo é o que está sendo avaliado.
3. **Declare o uso de IA.** O PR tem um campo para isso. Usar IA não tira ponto.
   Esconder que usou, sim.
4. **Se não terminou, entregue assim mesmo** e diga no PR onde travou. Um exercício
   incompleto com diagnóstico honesto vale mais que um copiado que funciona.

---

## Sobre o nível 🚫 (sem IA)

Estes exercícios pedem que você desligue as sugestões:

`Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*

Não há como o professor fiscalizar isso, e não é o objetivo. A questão é outra: o
nível 🚫 é o único momento em que você descobre se **realmente** sabe. Os níveis 🤝
e 🤖 vão te dar código que funciona de qualquer jeito — inclusive quando você não
entendeu nada. Só o 🚫 te dá esse retorno.

Quem pula o 🚫 costuma perceber na prova, ou no estágio, ou no primeiro bug que a
IA não consegue resolver. Todos são lugares piores para descobrir isso do que aqui.

---

## Sobre o nível 🤖 (com agente)

Nestes, o agente pode escrever o código. O que **não** é delegável:

- escrever a especificação antes de chamar o agente;
- ler o `git diff` linha a linha antes de commitar;
- responder, na revisão, o que você mudaria.

A mensagem de commit de um exercício 🤖 deve descrever **o que você revisou**, não
o que o agente fez. Exemplo:

```
aula07: implementa relatorio de estoque com agente

Revisei o diff: a primeira versao usava sort() direto no array
recebido, o que quebrava o chamador. Pedi correcao para toSorted().
Conferi os casos de borda de array vazio no teste.
```
