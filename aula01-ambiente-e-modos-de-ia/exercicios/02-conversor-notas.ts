// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Voce dirige, a IA digita.
//
// Metodo obrigatorio:
//   1. Escreva PRIMEIRO a assinatura e o contrato em comentario.
//   2. So entao aceite sugestoes do Copilot.
//   3. Nao aceite nada que voce nao conseguiria ter escrito.
//
// Rode: npm run ex -- aula01/02

/**
 * Converte uma nota numerica (0 a 10) no conceito correspondente.
 *
 * Contrato:
 *   nota >= 9        -> "A"
 *   nota >= 7        -> "B"
 *   nota >= 5        -> "C"
 *   nota <  5        -> "D"
 *   fora de 0..10    -> lanca Error com a mensagem "nota invalida"
 *
 * Repare que este bloco de comentario e, ao mesmo tempo, a especificacao
 * para voce, o contexto para o Copilot e a base dos testes.
 */
export function converterNota(_nota: number): string {
  throw new Error("TODO: implemente converterNota");
}
