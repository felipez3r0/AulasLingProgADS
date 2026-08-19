// Consumindo os modulos.
//
// Repare no `.js` no fim do caminho, mesmo o arquivo sendo `.ts`.
// Em ESM o import aponta para o arquivo que VAI EXISTIR em tempo de
// execucao, e e assim que o Node resolve.

import { aplicarPercentual, calcularImposto, formatarReal } from "./loja/index.js";

export function precoFinal(precoBase: number, margemPercentual: number): string {
  const comMargem = aplicarPercentual(precoBase, margemPercentual);
  const imposto = calcularImposto(comMargem);
  return formatarReal(comMargem + imposto);
}

export { aplicarPercentual, calcularImposto, formatarReal };
