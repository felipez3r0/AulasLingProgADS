// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-pipeline-pedidos.spec.md ANTES de chamar o agente.
// Depois: git diff, e revise linha a linha.
//
// Rode: npm run ex -- 03-pipeline-pedidos

export interface ItemPedido {
  produto: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  cliente: string;
  itens: ItemPedido[];
  cupom?: string;
}

export interface PedidoProcessado {
  cliente: string;
  subtotal: number;
  desconto: number;
  total: number;
  itensValidos: number;
}

/**
 * Processa um pedido.
 *
 * Decomponha em funcoes pequenas: o teste cobra apenas `processarPedido`,
 * mas a revisao vai cobrar que ela seja legivel.
 *
 * Especificacao:
 *   - subtotal = soma de quantidade * precoUnitario dos itens VALIDOS
 *   - item valido tem quantidade > 0 e precoUnitario >= 0
 *   - itens invalidos sao IGNORADOS, nao lancam erro
 *   - itensValidos conta quantos itens entraram no subtotal
 *   - cupom "DEZ" da 10% de desconto; "VINTE" da 20%; qualquer outro cupom
 *     e ignorado (desconto zero); sem cupom, desconto zero
 *   - o desconto so se aplica se o subtotal for maior que 50
 *   - total = subtotal - desconto
 *   - subtotal, desconto e total arredondados para 2 casas decimais
 *   - pedido sem itens validos tem tudo zerado
 *   - a funcao NAO pode modificar o pedido recebido nem seus itens
 */
export function processarPedido(_pedido: Pedido): PedidoProcessado {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
