// Funcoes: a assinatura e um contrato verificado pelo compilador.

/** Declaracao classica. Nome, parametros tipados, tipo de retorno. */
export function somar(a: number, b: number): number {
  return a + b;
}

/** Arrow function: mais curta, usada em callbacks e funcoes pequenas. */
export const multiplicar = (a: number, b: number): number => a * b;

/** Parametro opcional vem depois dos obrigatorios. */
export function saudar(nome: string, titulo?: string): string {
  return titulo ? `Ola, ${titulo} ${nome}` : `Ola, ${nome}`;
}

/** Valor padrao: usado quando o argumento nao e informado. */
export function aplicarJuros(valor: number, taxa: number = 0.01): number {
  return Math.round(valor * (1 + taxa) * 100) / 100;
}

/** Rest: numero variavel de argumentos, empacotados num array. */
export function somarTodos(...numeros: number[]): number {
  return numeros.reduce((total, n) => total + n, 0);
}

/** Tipo de funcao: da para nomear a assinatura e reusar. */
export type Operacao = (a: number, b: number) => number;

/** Funcoes sao valores: podem ser passadas como argumento. */
export function calcular(a: number, b: number, operacao: Operacao): number {
  return operacao(a, b);
}
