# Aula 06 - Testes com Vitest: você escreve os testes, a IA implementa

**Modo de IA: Par** — você escreve a especificação e os testes antes; a IA gera a implementação; você revisa o que foi gerado antes de aceitar.

## Objetivos da aula

- Escrever um teste automatizado com Vitest antes de existir implementação.
- Guiar um agente de IA a implementar código a partir de um teste.
- Julgar se uma implementação gerada satisfaz a especificação, e identificar quando ela "engana" o teste sem resolver o problema.

## Leitura prévia (antes da aula)

- Instale as dependências do projeto-base desta aula: `cd aula06-testes/projeto-base && npm install`.
- Rode `npm test` e confira que passa (4 testes reais + 3 pendentes) antes de vir para a aula. Se não passar, avise o professor com antecedência.

---

## Conteúdo

### Por que testar antes de implementar, especialmente com IA

Um teste é uma **especificação executável**: em vez de descrever em português o que uma função deve fazer, você escreve um exemplo concreto de entrada e saída esperada. Isso importa ainda mais quando quem vai escrever o código é uma IA. Um teste escrito por você é o critério objetivo que decide se o que foi gerado está certo, em vez de você precisar ler linha por linha e confiar no "parece certo".

### Anatomia de um teste em Vitest

```typescript
import { describe, expect, it } from "vitest";
import { calcularMedia } from "../src/turma.js";

describe("calcularMedia", () => {
  it("retorna a média aritmética de um array de notas", () => {
    expect(calcularMedia([8, 6, 10])).toBe(8);
  });

  it("retorna 0 para array vazio", () => {
    expect(calcularMedia([])).toBe(0);
  });
});
```

- `describe` agrupa testes relacionados (geralmente por função).
- `it` (ou `test`) descreve um comportamento esperado, em uma frase.
- `expect(valor).toBe(esperado)` é a asserção. Existem outras: `toEqual` para objetos/arrays, `toThrow` para erros, `toBeGreaterThan`, etc.
- `it.todo("descrição")` marca um teste que ainda não foi escrito, sem falhar a suíte. É o que você troca por um `it()` real conforme avança.

Rodar: `npm test` (executa tudo uma vez e sai, sem modo watch).

### O fluxo desta aula

1. **Leia** a assinatura da função ainda não implementada em `src/turma.ts` (`estaAprovado`, `aprovados`) e o `it.todo` correspondente em `test/turma.test.ts`.
2. **Escreva o teste primeiro**: troque o `it.todo` por um `it()` real, com pelo menos um caso normal e um caso de borda (ex.: média exatamente 6, array vazio).
3. **Rode `npm test`**. O teste deve falhar, já que a função ainda lança `"não implementado"` — isso confirma que o teste está de fato testando algo.
4. **Peça à IA para implementar** só o suficiente para o teste passar. Cole a assinatura da função e o teste no prompt.
5. **Rode `npm test`** de novo. Se passou, leia a implementação antes de aceitar: ela resolve o problema, ou só satisfaz os casos exatos do seu teste (ex.: um `if` cravado no valor do teste)? Se desconfiar, adicione mais um caso e rode de novo.

---

## Atividades em sala

1. **Leitura/verificação:** em dupla, um aluno escreve um teste para `estaAprovado` sem mostrar ao colega; o colega tenta prever, só lendo o teste, o que a função deveria fazer. Depois comparam com a intenção original.
2. **Implementação assistida:** cada aluno completa `estaAprovado` e `aprovados` seguindo o fluxo de 5 passos acima, com o professor circulando para revisar se a implementação gerada atende ao teste ou só "decorou" o caso.

## Exercícios para casa

- **Exercício 1 (Par):** complete `estaAprovado` e `aprovados` em `aula06-testes/projeto-base/src/turma.ts`.
- **Exercício 2 (Par):** adicione uma função nova `melhorAluno(turma: Aluno[]): Aluno | undefined` (quem tem a maior média). Escreva o teste primeiro, incluindo o caso de turma vazia, antes de pedir a implementação.
- **Exercício 3 (Tutor):** depois de aceitar a implementação de `aprovados`, pergunte à IA (sem pedir para reescrever) *"essa implementação está considerando o array original, ou está mutando a turma recebida?"* e confira a resposta contra o próprio código.

## Critério de entrega

- `npm test` passa sem nenhum `it.todo` restante em `test/turma.test.ts`.
- Pelo menos um teste por função cobre um caso de borda, não só o caminho feliz.
- Commit com uma frase, por função implementada, dizendo se você aceitou a implementação gerada como veio ou precisou ajustar — e por quê.
