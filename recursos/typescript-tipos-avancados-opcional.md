# TypeScript: Tipos Avançados (material opcional)

> Arquivado a partir da antiga `aula08-tipos-avancados` durante a reescrita do curso. O essencial (Union Types, Literal Types) migrou para `aula05-objetos-modelagem`. O restante fica aqui como referência opcional — não é conteúdo obrigatório de nenhuma aula do plano atual, mas pode ser indicado a quem quiser aprofundar.

## Type Guards (Estreitamento de Tipo)

### typeof

```typescript
function processar(valor: string | number): string {
  if (typeof valor === "string") {
    return valor.toUpperCase();
  }
  return valor.toFixed(2);
}
```

### Verificação com propriedades (in)

```typescript
interface Carro {
  marca: string;
  portas: number;
}

interface Moto {
  marca: string;
  cilindradas: number;
}

function exibirVeiculo(veiculo: Carro | Moto): void {
  if ("portas" in veiculo) {
    console.log(`Portas: ${veiculo.portas}`);
  } else {
    console.log(`Cilindradas: ${veiculo.cilindradas}`);
  }
}
```

## Enums

```typescript
enum DiaSemana {
  Segunda,
  Terca,
  Quarta,
}

enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  InternalError = 500,
}
```

> **Enum vs Literal Type:** Para a maioria dos casos, **Literal Types são preferidos** por serem mais simples. Use Enums quando precisar de valores numéricos associados ou quando o valor precisa existir em runtime.

## Generics

### Função genérica

```typescript
function primeiroElemento<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = primeiroElemento([1, 2, 3]);       // tipo: number
const str = primeiroElemento(["a", "b", "c"]); // tipo: string
```

### Interface genérica

```typescript
interface Resposta<T> {
  sucesso: boolean;
  dados: T;
  mensagem: string;
}
```

## Utility Types

```typescript
interface Usuario {
  nome: string;
  email: string;
  idade: number;
}

type UsuarioResumido = Pick<Usuario, "nome" | "email">;
type UsuarioSemEmail = Omit<Usuario, "email">;
type NotasPorAluno = Record<string, number>;

function atualizar(id: number, dados: Partial<Usuario>): void {
  console.log(`Atualizando ${id}:`, dados);
}
```

## Type Assertions

```typescript
const valor: unknown = "Ola Mundo";
const tamanho: number = (valor as string).length;
```

> **Cuidado:** Type assertions podem esconder bugs. Prefira Type Guards sempre que possível.

## Git - Stash

```bash
git stash
git checkout outra-branch
git checkout main
git stash pop
```
