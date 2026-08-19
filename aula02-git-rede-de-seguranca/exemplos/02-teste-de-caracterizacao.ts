// Teste de caracterizacao: o teste que voce escreve ANTES de refatorar,
// para registrar o comportamento atual - inclusive as esquisitices.
//
// E a rede de seguranca que permite aceitar uma refatoracao de IA
// sem torcer para dar certo.

export interface Item {
  preco: number;
  quantidade: number;
}

/** Versao original, preservando o descarte de quantidades nao positivas. */
export function totalEmEstoque(itens: Item[]): number {
  return itens
    .filter((item) => item.quantidade > 0)
    .reduce((total, item) => total + item.preco * item.quantidade, 0);
}
