import { arredondar } from "./precos.js";

export const ALIQUOTA_PADRAO = 18;

export function calcularImposto(valor: number, aliquota: number = ALIQUOTA_PADRAO): number {
  return arredondar(valor * (aliquota / 100));
}
