// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Metodo: contrato primeiro, sugestao depois.
//
// Aqui ha um detalhe que o Copilot erra com frequencia: os itens sao
// OBJETOS, e copia rasa (`[...lista]`) nao protege os objetos de dentro.
// Se voce alterar `item.quantidade` de um objeto copiado rasamente,
// esta alterando o objeto original.
//
// Rode: npm run ex -- 02-inventario

export interface ItemEstoque {
  codigo: string;
  nome: string;
  quantidade: number;
}

/**
 * Aplica uma lista de movimentacoes ao estoque.
 *
 * Especificacao:
 *   - devolve um NOVO inventario com as quantidades atualizadas
 *   - NAO modifica o inventario recebido nem os objetos dentro dele
 *   - movimentacao positiva soma, negativa subtrai
 *   - movimentacao de codigo inexistente e IGNORADA
 *   - o resultado nunca tem quantidade negativa: o minimo e zero
 *   - a ordem dos itens do inventario e preservada
 *   - inventario vazio devolve lista vazia
 */
export function aplicarMovimentacoes(
  _inventario: ItemEstoque[],
  _movimentacoes: { codigo: string; delta: number }[],
): ItemEstoque[] {
  throw new Error("TODO: implemente aplicarMovimentacoes");
}
