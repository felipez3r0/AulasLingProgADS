// Codigo gerado por IA a partir do pedido:
//
//   "faz uma funcao que calcula a media de um array de notas"
//
// Leia antes de rodar. Ele tem um defeito.
// A resposta esta no arquivo .spec.ts ao lado - mas so olhe depois de tentar.

/**
 * Calcula a media de um array de notas.
 */
export function calcularMedia(notas: number[]): number {
  let soma = 0;
  for (let i = 0; i < notas.length; i++) {
    soma += notas[i]!;
  }
  return soma / notas.length;
}
