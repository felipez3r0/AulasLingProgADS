# Aula 06 - Arrays e Métodos de Array

## Objetivos da Aula

- Criar e manipular arrays tipados em TypeScript
- Utilizar os principais métodos de array: push, pop, shift, unshift, splice
- Aplicar métodos de iteração: forEach, map, filter, find, reduce
- Entender a diferença entre referência e cópia de arrays
- Utilizar spread operator e destructuring com arrays

---

## 1. Criando Arrays

### 1.1 Declaração básica

```typescript
// Array de numeros
const notas: number[] = [8.5, 7.0, 9.2, 6.8];

// Array de strings
const nomes: string[] = ["Ana", "Bruno", "Carlos"];

// Array vazio (com tipo)
const lista: number[] = [];

// Sintaxe alternativa com Generic
const valores: Array<number> = [1, 2, 3];
```

> **Comparando com C:**
> ```c
> // C - tamanho fixo, tipo unico
> int notas[4] = {85, 70, 92, 68};
>
> // TypeScript - tamanho dinamico, tipo definido
> const notas: number[] = [8.5, 7.0, 9.2, 6.8];
> ```
> Diferença crucial: arrays em TypeScript são **dinâmicos** (crescem e diminuem conforme necessário).

### 1.2 Acessando elementos

```typescript
const frutas: string[] = ["maca", "banana", "laranja"];

console.log(frutas[0]);       // "maca" (primeiro elemento)
console.log(frutas[2]);       // "laranja" (terceiro elemento)
console.log(frutas.length);   // 3 (tamanho do array)

// Ultimo elemento
console.log(frutas[frutas.length - 1]);  // "laranja"
```

### 1.3 Readonly arrays

```typescript
const diasSemana: readonly string[] = ["Seg", "Ter", "Qua", "Qui", "Sex"];

// diasSemana.push("Sab");  // ERRO! Não pode modificar array readonly
// diasSemana[0] = "Dom";   // ERRO!
```

---

## 2. Métodos de Modificação

### 2.1 Adicionando e removendo elementos

```typescript
const lista: string[] = ["A", "B", "C"];

// Adicionar ao final
lista.push("D");           // ["A", "B", "C", "D"]

// Remover do final
const ultimo = lista.pop(); // ["A", "B", "C"] -> ultimo = "D"

// Adicionar ao inicio
lista.unshift("Z");        // ["Z", "A", "B", "C"]

// Remover do inicio
const primeiro = lista.shift(); // ["A", "B", "C"] -> primeiro = "Z"
```

### 2.2 splice - o canivete suíço

```typescript
const letras: string[] = ["A", "B", "C", "D", "E"];

// Remover 2 elementos a partir do indice 1
letras.splice(1, 2);       // ["A", "D", "E"] (removeu B e C)

// Inserir elementos na posição 1
letras.splice(1, 0, "X", "Y"); // ["A", "X", "Y", "D", "E"]

// Substituir: remove 1 a partir do índice 2, insere "Z"
letras.splice(2, 1, "Z");      // ["A", "X", "Z", "D", "E"]
```

### 2.3 Outros métodos úteis

```typescript
const nums: number[] = [3, 1, 4, 1, 5, 9];

// Ordenar
nums.sort((a, b) => a - b);  // [1, 1, 3, 4, 5, 9]

// Inverter
nums.reverse();               // [9, 5, 4, 3, 1, 1]

// Verificar se contem
console.log(nums.includes(4));  // true

// Encontrar índice
console.log(nums.indexOf(5));   // 1
```

---

## 3. Métodos de Iteração (os mais importantes!)

### 3.1 forEach - executar algo para cada elemento

```typescript
const nomes: string[] = ["Ana", "Bruno", "Carlos"];

nomes.forEach((nome: string, indice: number) => {
  console.log(`${indice + 1}. ${nome}`);
});
// 1. Ana
// 2. Bruno
// 3. Carlos
```

### 3.2 map - transformar cada elemento

Retorna um **novo array** com os elementos transformados:

```typescript
const numeros: number[] = [1, 2, 3, 4, 5];

const dobrados: number[] = numeros.map((n: number) => n * 2);
console.log(dobrados);  // [2, 4, 6, 8, 10]

// O array original NÃO muda
console.log(numeros);   // [1, 2, 3, 4, 5]
```

Exemplo prático:

```typescript
const precos: number[] = [100, 200, 50, 300];
const comDesconto: number[] = precos.map((preco) => preco * 0.9);
// [90, 180, 45, 270]
```

### 3.3 filter - filtrar elementos

Retorna um **novo array** apenas com os elementos que passam no teste:

```typescript
const idades: number[] = [15, 22, 17, 30, 12, 25];

const maiores: number[] = idades.filter((idade) => idade >= 18);
console.log(maiores);  // [22, 30, 25]

const menores: number[] = idades.filter((idade) => idade < 18);
console.log(menores);  // [15, 17, 12]
```

### 3.4 find - encontrar um elemento

Retorna o **primeiro** elemento que satisfaz a condição (ou `undefined`):

```typescript
const numeros: number[] = [10, 23, 45, 60, 72];

const primeiroPar: number | undefined = numeros.find((n) => n % 2 === 0);
console.log(primeiroPar);  // 10
```

### 3.5 reduce - reduzir a um unico valor

O mais poderoso e versátil:

