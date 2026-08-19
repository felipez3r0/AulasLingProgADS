// Ler o erro: a informacao que voce descarta quando cola so a ultima linha.

export interface Pedido {
  id: string;
  itens: { produto: string; preco: number }[];
}

/** Camada 3: o ponto onde o erro acontece. */
export function precoDoPrimeiroItem(pedido: Pedido): number {
  // Se `itens` estiver vazio, `itens[0]` e undefined e ler `.preco` explode.
  return pedido.itens[0]!.preco;
}

/** Camada 2. */
export function resumirPedido(pedido: Pedido): string {
  return `${pedido.id}: a partir de R$ ${precoDoPrimeiroItem(pedido)}`;
}

/** Camada 1: o ponto de onde voce chamou. */
export function listarResumos(pedidos: Pedido[]): string[] {
  return pedidos.map(resumirPedido);
}

/**
 * Erro com CONTEXTO: acrescenta o que a mensagem original nao dizia.
 *
 * `cause` preserva o erro de baixo, entao voce nao perde a pista original.
 */
export function listarResumosComContexto(pedidos: Pedido[]): string[] {
  return pedidos.map((pedido) => {
    try {
      return resumirPedido(pedido);
    } catch (erro) {
      throw new Error(`falha ao resumir o pedido ${pedido.id}`, { cause: erro });
    }
  });
}
