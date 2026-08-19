// Funcoes de biblioteca: o que ja existe e voce nao precisa reimplementar.
//
// A regra desta aula: antes de escrever (ou aceitar) uma funcao, pergunte
// se a biblioteca padrao ja faz. E depois CONFIRA a assinatura na documentacao.

/** Array: transformar, filtrar, reduzir, procurar. */
export function estatisticas(numeros: number[]): {
  soma: number;
  maior: number | undefined;
  pares: number[];
  temNegativo: boolean;
} {
  return {
    soma: numeros.reduce((a, b) => a + b, 0),
    maior: numeros.length === 0 ? undefined : Math.max(...numeros),
    pares: numeros.filter((n) => n % 2 === 0),
    temNegativo: numeros.some((n) => n < 0),
  };
}

/** String. */
export function normalizarNome(bruto: string): string {
  return bruto
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

/** Math e Number. */
export function seguro(valor: unknown): number {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

/** JSON: serializar e desserializar. */
export function clonarPorJson<T>(valor: T): T {
  return JSON.parse(JSON.stringify(valor)) as T;
}

/**
 * Metodos que MUTAM x metodos que copiam - a distincao da aula 07,
 * agora aplicada a escolha de qual funcao de biblioteca usar.
 */
export function ordenarSemMutar(numeros: number[]): number[] {
  return numeros.toSorted((a, b) => a - b);
}
