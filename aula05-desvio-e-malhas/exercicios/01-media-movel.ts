// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// Corrija o off-by-one da leitura critica.
// ANTES de escrever codigo, preencha a tabela de rastreio do README
// para leituras.length = 5 e janela = 3. Descubra no papel qual deve
// ser o limite do laco.
//
// Rode: npm run ex -- 01-media-movel

/**
 * Calcula a media movel de janelas consecutivas.
 *
 * Especificacao:
 *   - cada janela tem `tamanho` leituras consecutivas
 *   - para N leituras e janela T, ha exatamente N - T + 1 janelas
 *   - nenhuma janela pode passar do fim do array
 *   - cada media e arredondada para 2 casas decimais
 *   - lista menor que a janela devolve lista vazia
 *   - tamanho de janela menor que 1 lanca Error("janela invalida")
 *   - a funcao NAO pode modificar o array recebido
 */
export function mediaMovel(_leituras: number[], _tamanho: number): number[] {
  throw new Error("TODO: implemente mediaMovel");
}