```typescript
const numeros: number[] = [1, 2, 3, 4, 5];

// Soma de todos os elementos
const soma: number = numeros.reduce((acumulador, atual) => acumulador + atual, 0);
console.log(soma);  // 15

// Como funciona passo a passo:
// reduce((0, 1) => 1)    -> acumulador = 1
// reduce((1, 2) => 3)    -> acumulador = 3
// reduce((3, 3) => 6)    -> acumulador = 6
// reduce((6, 4) => 10)   -> acumulador = 10
// reduce((10, 5) => 15)  -> resultado final = 15
```

### 3.6 Encadeando métodos

Os métodos podem ser combinados em cadeia:

```typescript
const notas: number[] = [4.5, 7.0, 8.5, 3.0, 9.0, 6.5, 2.0];

// Filtrar aprovados (>= 6), calcular média
const mediaAprovados: number = notas
  .filter((nota) => nota >= 6)
  .reduce((soma, nota, _, arr) => soma + nota / arr.length, 0);

console.log(`Média dos aprovados: ${mediaAprovados.toFixed(1)}`);
```

---

## 4. Spread Operator e Destructuring

### 4.1 Spread operator (`...`)

"Espalha" os elementos de um array:

```typescript
const frutas: string[] = ["maca", "banana"];
const verduras: string[] = ["alface", "tomate"];

// Combinar arrays
const alimentos: string[] = [...frutas, ...verduras];
// ["maca", "banana", "alface", "tomate"]

// Copiar um array (cópia rasa)
const cópiaFrutas: string[] = [...frutas];
```

### 4.2 Destructuring (desestruturação)

Extrair valores de um array em variáveis individuais:

```typescript
const coordenadas: number[] = [10, 20, 30];

const [x, y, z] = coordenadas;
console.log(x);  // 10
console.log(y);  // 20
console.log(z);  // 30

// Ignorando elementos
const [primeiro, , terceiro] = coordenadas;
console.log(primeiro);  // 10
console.log(terceiro);  // 30

// Rest com destructuring
const [head, ...rest] = [1, 2, 3, 4, 5];
console.log(head);  // 1
console.log(rest);  // [2, 3, 4, 5]
```

---

## 5. Referência vs Cópia

### Cuidado! Arrays são passados por referência

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

> **Comparando com C:** Em C, arrays são passados como ponteiros para funções (passagem por referência). O conceito é similar: ao atribuir um array a outra variável em TS, ambas referenciam o mesmo espaço na memória.

---

## 6. Git - Comparando versoes

Ao refatorar codigo (ex: trocar um `for` por `map`), o Git mostra exatamente o que mudou:

```bash
# Ver alteracoes antes de commitar
git diff

# Commit da versao com for
git add src/notas.ts
git commit -m "Calcula media com for loop"

# Refatore para usar map/reduce, depois:
git add src/notas.ts
git commit -m "Refatora calculo de media usando reduce"

# Comparar os dois commits
git log --oneline
git diff HEAD~1 HEAD
```

---

## Exercícios Práticos

### Exercício 1 - Gerenciador de lista
Crie `src/lista.ts` que:
1. Crie um array de tarefas (strings)
2. Implemente funções: `adicionarTarefa`, `removerTarefa`, `listarTarefas`
3. Demonstre o uso de push, splice e forEach

### Exercício 2 - Análise de notas
Crie `src/notas.ts` que dado um array de notas:
1. Calcule a média usando `reduce`
2. Filtre aprovados (>= 6) e reprovados (< 6) usando `filter`
3. Encontre a maior e menor nota usando `reduce` ou `Math.max/min` com spread
4. Crie um novo array com as notas arredondadas usando `map`

### Exercício 3 - Transformação de dados
Dado o array:
```typescript
const alunos: string[] = ["ana silva", "bruno costa", "carlos lima"];
```
1. Use `map` para capitalizar os nomes: `["Ana Silva", "Bruno Costa", "Carlos Lima"]`
2. Use `filter` para pegar apenas nomes com mais de 10 caracteres
3. Use `find` para buscar um aluno pelo primeiro nome

### Exercício 4 - Carrinho de compras
Crie `src/carrinho.ts` com arrays de produtos e precos:
1. Adicione e remova itens do carrinho
2. Calcule o total com `reduce`
3. Aplique desconto de 10% em todos os itens com `map`
4. Filtre itens acima de R$ 50

---

## Dica: IA e Métodos de Array

Os métodos `map`, `filter` e `reduce` podem ser confusos no início. Use o Copilot para:

1. **Converter for para métodos funcionais:**
   Selecione um `for` e peça ao Copilot Chat: *"Converta esse for loop para usar map/filter/reduce"*

2. **Entender encadeamento:**
   Peça: *"Me explique passo a passo o que esse código faz"* e cole uma cadeia de métodos

> **Exercício com IA:** Resolva o Exercício 2 de duas formas: primeiro com `for` tradicional, depois com métodos de array. Use o Copilot para comparar as abordagens e entender as vantagens de cada uma.

---

## Leitura Complementar

- [MDN - Array](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [TypeScript - Arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)

---

<!-- MIGRAR: origem aula04-desvio-malhas (seção "Laços Aninhados", base para matrizes) -->

## Laços Aninhados (base para matrizes)

```typescript
// Tabela de multiplicação 1 a 5
for (let i: number = 1; i <= 5; i++) {
  let linha: string = "";
  for (let j: number = 1; j <= 5; j++) {
    linha += `${(i * j).toString().padStart(4)}`;
  }
  console.log(linha);
}
```

Saída:
```
   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
   4   8  12  16  20
   5  10  15  20  25
```

> Esse padrão de laço aninhado (linha x coluna) é a base para percorrer matrizes (arrays de arrays) — assunto central desta aula nova.

<!-- FIM MIGRAR -->
