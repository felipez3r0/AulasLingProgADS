export interface Produto { id: number; nome: string; preco: number; }

const produtos: Produto[] = [{ id: 1, nome: "Mouse", preco: 100 }];

export function listarTodos(): Produto[] {
  // BUG: retorna a referência interna diretamente, em vez de uma cópia.
  return produtos;
}

export function aplicarDescontoPreview(lista: Produto[], percentual: number): Produto[] {
  // BUG: deveria retornar uma NOVA lista com desconto; em vez disso,
  // altera os objetos originais recebidos por referência.
  lista.forEach((p) => {
    p.preco = p.preco * (1 - percentual / 100);
  });
  return lista;
}
