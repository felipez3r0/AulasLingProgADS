# Aula 04 - Arrays, Matrizes e Strings

**Modo de IA: Tutor** — pode perguntar, pedir explicação, pedir dica. Não pode pedir a solução.

## Objetivos da aula

- Criar e manipular arrays (vetores) tipados em TypeScript.
- Percorrer e manipular matrizes (arrays de arrays).
- Usar os métodos de string mais comuns, comparando com as funções de `<string.h>` de C.
- **Ler** um trecho de código com arrays/matrizes/strings e prever a saída sem executar.

## Leitura prévia (antes da aula)

Leia este README. Você já sabe o que é um vetor e uma matriz de C — o foco aqui é: arrays em TypeScript são dinâmicos (não têm tamanho fixo), e existe um conjunto de métodos prontos que substitui boa parte dos laços manuais que você escrevia em C.

---

## Conteúdo

### Vetores (arrays)

```typescript
const notas: number[] = [8.5, 7.0, 9.2, 6.8];   // C: float notas[4] = {8.5, 7.0, 9.2, 6.8};
const vazio: number[] = [];                      // sem tamanho fixo — pode crescer

console.log(notas[0]);           // 8.5
console.log(notas.length);       // 4 — equivalente ao sizeof(notas)/sizeof(notas[0]) de C
console.log(notas[notas.length - 1]);   // último elemento
```

Diferença central em relação a C: arrays em TypeScript **crescem e diminuem dinamicamente** — não é preciso declarar um tamanho fixo.

### Métodos de modificação

```typescript
const lista: string[] = ["A", "B", "C"];
lista.push("D");              // ["A","B","C","D"]  — insere no final
lista.pop();                  // ["A","B","C"]       — remove do final
lista.unshift("Z");           // ["Z","A","B","C"]   — insere no início
lista.shift();                // ["A","B","C"]       — remove do início
lista.splice(1, 1, "X");      // remove 1 a partir do índice 1, insere "X"
```

### Métodos de iteração (substituem boa parte dos `for` manuais)

```typescript
const numeros: number[] = [1, 2, 3, 4, 5];

numeros.forEach((n) => console.log(n));                 // só executa, não retorna nada
const dobrados = numeros.map((n) => n * 2);              // NOVO array transformado
const pares = numeros.filter((n) => n % 2 === 0);        // NOVO array filtrado
const primeiroPar = numeros.find((n) => n % 2 === 0);    // primeiro que satisfaz, ou undefined
const soma = numeros.reduce((total, n) => total + n, 0); // reduz a um único valor
```

`map`/`filter`/`reduce` **não alteram o array original** — sempre retornam um novo. Podem ser encadeados: `notas.filter(n => n >= 6).map(n => n.toFixed(1))`.

### Spread e destructuring

```typescript
const combinado = [...arr1, ...arr2];        // concatena
const copia = [...original];                 // cópia de verdade (ver aula03 — referência vs cópia)
const [primeiro, segundo, ...resto] = numeros;
```

> A diferença entre um array **copiado** (`[...original]`) e um array **referenciado** (`const b = original`) foi vista na aula03 — arrays em TypeScript são sempre passados/atribuídos por referência, como um ponteiro em C.

### Matrizes (arrays de arrays)

```typescript
// C: int tabela[5][5];
const tabela: number[][] = [];

for (let i = 0; i < 5; i++) {
  tabela.push([]);
  for (let j = 0; j < 5; j++) {
    tabela[i].push((i + 1) * (j + 1));
  }
}

console.log(tabela[2][3]);   // linha 2, coluna 3 — mesmo acesso `matriz[i][j]` de C
```

Percorrer uma matriz usa o mesmo padrão de laços aninhados de C — linha por fora, coluna por dentro:

```typescript
for (let i = 0; i < tabela.length; i++) {
  let linha = "";
  for (let j = 0; j < tabela[i].length; j++) {
    linha += `${tabela[i][j]}`.padStart(4);
  }
  console.log(linha);
}
```

Diferente de C, cada linha de uma matriz TypeScript pode ter um tamanho diferente (não é obrigatoriamente retangular) — é literalmente um array cujos elementos também são arrays.

### Strings (cadeia de caracteres)

Em C, uma string é um `char[]` terminado em `\0` e você manipula com `<string.h>` (`strlen`, `strcat`, `strcmp`...). Em TypeScript, `string` é um tipo primitivo com métodos prontos:

| C (`<string.h>`) | TypeScript |
|---|---|
| `strlen(s)` | `s.length` |
| `strcat(a, b)` | `a + b` ou `` `${a}${b}` `` |
| `strcmp(a, b) == 0` | `a === b` |
| acessar `s[i]` | `s[i]` ou `s.charAt(i)` (ambos funcionam) |
| percorrer com `for` + índice | `for (const c of s)` |

```typescript
const nome: string = "Ana Silva";

console.log(nome.length);              // 9
console.log(nome.toUpperCase());       // "ANA SILVA"
console.log(nome.toLowerCase());       // "ana silva"
console.log(nome.includes("Silva"));   // true
console.log(nome.indexOf("Silva"));    // 4
console.log(nome.slice(0, 3));         // "Ana"  — substring por índice
console.log(nome.split(" "));          // ["Ana", "Silva"]
console.log(nome.trim());              // remove espaços nas pontas
console.log("  x  ".padStart(6, "-")); // "---  x  " (completa até o tamanho)
```

Strings são **imutáveis**: todo método de string retorna uma nova string, nunca modifica a original (ao contrário de arrays, que têm métodos como `push` que alteram o original).

---

## Atividades em sala

1. **Leitura sem executar:** o professor mostra 4-5 trechos combinando array + string + matriz (ex.: uma matriz preenchida por laço aninhado, uma cadeia de `.filter().map()`, uma string passada por `.split()`) — cada aluno escreve a saída prevista antes de rodar, depois confere.
2. **Debug em dupla:** um trecho com bug sutil (ex.: `matriz[j][i]` trocado, ou comparação de string com `==`) — encontrar sem executar, só lendo.

## Exercícios para casa

- **Exercício 1 (Tutor):** `src/notas.ts` — dado um array de notas, calcule a média com `reduce`, filtre aprovados/reprovados com `filter`, encontre a maior e a menor.
- **Exercício 2 (Sem IA):** `src/tabuada-matriz.ts` — gere e imprima uma matriz 10x10 de tabuada (`matriz[i][j] = (i+1)*(j+1)`), formatada em colunas alinhadas.
- **Exercício 3 (Tutor):** `src/palindromo.ts` — função `ehPalindromo(s: string): boolean` que ignora espaços e maiúsculas/minúsculas (ex.: `"A base do teto desaba"` → `true`). Use só métodos de string, sem laço manual se conseguir.

## Critério de entrega

- Commit por exercício.
- Exercício 2 sem usar nenhum método de array de iteração (`for` aninhado puro) — é para fixar o mapeamento direto de laços de C.
- Exercício 3 usando pelo menos dois métodos de string da tabela acima.
