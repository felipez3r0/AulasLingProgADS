# Aula 05 - Funções e Escopo

## Objetivos da Aula

- Declarar e invocar funções com tipos em TypeScript
- Entender parâmetros, retorno e assinatura de funções
- Diferenciar function declaration, function expression e arrow function
- Compreender escopo de variáveis (global, local, bloco)
- Utilizar parâmetros opcionais e valores padrão

---

## 1. O que é uma Função?

Uma função é um bloco de código reutilizável que executa uma tarefa específica.

```typescript
// Declaracao da funcao
function saudacao(nome: string): string {
  return `Ola, ${nome}!`;
}

// Chamada (invocação) da função
const mensagem: string = saudacao("Maria");
console.log(mensagem);  // "Olá, Maria!"
```

> **Comparando com C:**
> ```c
> // C
> char* saudacao(char* nome) { ... }
>
> // TypeScript
> function saudacao(nome: string): string { ... }
> ```
> A estrutura é semelhante: nome, parâmetros tipados e tipo de retorno.

---

## 2. Anatomia de uma Função TypeScript

```typescript
function calcularMedia(nota1: number, nota2: number, nota3: number): number {
//       ^nome         ^parâmetros tipados                          ^tipo retorno
  const soma: number = nota1 + nota2 + nota3;
  return soma / 3;
//^retorno
}
```

### 2.1 Função sem retorno (void)

```typescript
function exibirNota(aluno: string, nota: number): void {
  console.log(`${aluno}: ${nota.toFixed(1)}`);
  // Não tem return (ou return sem valor)
}
```

### 2.2 Função com retorno antecipado

```typescript
function dividir(a: number, b: number): number | null {
  if (b === 0) {
    console.log("Erro: divisão por zero!");
    return null;  // Retorno antecipado
  }
  return a / b;
}
```

---

## 3. Formas de Declarar Funções

### 3.1 Function Declaration

```typescript
function somar(a: number, b: number): number {
  return a + b;
}
```

### 3.2 Function Expression

```typescript
const somar = function (a: number, b: number): number {
  return a + b;
};
```

### 3.3 Arrow Function (função seta)

Sintaxe mais curta, muito usada no ecossistema JS/TS:

```typescript
// Forma completa
const somar = (a: number, b: number): number => {
  return a + b;
};

// Forma resumida (retorno implícito - sem chaves)
const somar = (a: number, b: number): number => a + b;

// Com um único parâmetro (parênteses opcionais)
const dobro = (n: number): number => n * 2;
```

> **Quando usar cada forma?**
> - `function declaration`: funções principais, mais visíveis
> - `arrow function`: callbacks, funções curtas, funções passadas como argumento

---

## 4. Parâmetros Avançados

### 4.1 Parâmetros opcionais

Use `?` para tornar um parâmetro opcional:

```typescript
function saudacao(nome: string, titulo?: string): string {
  if (titulo) {
    return `Ola, ${titulo} ${nome}!`;
  }
  return `Ola, ${nome}!`;
}

console.log(saudacao("Ana"));            // "Olá, Ana!"
console.log(saudacao("Ana", "Profa."));  // "Olá, Profa. Ana!"
```

> Parâmetros opcionais devem vir **depois** dos obrigatórios.

### 4.2 Valores padrão (default)

```typescript
function calcularDesconto(valor: number, percentual: number = 10): number {
  return valor - (valor * percentual / 100);
}

console.log(calcularDesconto(100));      // 90 (10% padrão)
console.log(calcularDesconto(100, 25));  // 75 (25% informado)
```

### 4.3 Rest parameters (número variável de argumentos)

```typescript
function somarTodos(...numeros: number[]): number {
  let total: number = 0;
  for (const num of numeros) {
    total += num;
  }
  return total;
}

console.log(somarTodos(1, 2, 3));        // 6
console.log(somarTodos(10, 20, 30, 40)); // 100
```

> **Comparando com C:** Em C você usaria `va_list` com `<stdarg.h>`, que é muito mais verboso. O rest parameter do TypeScript é bem mais simples.

---

## 5. Escopo de Variáveis

### 5.1 Escopo global

```typescript
const mensagem: string = "Global";  // Acessível em todo o arquivo

function teste(): void {
  console.log(mensagem);  // "Global" - acessa a variável global
}
```

### 5.2 Escopo local (função)

```typescript
function calcular(): void {
  const resultado: number = 42;  // Existe APENAS dentro desta função
  console.log(resultado);
}

calcular();
// console.log(resultado);  // ERRO! resultado não existe aqui fora
```

### 5.3 Escopo de bloco

`let` e `const` respeitam o escopo de bloco (chaves `{}`):

```typescript
if (true) {
  const dentroDoIf: string = "visível aqui";
  let tambemAqui: number = 10;
  console.log(dentroDoIf);  // ok
}

// console.log(dentroDoIf);  // ERRO! Não existe fora do bloco
```

```typescript
for (let i = 0; i < 5; i++) {
  // 'i' só existe dentro deste for
}
// console.log(i);  // ERRO! 'i' não existe aqui
```

> **Diferença do C:** Em C, variáveis declaradas dentro de um `for` também têm escopo de bloco (C99+). O comportamento é o mesmo com `let`/`const`.

### 5.4 Shadowing (sombreamento)

```typescript
const valor: number = 100;

function teste(): void {
  const valor: number = 50;  // "sombra" a variável externa
  console.log(valor);  // 50
}

teste();
console.log(valor);  // 100 (a externa não foi alterada)
```

---

## 6. Funções como Valores

Em TypeScript (e JavaScript), funções são **valores**. Podem ser atribuídas a variáveis, passadas como argumentos e retornadas por outras funções:

