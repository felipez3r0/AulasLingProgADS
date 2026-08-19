// Um modulo: um arquivo com uma responsabilidade, exportando o que
// os outros precisam e escondendo o resto.

/** Nao exportado: e detalhe interno deste modulo. */
const CASAS_DECIMAIS = 2;

export function arredondar(valor: number): number {
  const fator = 10 ** CASAS_DECIMAIS;
  return Math.round(valor * fator) / fator;
}

export function aplicarPercentual(valor: number, percentual: number): number {
  return arredondar(valor * (1 + percentual / 100));
}

/** Export default: no maximo um por modulo. Use com moderacao. */
export default function formatarReal(valor: number): string {
  return `R$ ${arredondar(valor).toFixed(CASAS_DECIMAIS).replace(".", ",")}`;
}
