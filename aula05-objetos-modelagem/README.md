# Aula 05 - Objetos, Interfaces e Modelagem de Dados

**Modo de IA: Tutor** — pode perguntar, pedir explicação, pedir dica. Não pode pedir a solução.

## Objetivos da aula

- Criar objetos e definir `interface`s para tipar estruturas de dados heterogêneas.
- Escolher entre propriedade obrigatória, opcional (`?`) e `readonly`.
- **Modelar** — a partir de um enunciado em português, sem código pronto — as interfaces necessárias para representar o problema.

## Leitura prévia (antes da aula)

Leia este README. Você já modela dados heterogêneos em C com `struct` — o vocabulário muda (`interface` em vez de `struct`, propriedades em vez de campos), mas a ideia de "agrupar campos relacionados em um único tipo" é a mesma.

---

## Conteúdo

### Objetos e interfaces

```typescript
interface Aluno {
  nome: string;
  idade: number;
  curso: string;
  matricula: string;
}

const aluno1: Aluno = { nome: "Bruno", idade: 22, curso: "ADS", matricula: "2024001" };
// const aluno2: Aluno = { nome: "Ana", idade: 21 };  // ERRO: faltam propriedades
```

> **Comparando com C:** uma `interface` é o equivalente de uma `struct`:
> ```c
> struct Aluno { char nome[50]; int idade; char curso[10]; char matricula[20]; };
> ```
> Diferença: em TS não é preciso instanciar com `struct Aluno aluno = {...}` — o objeto literal `{ ... }` já é validado contra a interface.

### Propriedades opcionais e readonly

```typescript
interface Produto {
  nome: string;
  preco: number;
  descricao?: string;     // opcional — pode faltar
  readonly id: number;    // não pode ser reatribuído depois de criado
}

const p: Produto = { nome: "Mouse", preco: 89.9, id: 1 };
// p.id = 2;   // ERRO: readonly
```

### `type` vs `interface`

`type` cria um apelido para qualquer tipo (inclusive união de tipos); `interface` é específico para objetos, mas pode ser estendida depois.

| | `interface` | `type` |
|---|---|---|
| Objetos | sim | sim |
| Union types | não | sim |
| Reabrir/estender depois | sim (`extends`) | não |

**Regra prática:** use `interface` para objetos, `type` para o resto (uniões, apelidos de tipos primitivos).

### Arrays de objetos

É onde a modelagem começa a valer a pena de verdade — combinando o que foi visto na aula04 (arrays/métodos) com interfaces:

```typescript
interface Aluno { nome: string; idade: number; nota: number; }

const turma: Aluno[] = [
  { nome: "Ana", idade: 21, nota: 8.5 },
  { nome: "Bruno", idade: 22, nota: 4.5 },
];

const aprovados = turma.filter((a) => a.nota >= 6);
const media = turma.reduce((soma, a) => soma + a.nota, 0) / turma.length;
```

### Objetos aninhados e destructuring

```typescript
interface Endereco { rua: string; cidade: string; }
interface Funcionario { nome: string; endereco: Endereco; }   // interface dentro de interface

const funcionario: Funcionario = {
  nome: "Maria",
  endereco: { rua: "Av. Brasil", cidade: "São Paulo" },
};

const { nome, endereco: { cidade } } = funcionario;            // destructuring aninhado

const produto = { nome: "Mouse", preco: 100 };
const comDesconto = { ...produto, preco: 90 };                  // spread: copia + sobrescreve
```

### Union types e literal types (referência rápida)

Um valor que pode ter mais de um tipo — o equivalente TypeScript de uma `union` em C, mas verificado em tempo de compilação:

```typescript
let id: string | number;      // pode ser string OU number, nada além disso
id = "ABC123";                // ok
id = 42;                      // ok

type StatusPedido = "pendente" | "processando" | "enviado" | "entregue";  // só esses valores
```

> O restante de tipos avançados (type guards, enums, generics, utility types) fica em `../recursos/typescript-tipos-avancados-opcional.md` — não é conteúdo obrigatório desta aula, mas pode ser útil no projeto final.

---

## Atividades em sala

1. **Modelagem a partir de um enunciado (atividade central da aula):** o professor dá um enunciado em português (ex.: *"Um pedido de lanchonete tem cliente, uma lista de itens — cada item com nome, preço e quantidade — e um status que só pode ser pendente, em preparo, ou entregue"*) e cada aluno escreve as `interface`s correspondentes **sem olhar código pronto**, decidindo sozinho o que é obrigatório, opcional, aninhado ou union type.
2. **Leitura/verificação:** trocar a modelagem com um colega e checar se um objeto de exemplo dado pelo professor seria aceito pelas interfaces de cada um.

## Exercícios para casa

- **Exercício 1 (Tutor) — Modelagem:** a partir do enunciado *"Sistema de biblioteca: livros (título, autor, ISBN, disponível) e empréstimos (livro, aluno, data de empréstimo, data de devolução opcional)"*, escreva as interfaces e um array de exemplo com pelo menos 5 livros e 3 empréstimos.
- **Exercício 2 (Tutor):** usando as interfaces do Exercício 1, implemente `emprestimosAtivos(emprestimos): Emprestimo[]` (sem data de devolução) e `livrosDisponiveis(livros): Livro[]`.
- **Exercício 3 (Sem IA):** dada a interface `Funcionario` com endereço aninhado, escreva uma função que recebe um array de `Funcionario[]` e retorna só os nomes das cidades distintas (sem repetir), usando destructuring.

## Critério de entrega

- As interfaces do Exercício 1 usam corretamente pelo menos um campo opcional (`?`) e justificam em comentário por que aquele campo é opcional.
- Commit por exercício.
- Nenhuma interface usando `any` — se algo parecer "de qualquer tipo", modele como union type.