```typescript
// Função como argumento
function executarOperacao(a: number, b: number, operacao: (x: number, y: number) => number): number {
  return operacao(a, b);
}

const soma = (x: number, y: number): number => x + y;
const mult = (x: number, y: number): number => x * y;

console.log(executarOperacao(5, 3, soma));  // 8
console.log(executarOperacao(5, 3, mult));  // 15
```

> Esse conceito é fundamental. Voltaremos a ele com mais profundidade na próxima aula.

---

## 7. Tipo de Função

Em TypeScript, você pode tipar uma variável que armazena uma função:

```typescript
// Tipo de função como type alias
type Operacao = (a: number, b: number) => number;

const somar: Operacao = (a, b) => a + b;
const subtrair: Operacao = (a, b) => a - b;
```

---

## 8. Git - Branches para Exercícios

Nesta aula, vamos usar **branches** do Git para organizar exercícios:

```bash
# Crie uma branch para o exercício
git checkout -b exercicio/calculadora

# ... resolva o exercício, faça commits ...
git add src/calculadora.ts
git commit -m "Implementa calculadora com funções"

# Volte para a branch principal
git checkout main

# Mescle o exercício na main
git merge exercicio/calculadora
```

> **Por que branches?** Permitem trabalhar em funcionalidades isoladas sem afetar o código principal. É uma prática essencial em equipes.

---

## Exercícios Práticos

### Exercício 1 - Funções matemáticas
Crie `src/matematica.ts` com funções para:
1. `calcularFatorial(n: number): number` - fatorial de n
2. `ehPar(n: number): boolean` - verifica se é par
3. `calcularPotencia(base: number, expoente: number): number` - sem usar `**`
4. Teste todas as funções com diferentes valores

### Exercício 2 - Calculadora com funções
Refatore a calculadora da Aula 04:
1. Crie funções separadas: `somar`, `subtrair`, `multiplicar`, `dividir`
2. Crie uma função `calcular(a, b, operacao)` que recebe a operação como parâmetro
3. Use arrow functions

### Exercício 3 - Validador de dados
Crie `src/validador.ts` com funções:
1. `validarIdade(idade: number): boolean` - entre 0 e 150
2. `validarNome(nome: string): boolean` - não vazio e mínimo 2 caracteres
3. `validarEmail(email: string): boolean` - contém `@` e `.`
4. Crie uma função `validarCadastro` que use todas as anteriores

### Exercício 4 - Funções com rest parameters
Crie `src/estatistica.ts` com:
1. `média(...notas: number[]): number`
2. `maior(...números: number[]): number`
3. `menor(...números: number[]): number`
4. Teste com diferentes quantidades de argumentos

---

## Dica: GitHub Copilot e Funções

O Copilot brilha ao sugerir funções. Experimente:

1. **Nomeie bem a função** e o Copilot deduz a implementação:
   ```typescript
   function calcularIMC(peso: number, altura: number): number {
     // Copilot sugere: return peso / (altura * altura);
   }
   ```

2. **Escreva os testes primeiro** e peça ao Copilot a implementação:
   ```typescript
   // calcularFatorial(5) deve retornar 120
   // calcularFatorial(0) deve retornar 1
   // calcularFatorial(1) deve retornar 1
   function calcularFatorial(n: number): number {
     // Copilot implementa baseado nos exemplos acima
   }
   ```

> **Dica de aprendizado:** Tente implementar sozinho primeiro. Depois compare com a sugestão do Copilot. Se a sugestão for diferente, entenda **por que** - ambas podem estar corretas, ou a do Copilot pode ensinar um padrão novo.

---

## Leitura Complementar

- [TypeScript - Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [MDN - Functions](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions)

---

<!-- MIGRAR: origem aula06-arrays-metodos / aula04-arrays-matrizes-strings (seção "Referência vs Cópia") -->

## Referência vs Cópia

### Cuidado! Arrays e objetos são passados por referência

```typescript
const original: number[] = [1, 2, 3];

// Isso NÃO cria uma cópia - ambas apontam para o mesmo array!
const referência = original;
referência.push(4);
console.log(original);  // [1, 2, 3, 4] <- original também mudou!

// Para copiar de verdade, use spread:
const cópia = [...original];
cópia.push(5);
console.log(original);  // [1, 2, 3, 4] <- original não mudou
console.log(cópia);     // [1, 2, 3, 4, 5]
```

> **Comparando com C:** Em C, arrays são passados como ponteiros para funções (passagem por referência). O conceito é similar: ao atribuir um array/objeto a outra variável em TS, ambas referenciam o mesmo espaço na memória. Isso é o que a ementa chama de "passagem de parâmetros por valor e referência" — primitivos (number, string, boolean) são passados por valor (cópia); arrays e objetos são passados por referência.

<!-- FIM MIGRAR -->

<!-- MIGRAR: origem aula09-modulos-bibliotecas (seção 2, Export e Import) -->

## Módulos: Export e Import

> **Comparando com C:** Em C, você usa `#include "header.h"` para incluir declarações de outros arquivos. Em TypeScript, usamos `import`/`export`.

### Named exports

```typescript
// src/matematica.ts
export function somar(a: number, b: number): number {
  return a + b;
}

export const PI: number = 3.14159;
```

```typescript
// src/index.ts
import { somar, PI } from "./matematica";

console.log(somar(5, 3));   // 8
```

### Default export

```typescript
// src/calculadora.ts
export default class Calculadora {
  somar(a: number, b: number): number {
    return a + b;
  }
}
```

```typescript
// src/index.ts
import Calculadora from "./calculadora";  // sem chaves

const calc = new Calculadora();
```

### Renomeando imports

```typescript
import { somar as add } from "./matematica";
```

<!-- FIM MIGRAR -->
