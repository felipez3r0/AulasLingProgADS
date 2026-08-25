// Gabarito da parte de "referência vs cópia" (bug 04).
export interface Produto {
  id: number;
  nome: string;
  preco: number;
}

const produtos: Produto[] = [{ id: 1, nome: "Mouse", preco: 100 }];

export function listarTodos(): Produto[] {
  // Cópia PROFUNDA (nível de objeto): [...produtos] sozinho copiaria só o
  // array — os objetos dentro continuariam sendo os mesmos por referência.
  return produtos.map((p) => ({ ...p }));
}

export function aplicarDescontoPreview(lista: Produto[], percentual: number): Produto[] {
  // retorna uma NOVA lista com desconto — não altera a lista/objetos recebidos
  return lista.map((p) => ({ ...p, preco: p.preco * (1 - percentual / 100) }));
}
