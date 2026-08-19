// Codigo gerado por IA a partir do pedido:
//
//   "percorre a lista de leituras do sensor e devolve a media movel
//    de cada janela de 3 leituras"
//
// Leia antes de rodar. RASTREIE o laco com uma lista de 5 elementos.

/**
 * Calcula a media movel de janelas de 3 leituras consecutivas.
 *
 * Para [10, 20, 30, 40, 50] as janelas sao:
 *   [10,20,30] -> 20
 *   [20,30,40] -> 30
 *   [30,40,50] -> 40
 */
export function mediaMovel(leituras: number[]): number[] {
  const resultado: number[] = [];
  for (let i = 0; i <= leituras.length - 3; i++) {
    const janela = leituras.slice(i, i + 3);
    const soma = janela.reduce((a, b) => a + b, 0);
    resultado.push(soma / 3);
  }
  return resultado;
}

/**
 * Segunda versao gerada, "otimizada para nao usar slice".
 * O limite do laco de fora mudou, e agora ele passa do fim do array.
 */
export function mediaMovelOtimizada(leituras: number[]): number[] {
  const resultado: number[] = [];
  for (let i = 0; i < leituras.length - 1; i++) {
    let soma = 0;
    for (let j = 0; j < 3; j++) {
      soma += leituras[i + j] ?? 0;
    }
    resultado.push(soma / 3);
  }
  return resultado;
}
