// Variaveis, constantes e tipos.
//
// A anotacao de tipo nao e enfeite: e a parte do seu pedido que o
// compilador cobra. Quando a IA escreve o corpo da funcao, o tipo e
// quem verifica se o corpo corresponde ao que voce prometeu.

/** `const` para o que nao muda. Use por padrao. */
export const NOTA_MAXIMA = 10;

/** Tipos primitivos que voce vai usar o semestre inteiro. */
export function tiposPrimitivos(): {
  texto: string;
  numero: number;
  booleano: boolean;
  ausente: null;
} {
  const texto: string = "Ana";
  const numero: number = 8.5;
  const booleano: boolean = true;
  const ausente: null = null;
  return { texto, numero, booleano, ausente };
}

/**
 * O TypeScript INFERE o tipo quando voce nao anota.
 * `let contador = 0` ja e `number` - anotar seria redundante.
 * Anote quando o tipo nao for obvio, ou quando quiser fixar o contrato.
 */
export function contarAte(limite: number): number {
  let contador = 0; // inferido como number
  while (contador < limite) {
    contador += 1;
  }
  return contador;
}

/**
 * `const` impede REATRIBUIR, nao impede MUTAR.
 * Este e o mal-entendido mais comum de quem vem de C.
 */
export function constNaoCongelaObjeto(): number[] {
  const numeros = [1, 2, 3];
  numeros.push(4); // permitido: o array e o mesmo, so mudou o conteudo
  // numeros = [9];  // proibido: isso seria reatribuir
  return numeros;
}
