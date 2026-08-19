// Unioes: o "union" da ementa, com a tag verificada pelo compilador.

/** Uniao simples: o valor e um OU outro. */
export type Identificador = string | number;

export function formatarId(id: Identificador): string {
  // Type guard: dentro do if, o TS sabe que id e string.
  if (typeof id === "string") return id.toUpperCase();
  return `#${id}`;
}

/** Literal types: o conjunto exato de valores permitidos. */
export type Status = "pendente" | "pago" | "cancelado";

/**
 * Uniao DISCRIMINADA: cada variante carrega um campo que a identifica.
 * E o equivalente de `struct { int tipo; union {...} }` em C - so que a
 * tag e checada pelo compilador em vez de por voce.
 */
export type Pagamento =
  | { metodo: "dinheiro"; valor: number }
  | { metodo: "cartao"; valor: number; parcelas: number }
  | { metodo: "pix"; valor: number; chave: string };

export function descreverPagamento(p: Pagamento): string {
  switch (p.metodo) {
    case "dinheiro":
      return `R$ ${p.valor} em dinheiro`;
    case "cartao":
      // So aqui `parcelas` existe. Acessar em outra variante nao compila.
      return `R$ ${p.valor} em ${p.parcelas}x no cartao`;
    case "pix":
      return `R$ ${p.valor} via pix para ${p.chave}`;
    default:
      return verificarExaustividade(p);
  }
}

/**
 * Verificacao de exaustividade.
 *
 * Se alguem acrescentar uma variante nova a `Pagamento` e esquecer de
 * tratar aqui, `p` deixa de ser `never` e isto vira ERRO DE COMPILACAO.
 * O compilador aponta todos os lugares que precisam mudar.
 */
function verificarExaustividade(valor: never): never {
  throw new Error(`variante nao tratada: ${JSON.stringify(valor)}`);
}

/** Generic: o mesmo codigo funcionando para varios tipos, sem perder o tipo. */
export function primeiro<T>(lista: T[]): T | undefined {
  return lista[0];
}

/** Result: modelar sucesso e falha no proprio tipo, sem lancar excecao. */
export type Resultado<T> = { ok: true; valor: T } | { ok: false; erro: string };

export function dividir(a: number, b: number): Resultado<number> {
  if (b === 0) return { ok: false, erro: "divisao por zero" };
  return { ok: true, valor: a / b };
}

/** Utility types: derivam tipos novos a partir de existentes. */
export interface Produto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
}

export type ProdutoResumo = Pick<Produto, "id" | "nome">;
export type ProdutoParaCriar = Omit<Produto, "id">;
export type ProdutoParcial = Partial<Produto>;

export function resumir(produto: Produto): ProdutoResumo {
  return { id: produto.id, nome: produto.nome };
}
