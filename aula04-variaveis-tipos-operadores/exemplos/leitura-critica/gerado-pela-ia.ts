// Codigo gerado por IA a partir do pedido:
//
//   "soma os valores dos itens do pedido que vem do formulario"
//
// Os dados chegam do formulario, entao todo campo e string.
// Leia antes de rodar.

export interface ItemFormulario {
  produto: string;
  valor: string; // vem do formulario, portanto e texto
}

/**
 * Soma os valores dos itens do pedido.
 */
export function somarPedido(itens: ItemFormulario[]): number {
  let total = 0;
  for (const item of itens) {
    total += Number(item.valor);
  }
  return total;
}

/**
 * Segunda versao, tambem gerada, "mais moderna".
 * O `reduce` comeca com o valor inicial errado.
 */
export function somarPedidoReduce(itens: ItemFormulario[]): number | string {
  return itens.reduce((total, item) => total + item.valor, "" as string | number) as
    | number
    | string;
}
