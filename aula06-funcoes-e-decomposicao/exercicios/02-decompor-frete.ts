// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Aqui a tarefa e DECOMPOR. Voce vai implementar quatro funcoes pequenas
// e uma que as combina. O teste cobra cada peca separadamente - de proposito.
//
// Metodo:
//   1. Implemente as pecas pequenas primeiro, uma de cada vez, rodando o teste.
//   2. So depois implemente `calcularEntrega`, que so combina as pecas.
//   3. Se a peca combinada falhar, o teste de cada peca ja te diz onde olhar.
//
// Esta e exatamente a forma de trabalho que voce vai usar para dirigir
// um agente: pedacos pequenos, cada um com criterio de pronto.
//
// Rode: npm run ex -- 02-decompor-frete

export type Regiao = "sudeste" | "sul" | "nordeste" | "norte" | "centro-oeste";

/** Frete base por regiao: sudeste 10, sul 15, centro-oeste 20, nordeste 25, norte 30. */
export function freteBase(_regiao: Regiao): number {
  throw new Error("TODO: implemente freteBase");
}

/**
 * Acrescimo por peso: 0 ate 1kg, 5 acima de 1kg ate 5kg, 12 acima de 5kg.
 * Peso zero ou negativo lanca Error("peso invalido").
 */
export function acrescimoPorPeso(_pesoKg: number): number {
  throw new Error("TODO: implemente acrescimoPorPeso");
}

/** Desconto de 50% no frete quando a compra passa de 200. Devolve o multiplicador. */
export function multiplicadorDesconto(_valorCompra: number): number {
  throw new Error("TODO: implemente multiplicadorDesconto");
}

/** Prazo em dias: sudeste 2, sul 3, centro-oeste 4, nordeste 6, norte 8. */
export function prazoEmDias(_regiao: Regiao): number {
  throw new Error("TODO: implemente prazoEmDias");
}

export interface Entrega {
  frete: number;
  prazoDias: number;
}

/**
 * Combina as pecas acima.
 *
 * frete = (freteBase + acrescimoPorPeso) * multiplicadorDesconto,
 * arredondado para 2 casas decimais.
 */
export function calcularEntrega(
  _regiao: Regiao,
  _pesoKg: number,
  _valorCompra: number,
): Entrega {
  throw new Error("TODO: implemente calcularEntrega usando as pecas acima");
}
