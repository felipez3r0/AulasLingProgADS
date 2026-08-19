// Duas implementacoes da mesma funcao.
//
// As duas passam num teste ingenuo. So uma esta certa.
// A licao da aula 01 esta aqui: o teste que voce escreve decide
// o que voce consegue enxergar.

/** Aplica um desconto percentual sobre um valor. */
export function aplicarDescontoCerto(valor: number, percentual: number): number {
  return valor - valor * (percentual / 100);
}

/**
 * Mesma assinatura, resultado diferente: esta versao trata o percentual
 * como fracao, entao `aplicarDescontoErrado(100, 10)` devolve 99.9, nao 90.
 *
 * Um teste que so verificasse "o resultado e menor que o valor original"
 * aprovaria as duas.
 */
export function aplicarDescontoErrado(valor: number, percentual: number): number {
  return valor - percentual / 100;
}
