// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// Corrija a ambiguidade que a IA resolveu errado na leitura critica.
// As faixas NAO acumulam: vale a faixa mais alta que o valor alcanca.
//
// Rode: npm run ex -- aula03/01

/**
 * Aplica desconto progressivo sobre o valor da compra.
 *
 * Especificacao (agora sem ambiguidade):
 *   - valor ate 100 (inclusive): sem desconto
 *   - valor acima de 100 ate 500 (inclusive): 10%
 *   - valor acima de 500: 20%
 *   - as faixas NAO acumulam
 *   - valor negativo lanca Error("valor invalido")
 *   - o resultado e arredondado para 2 casas decimais
 */
export function aplicarDesconto(_valor: number): number {
  throw new Error("TODO: implemente aplicarDesconto");
}
