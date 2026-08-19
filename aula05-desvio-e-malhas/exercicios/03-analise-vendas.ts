// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-analise-vendas.spec.md ANTES de chamar o agente.
// Depois: git diff, e revise linha a linha.
//
// Rode: npm run ex -- 03-analise-vendas

export interface Venda {
  vendedor: string;
  valor: number;
  mes: number; // 1 a 12
}

export interface AnaliseVendas {
  melhorMes: number;
  piorMes: number;
  mesesSemVenda: number[];
  sequenciaMaiorCrescimento: number;
}

/**
 * Analisa um ano de vendas.
 *
 * Especificacao:
 *   - melhorMes: o mes (1..12) com maior soma de vendas
 *   - piorMes: o mes com menor soma de vendas, CONSIDERANDO SOMENTE
 *     meses que tiveram ao menos uma venda
 *   - mesesSemVenda: os meses de 1 a 12 sem nenhuma venda, em ordem crescente
 *   - sequenciaMaiorCrescimento: o maior numero de meses CONSECUTIVOS em que
 *     o total cresceu em relacao ao mes anterior (meses de 1 a 12, incluindo
 *     os zerados). Se nunca cresce, e 0.
 *   - empate em melhorMes ou piorMes: vence o mes menor
 *   - lista vazia: melhorMes 0, piorMes 0, todos os 12 meses sem venda,
 *     sequencia 0
 *   - mes fora de 1..12 lanca Error("mes invalido")
 *   - a funcao NAO pode modificar o array recebido
 */
export function analisarVendas(_vendas: Venda[]): AnaliseVendas {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
