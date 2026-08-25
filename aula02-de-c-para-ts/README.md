# Aula 02 - De C para TypeScript

**Modo de IA: Tutor** — pode perguntar, pedir explicação, pedir dica. Não pode pedir a solução.

## Objetivos da aula

- Configurar um projeto TypeScript com Node.js.
- Mapear para TypeScript o que você já sabe em C: variáveis, tipos, operadores, expressões, seleção (`if`/`switch`) e repetição (`for`/`while`).
- Portar para TypeScript um programa que você mesmo escreveu em C no 1º semestre.

## Leitura prévia (antes da aula)

Leia este README inteiro em casa — é essencialmente uma tabela de conversão C → TypeScript. A aula é para tirar dúvidas e portar código, não para reexplicar `if` e `for`.

---

## Conteúdo

### JavaScript, Node.js e por que TypeScript

JavaScript roda fora do navegador via **Node.js** (runtime baseado no motor V8). **TypeScript** é um superset do JavaScript que adiciona tipagem estática verificada em tempo de compilação — a mesma segurança de tipos que você já tem em C, só que checada pelo compilador `tsc` antes de rodar.

```javascript
// JavaScript puro - sem tipos, erro só aparece em runtime
function somar(a, b) { return a + b; }
somar("5", 3);   // "53" (concatenou strings, sem avisar)
```

```typescript
// TypeScript - erro pego em tempo de compilação
function somar(a: number, b: number): number { return a + b; }
somar("5", 3);   // ERRO: argumento string não é number
```

### Setup de um projeto TypeScript

```bash
mkdir meu-projeto && cd meu-projeto
npm init -y
npm install -D typescript @types/node tsx
npx tsc --init
```

`tsconfig.json` mínimo:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

Rode direto sem compilar (útil em desenvolvimento): `npx tsx src/index.ts`, ou adicione `"dev": "tsx watch src/index.ts"` aos scripts.

### Variáveis, constantes e tipos

| C | TypeScript |
|---|---|
| `int`, `float`, `double` | `number` |
| `char[]` / `char*` | `string` |
| `int aprovado = 1;` (0/1) | `boolean` |
| variável fixa, declarada uma vez | `let` (pode reatribuir) / `const` (não pode) |
| `#define PI 3.14` | `const PI: number = 3.14159;` |

```typescript
let idade: number = 21;
const PI: number = 3.14159;         // const não pode ser reatribuído
let nome: string = "Ana";
let aprovado: boolean = true;
```

**Regra prática:** use `const` por padrão; só use `let` quando for reatribuir. Não existe `char` — string de 1 caractere é só uma `string`.

### Operadores e expressões

Os operadores aritméticos, de comparação e lógicos são os mesmos de C (`+ - * / % ** ; > < >= <= && || ! ++ --`), com duas diferenças importantes:

```typescript
console.log(10 / 3);              // 3.333... (em C, 10/3 = 3 — divisão inteira)
console.log(Math.floor(10 / 3));  // 3, se quiser o comportamento de C

console.log(0 == "");   // true  — NUNCA use == / !=
console.log(0 === "");  // false — use sempre === / !== (igualdade estrita)
```

Template literals substituem `sprintf`/concatenação:

```typescript
const idade = 22;
console.log(`Idade: ${idade}`);   // em vez de "Idade: " + idade
```

Precedência de operadores é igual à de C/matemática — na dúvida, use parênteses.

### Seleção: if / else / switch

Sintaxe idêntica a C, só com tipo anotado na variável:

```typescript
const nota: number = 7.5;

if (nota >= 6) {
  console.log("Aprovado");
} else if (nota >= 5) {
  console.log("Recuperação");
} else {
  console.log("Reprovado");
}
```

`switch` funciona como em C. Cuidado com `break`: o fall-through é o mesmo comportamento perigoso:

```typescript
switch (diaSemana) {
  case 1: console.log("Segunda"); break;
  case 6:
  case 7: console.log("Final de semana"); break;
  default: console.log("Dia inválido");
}
```

Diferente de C, `switch` aceita `string` além de número.

### Repetição: for / while / do-while

Também idêntico a C:

```typescript
for (let i: number = 0; i < 5; i++) { console.log(i); }

let contador: number = 0;
while (contador < 5) { contador++; }

do { console.log("roda pelo menos 1x"); } while (false);
```

`break` e `continue` funcionam como em C. Um recurso que não existe em C: `for...of`, para iterar direto sobre os valores de um array/string sem gerenciar índice:

```typescript
for (const letra of "FATEC") { console.log(letra); }
```

---

## Atividades em sala

1. **Leitura/previsão:** o professor mostra trechos de TypeScript equivalentes a programas C conhecidos (tabuada, primos, Fibonacci) — preveja a saída antes de rodar.
2. **Porte guiado:** escolha um programa seu do 1º semestre (Lógica de Programação) que use variáveis, seleção e repetição, e comece a portá-lo para TypeScript em sala, tirando dúvidas de sintaxe com o professor (modo Tutor — pergunte, não peça a solução pronta).

## Exercícios para casa

- **Exercício 1 (Tutor):** porte **um programa completo seu de C do 1º semestre** para TypeScript (ex.: calculadora, classificador, tabela). Deve compilar e produzir a mesma saída.
- **Exercício 2 (Sem IA):** FizzBuzz — imprima 1 a 100; múltiplos de 3 → "Fizz"; de 5 → "Buzz"; de ambos → "FizzBuzz". Sem consultar IA, para fixar sozinho a sintaxe de `for`+`if`.
- **Exercício 3 (Tutor):** classificador de triângulos — recebe três lados (constantes), verifica se formam triângulo válido e classifica como equilátero, isósceles ou escaleno.

## Critério de entrega

- Commit com o programa portado do Exercício 1, incluindo um comentário no início indicando qual era o programa C original.
- Commits separados por exercício, mensagens no imperativo.
- Todo código compila (`npx tsc --noEmit`) sem erros de tipo.
