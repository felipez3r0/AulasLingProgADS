// Codigo gerado por IA a partir do pedido:
//
//   "cria uma funcao que aplica desconto progressivo:
//    10% acima de 100 reais, 20% acima de 500"
//
// Leia antes de rodar. O pedido era ambiguo, e a IA resolveu a ambiguidade
// sozinha - do jeito errado.

/**
 * Aplica desconto progressivo sobre o valor da compra.
 */
export function aplicarDesconto(valor: number): number {
  let desconto = 0;

  if (valor > 100) {
    desconto += 0.1;
  }
  if (valor > 500) {
    desconto += 0.2;
  }

  return valor * (1 - desconto);
}
