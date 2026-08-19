// Codigo gerado por IA a partir do pedido:
//
//   "faz uma funcao que devolve as 3 maiores notas da turma"
//
// Leia antes de rodar. O resultado esta certo.
// O problema e o que sobra depois que a funcao termina.

/**
 * Devolve as 3 maiores notas, da maior para a menor.
 */
export function tresMaiores(notas: number[]): number[] {
  return notas.sort((a, b) => b - a).slice(0, 3);
}

/**
 * Segunda funcao gerada no mesmo pedido: "e tambem a media da turma".
 * Repare que ela e chamada DEPOIS de tresMaiores no fluxo tipico.
 */
export function relatorio(notas: number[]): { top3: number[]; primeiraDaLista: number | undefined } {
  const top3 = tresMaiores(notas);
  return { top3, primeiraDaLista: notas[0] };
}
