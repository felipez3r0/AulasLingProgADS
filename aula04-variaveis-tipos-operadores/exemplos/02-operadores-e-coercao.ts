// Operadores, expressoes e a parte que morde: coercao de tipos.

/** Aritmeticos, na precedencia usual: () antes de * / % antes de + -. */
export function precedencia(): number {
  return 2 + 3 * 4; // 14, nao 20
}

/** O operador % (resto) e a ferramenta padrao para "e par?" e "de N em N". */
export function ehPar(n: number): boolean {
  return n % 2 === 0;
}

/**
 * `+` e sobrecarregado: soma numeros, CONCATENA strings.
 * Se um dos lados for string, o outro e convertido para string.
 * Esta e a origem de uma classe inteira de bugs em dados vindos de
 * formulario, arquivo ou API - onde tudo chega como texto.
 */
export function somaComTexto(): string {
  const quantidade = "10"; // veio de um formulario, portanto e string
  return quantidade + 5; // "105", nao 15
}

/** Convertendo antes de somar, o resultado e o esperado. */
export function somaConvertida(): number {
  const quantidade = "10";
  return Number(quantidade) + 5; // 15
}

/**
 * `==` compara com conversao; `===` compara sem converter.
 * Regra do curso: use SEMPRE `===`.
 */
export function comparacoes(): { frouxa: boolean; estrita: boolean } {
  return {
    frouxa: (0 as unknown) == "", // true - converte antes de comparar
    estrita: (0 as unknown) === "", // false - tipos diferentes
  };
}

/** Logicos: && (e), || (ou), ! (nao), com avaliacao de curto-circuito. */
export function aprovado(media: number, presenca: number): boolean {
  return media >= 6 && presenca >= 0.75;
}

/** `??` devolve o lado direito apenas quando o esquerdo e null ou undefined. */
export function comPadrao(valor: number | null | undefined): number {
  return valor ?? 0;
}

/** `||` tambem cai para o lado direito com 0 e "" - nem sempre e o que voce quer. */
export function comOuLogico(valor: number): number {
  return valor || -1; // 0 vira -1, o que costuma ser um bug
}
