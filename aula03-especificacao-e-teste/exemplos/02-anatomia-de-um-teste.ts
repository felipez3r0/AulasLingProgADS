// Anatomia de um teste, e o que separa uma assercao forte de uma fraca.

export interface Produto {
  nome: string;
  preco: number;
  quantidade: number;
}

/**
 * Calcula o total de um carrinho de compras.
 *
 * Especificacao:
 *   - soma preco * quantidade de cada produto
 *   - carrinho vazio devolve 0
 *   - quantidade zero nao contribui
 *   - quantidade negativa lanca Error("quantidade invalida")
 *   - o resultado e arredondado para 2 casas decimais
 *   - nao modifica o carrinho recebido
 */
export function calcularTotal(carrinho: Produto[]): number {
  for (const produto of carrinho) {
    if (produto.quantidade < 0) {
      throw new Error("quantidade invalida");
    }
  }

  const bruto = carrinho.reduce(
    (soma, produto) => soma + produto.preco * produto.quantidade,
    0,
  );

  return Math.round(bruto * 100) / 100;
}
