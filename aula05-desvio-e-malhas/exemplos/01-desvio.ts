// Comandos de desvio: if/else, switch e o operador ternario.

/** if / else if / else - avaliado de cima para baixo, para no primeiro que der true. */
export function classificar(nota: number): string {
  if (nota >= 9) return "A";
  else if (nota >= 7) return "B";
  else if (nota >= 5) return "C";
  else return "D";
}

/**
 * A ORDEM importa. Esta versao esta errada de proposito:
 * `nota >= 5` captura tudo de 5 para cima, e os ramos seguintes
 * nunca sao alcancados. Codigo inalcancavel nao gera erro nenhum.
 */
export function classificarOrdemErrada(nota: number): string {
  if (nota >= 5) return "C";
  else if (nota >= 7) return "B";
  else if (nota >= 9) return "A";
  else return "D";
}

/** switch - compara com === e exige `break` (ou `return`) em cada caso. */
export function diaDaSemana(numero: number): string {
  switch (numero) {
    case 1:
      return "domingo";
    case 2:
      return "segunda";
    case 7:
      return "sabado";
    default:
      return "dia invalido";
  }
}

/** Ternario: um if/else que cabe numa expressao. So use quando fica legivel. */
export function situacao(media: number): string {
  return media >= 6 ? "aprovado" : "reprovado";
}
