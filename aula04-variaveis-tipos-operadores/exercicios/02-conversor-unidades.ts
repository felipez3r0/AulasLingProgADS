// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Metodo: escreva a assinatura e o contrato PRIMEIRO, aceite sugestao depois.
// Aqui o Copilot costuma acertar a formula e errar o arredondamento
// e o tratamento de negativo - preste atencao nesses dois.
//
// Rode: npm run ex -- 02-conversor-unidades

/**
 * Converte uma temperatura entre escalas.
 *
 * Especificacao:
 *   - escalas aceitas: "C", "F", "K"
 *   - C para F: (c * 9/5) + 32
 *   - C para K: c + 273.15
 *   - converter para a mesma escala devolve o valor inalterado
 *   - o resultado e arredondado para 2 casas decimais
 *   - abaixo do zero absoluto (-273.15 C) lanca Error("abaixo do zero absoluto")
 *   - escala desconhecida lanca Error("escala invalida")
 */
export type Escala = "C" | "F" | "K";

export function converterTemperatura(
  _valor: number,
  _de: Escala,
  _para: Escala,
): number {
  throw new Error("TODO: implemente converterTemperatura");
}
