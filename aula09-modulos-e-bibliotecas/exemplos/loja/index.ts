// Arquivo "barril": reexporta o que o modulo oferece para fora.
// Quem usa importa de "./loja/index.js" sem saber a organizacao interna.

export { arredondar, aplicarPercentual } from "./precos.js";
export { default as formatarReal } from "./precos.js";
export { calcularImposto, ALIQUOTA_PADRAO } from "./impostos.js";
