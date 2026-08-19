// Vetores: declaracao, acesso por indice e percurso.

/** Array tipado. Todo elemento e number. */
export function criarNotas(): number[] {
  return [8, 6, 10, 7];
}

/**
 * Acesso por indice.
 *
 * Com `noUncheckedIndexedAccess` ligado (ver tsconfig.json), o tipo de
 * `notas[i]` e `number | undefined` - o compilador OBRIGA voce a tratar
 * o caso de indice fora do array.
 */
export function primeiraNota(notas: number[]): number | undefined {
  return notas[0];
}

/** Tratando o caso ausente de forma explicita. */
export function primeiraNotaOuZero(notas: number[]): number {
  return notas[0] ?? 0;
}

/** Fora dos limites nao e erro nem lixo de memoria: e `undefined`. */
export function acessoForaDosLimites(): number | undefined {
  const notas = [8, 6, 10];
  return notas[99];
}

/** Percurso por indice, quando o indice importa. */
export function comPosicao(notas: number[]): string[] {
  const saida: string[] = [];
  for (let i = 0; i < notas.length; i++) {
    saida.push(`${i + 1}a nota: ${notas[i]}`);
  }
  return saida;
}

/** Metodos que MODIFICAM o array (mutantes). */
export function metodosMutantes(): { depois: number[]; removido: number | undefined } {
  const numeros = [1, 2, 3];
  numeros.push(4);
  const removido = numeros.shift();
  return { depois: numeros, removido };
}

/** Metodos que devolvem um array NOVO (nao mutantes). */
export function metodosNaoMutantes(): { original: number[]; novo: number[] } {
  const original = [3, 1, 2];
  const novo = [...original].sort((a, b) => a - b);
  return { original, novo };
}
