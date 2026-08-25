# Aula 03 - Funções, Escopo, Passagem por Valor/Referência e Módulos

**Modo de IA: Tutor** — pode perguntar, pedir explicação, pedir dica. Não pode pedir a solução.

## Objetivos da aula

- Declarar e chamar funções tipadas em TypeScript, nas suas três formas (declaration, expression, arrow).
- Diferenciar escopo global, local e de bloco.
- Explicar quando um parâmetro é passado **por valor** e quando é passado **por referência** — e prever o efeito colateral de cada caso.
- Organizar código em múltiplos arquivos com `import`/`export`.

## Leitura prévia (antes da aula)

Leia este README. Funções e escopo você já conhece de C. A parte nova é a sintaxe do TypeScript e um ponto que C deixa explícito com `*` e aqui é implícito: quando você está mexendo no original e quando está mexendo numa cópia.

---

## Conteúdo

### Funções: três formas de declarar

```typescript
// Function declaration
function somar(a: number, b: number): number { return a + b; }

// Function expression
const subtrair = function (a: number, b: number): number { return a - b; };

// Arrow function (mais comum em callbacks e funções curtas)
const multiplicar = (a: number, b: number): number => a * b;
const dobro = (n: number): number => n * 2;   // retorno implícito, sem chaves
```

> **Comparando com C:** `char* saudacao(char* nome) { ... }` vira `function saudacao(nome: string): string { ... }` — mesma ideia de nome, parâmetros tipados e tipo de retorno; a arrow function não tem equivalente direto em C.

### Parâmetros opcionais, padrão e rest

```typescript
function saudacao(nome: string, titulo?: string): string {           // ?  = opcional
  return titulo ? `Olá, ${titulo} ${nome}!` : `Olá, ${nome}!`;
}

function desconto(valor: number, percentual: number = 10): number {  // valor padrão
  return valor - (valor * percentual) / 100;
}

function somarTodos(...numeros: number[]): number {                  // rest — equivalente
  return numeros.reduce((total, n) => total + n, 0);                 // simplificado ao va_list de <stdarg.h>
}
```

### Escopo: global, local, bloco

Igual a C — a única diferença prática é que `let`/`const` (não `var`) respeitam escopo de bloco, do mesmo jeito que variáveis declaradas dentro de um `for` em C99+:

```typescript
const global: string = "acessível em todo o arquivo";

function teste(): void {
  const local: number = 42;      // só existe dentro da função
}

if (true) {
  const dentroDoIf: string = "só existe aqui dentro";
}
// dentroDoIf não existe aqui fora — ERRO se tentar usar
```

### Passagem por valor vs por referência

Este é o item da ementa que mais surpreende quem vem de C, porque em TypeScript não existe `*`/`&` explícito — o tipo do dado decide o comportamento:

- **Tipos primitivos** (`number`, `string`, `boolean`) são passados **por valor** — a função recebe uma cópia.
- **Arrays e objetos** são passados **por referência** — a função recebe o mesmo espaço de memória que o original.

```typescript
function tentaZerar(n: number): void {
  n = 0;                          // só muda a cópia local
}
let x = 10;
tentaZerar(x);
console.log(x);                   // 10 — x não mudou (passagem por valor)

function zeraPrimeiro(arr: number[]): void {
  arr[0] = 0;                     // muda o array original!
}
const lista = [1, 2, 3];
zeraPrimeiro(lista);
console.log(lista);               // [0, 2, 3] — lista mudou (passagem por referência)
```

```typescript
const original: number[] = [1, 2, 3];
const referencia = original;      // NÃO copia — aponta pro mesmo array
referencia.push(4);
console.log(original);            // [1, 2, 3, 4] — original também mudou!

const copia = [...original];      // spread cria cópia de verdade
copia.push(5);
console.log(original);            // [1, 2, 3, 4] — não mudou
```

> **Comparando com C:** em C isso é explícito — você passa `int x` (valor, uma cópia) ou `int* x` (ponteiro, o endereço original). Em TypeScript o mesmo comportamento existe, mas é implícito no tipo: primitivo = valor, array/objeto = referência (como se todo array já viesse com `*` embutido).

### Módulos: export e import

```typescript
// src/matematica.ts
export function somar(a: number, b: number): number { return a + b; }
export const PI: number = 3.14159;
```

```typescript
// src/index.ts
import { somar, PI } from "./matematica";
console.log(somar(5, 3));
```

`export default` para quando o módulo tem um "produto principal" (ex.: uma classe); `import { x as y }` para renomear na importação.

> **Comparando com C:** `#include "header.h"` inclui *declarações*; `import`/`export` do TypeScript, além de incluir, controla explicitamente o que cada arquivo expõe (só o que tem `export` fica visível fora do módulo).

---

## Atividades em sala

1. **Previsão:** o professor mostra pares de trechos de código (um passando `number`, outro passando `number[]`, ambos tentando "zerar" o parâmetro) — preveja qual vai alterar a variável original antes de rodar.
2. **Refatoração guiada:** pegue a calculadora da aula 02 (bloco de `if`/`switch`) e refatore para usar funções separadas (`somar`, `subtrair`, ...) organizadas em um módulo `matematica.ts`, importado pelo `index.ts`.

## Exercícios para casa

- **Exercício 1 (Tutor):** `src/matematica.ts` com `calcularFatorial`, `ehPar`, `calcularPotencia` (sem usar `**`); exporte tudo e importe em `src/index.ts` para testar.
- **Exercício 2 (Sem IA):** escreva uma função `dobrarValores(arr: number[]): void` que dobra cada elemento do array **no próprio array** (por referência) e uma função `arrayDobrado(arr: number[]): number[]` que retorna um **novo** array dobrado, sem alterar o original. Verifique com `console.log` que o comportamento de cada uma é diferente.
- **Exercício 3 (Tutor):** `src/validador.ts` com `validarIdade`, `validarNome`, `validarEmail`, e uma função `validarCadastro` que combina as três.

## Critério de entrega

- Código organizado em pelo menos dois arquivos com `export`/`import` (não tudo em um único arquivo).
- Exercício 2 com um comentário explicando, em uma frase, por que uma função altera o array original e a outra não.
- Commits separados por exercício.
