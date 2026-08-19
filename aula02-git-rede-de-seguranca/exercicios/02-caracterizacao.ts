// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Esta funcao veio de um sistema legado. Ela funciona, mas ninguem quer
// mexer nela sem rede de seguranca. Sua tarefa NAO e refatora-la: e
// reimplementa-la preservando exatamente o comportamento atual,
// esquisitices incluidas.
//
// Metodo:
//   1. Leia `comportamentoLegado` abaixo e RASTREIE o que ela faz.
//   2. Use o chat de IA para conferir seu entendimento ("que entrada faz
//      esta funcao devolver algo surpreendente?").
//   3. So entao implemente `calcularFrete`, com o Copilot ligado.
//
// Rode: npm run ex -- aula02/02

/**
 * Codigo legado, aqui apenas para leitura. Nao altere.
 *
 * export function calcularFreteLegado(peso, distancia) {
 *   var frete = 0;
 *   if (peso <= 0) return 0;
 *   frete = peso * 0.5;
 *   if (distancia > 100) {
 *     frete = frete + (distancia - 100) * 0.1;
 *   }
 *   if (frete > 50) frete = 50;
 *   return frete;
 * }
 */

/**
 * Reimplementacao tipada do frete legado.
 *
 * Contrato observado (nao inventado - foi extraido do codigo acima):
 *   - peso menor ou igual a zero devolve 0, independente da distancia
 *   - frete base e peso * 0.5
 *   - distancia acima de 100 acrescenta (distancia - 100) * 0.1
 *   - o frete e limitado a 50, no maximo
 */
export function calcularFrete(_peso: number, _distancia: number): number {
  throw new Error("TODO: implemente calcularFrete");
}
