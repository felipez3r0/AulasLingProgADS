// Duas versoes da mesma funcao, como apareceriam num diff de refatoracao.
//
// O diff mostraria poucas linhas trocadas e pareceria uma limpeza inofensiva.
// O comportamento mudou. Encontrar isso lendo o diff e a skill desta aula.

/** Versao original: soma os valores dos itens em estoque. */
export function totalEmEstoqueOriginal(itens: { preco: number; quantidade: number }[]): number {
  let total = 0;
  for (const item of itens) {
    if (item.quantidade > 0) {
      total += item.preco * item.quantidade;
    }
  }
  return total;
}

/**
 * Versao "refatorada" - mais curta, mais moderna, e com um comportamento
 * diferente: perdeu o `if (item.quantidade > 0)`.
 *
 * Com quantidade negativa (devolucao registrada errado, por exemplo),
 * a versao nova subtrai do total; a original ignorava.
 */
export function totalEmEstoqueRefatorado(itens: { preco: number; quantidade: number }[]): number {
  return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
}
