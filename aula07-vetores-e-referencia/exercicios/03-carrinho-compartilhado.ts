// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-carrinho-compartilhado.spec.md ANTES
// de chamar o agente. Depois: git diff, e revise linha a linha.
//
// Este exercicio tem estruturas ANINHADAS. Copia rasa nao basta.
//
// Rode: npm run ex -- 03-carrinho

export interface Item {
  sku: string;
  quantidade: number;
}

export interface Carrinho {
  dono: string;
  itens: Item[];
  cupons: string[];
}

/**
 * Cria uma copia independente do carrinho e aplica uma acao nela.
 *
 * Especificacao:
 *   - devolve um NOVO carrinho; nada dentro dele pode ser compartilhado
 *     com o carrinho original (nem o array de itens, nem cada item,
 *     nem o array de cupons)
 *   - acao "adicionar": soma a quantidade ao item de mesmo sku;
 *     se o sku nao existir, acrescenta o item ao fim
 *   - acao "remover": subtrai a quantidade; se chegar a zero ou menos,
 *     o item sai da lista
 *   - acao "cupom": acrescenta o cupom, sem duplicar; cupons sao
 *     comparados ignorando maiusculas e minusculas, e guardados em MAIUSCULAS
 *   - quantidade zero ou negativa em adicionar/remover lanca
 *     Error("quantidade invalida")
 *   - sku inexistente em "remover" e ignorado
 *   - a ordem dos itens e preservada
 */
export type Acao =
  | { tipo: "adicionar"; sku: string; quantidade: number }
  | { tipo: "remover"; sku: string; quantidade: number }
  | { tipo: "cupom"; codigo: string };

export function aplicarAcao(_carrinho: Carrinho, _acao: Acao): Carrinho {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
