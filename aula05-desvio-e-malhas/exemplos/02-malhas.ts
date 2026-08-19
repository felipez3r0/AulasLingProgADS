// Controle de malhas: for, while, do-while, for...of.

/** for classico: inicializacao; condicao; incremento. */
export function somarAte(n: number): number {
  let soma = 0;
  for (let i = 1; i <= n; i++) {
    soma += i;
  }
  return soma;
}

/** for...of percorre os VALORES. E o que voce quer na maior parte das vezes. */
export function somarLista(numeros: number[]): number {
  let soma = 0;
  for (const numero of numeros) {
    soma += numero;
  }
  return soma;
}

/** while: testa antes. Pode nao executar nenhuma vez. */
export function contarDigitos(n: number): number {
  if (n === 0) return 1;
  let restante = Math.abs(n);
  let digitos = 0;
  while (restante > 0) {
    restante = Math.floor(restante / 10);
    digitos++;
  }
  return digitos;
}

/** do-while: testa depois. Executa SEMPRE ao menos uma vez. */
export function peloMenosUmaVez(): number {
  let voltas = 0;
  do {
    voltas++;
  } while (false);
  return voltas;
}

/** break sai do laco; continue pula para a proxima volta. */
export function primeiroNegativo(numeros: number[]): number | null {
  for (const numero of numeros) {
    if (numero >= 0) continue;
    return numero;
  }
  return null;
}

/** Lacos aninhados: o de dentro roda inteiro a cada volta do de fora. */
export function tabuada(ate: number): string[] {
  const linhas: string[] = [];
  for (let i = 1; i <= ate; i++) {
    for (let j = 1; j <= ate; j++) {
      linhas.push(`${i}x${j}=${i * j}`);
    }
  }
  return linhas;
}
