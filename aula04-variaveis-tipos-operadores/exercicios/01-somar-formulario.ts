// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// Corrija os dois defeitos da leitura critica:
//   - o acumulador que concatenava em vez de somar
//   - o valor invalido que virava NaN em silencio
//
// Rode: npm run ex -- 01-somar-formulario

export interface ItemFormulario {
  produto: string;
  valor: string;
}

/**
 * Soma os valores dos itens do pedido.
 *
 * Especificacao:
 *   - cada `valor` vem como texto e precisa ser convertido
 *   - o total e um `number`, sempre
 *   - pedido vazio devolve 0
 *   - valor que nao representa numero lanca Error("valor invalido: <valor>")
 *     (ex: "abc" e string vazia)
 *   - aceita decimais com ponto ("12.5")
 *   - o resultado e arredondado para 2 casas decimais
 */
export function somarPedido(_itens: ItemFormulario[]): number {
  throw new Error("TODO: implemente somarPedido");
}
