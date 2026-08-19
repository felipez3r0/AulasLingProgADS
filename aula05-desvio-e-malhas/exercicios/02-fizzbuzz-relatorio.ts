// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Metodo: escreva o contrato primeiro, aceite sugestao depois.
// Este e um caso em que o Copilot vai sugerir a resposta classica quase
// instantaneamente - e a resposta classica NAO atende a especificacao,
// porque aqui a ordem das regras e diferente.
//
// Ler a sugestao com atencao vale mais que digitar rapido.
//
// Rode: npm run ex -- 02-fizzbuzz

export interface ResumoRelatorio {
  linhas: string[];
  totalFizz: number;
  totalBuzz: number;
  totalFizzBuzz: number;
  totalNumeros: number;
}

/**
 * Gera o relatorio de 1 ate `limite`.
 *
 * Especificacao:
 *   - multiplo de 3 e de 5 -> "FizzBuzz"
 *   - multiplo de 3        -> "Fizz"
 *   - multiplo de 5        -> "Buzz"
 *   - demais              -> o proprio numero como texto
 *
 *   - os contadores sao EXCLUSIVOS: um "FizzBuzz" conta apenas em
 *     totalFizzBuzz, e nao em totalFizz nem em totalBuzz
 *   - totalNumeros conta as linhas que sairam como numero
 *   - limite menor que 1 devolve linhas vazias e todos os contadores em zero
 */
export function gerarRelatorio(_limite: number): ResumoRelatorio {
  throw new Error("TODO: implemente gerarRelatorio");
}
