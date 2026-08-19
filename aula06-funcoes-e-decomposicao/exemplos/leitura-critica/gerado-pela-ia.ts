// Codigo gerado por IA a partir do pedido:
//
//   "faz uma funcao que registra a venda e atualiza o estoque"
//
// Leia antes de rodar. O problema nao esta na conta - esta no que a
// funcao faz ALEM de devolver um valor.

export interface Produto {
  nome: string;
  preco: number;
  estoque: number;
}

let totalVendido = 0; // estado global, criado pela geracao

/**
 * Registra uma venda: da baixa no estoque e devolve o valor da venda.
 */
export function registrarVenda(produto: Produto, quantidade: number): number {
  produto.estoque -= quantidade; // MUTA o objeto do chamador
  totalVendido += quantidade * produto.preco; // MUTA estado global
  return quantidade * produto.preco;
}

/** Existe so para os testes conseguirem observar o estado global. */
export function lerTotalVendido(): number {
  return totalVendido;
}

export function zerarTotalVendido(): void {
  totalVendido = 0;
}
