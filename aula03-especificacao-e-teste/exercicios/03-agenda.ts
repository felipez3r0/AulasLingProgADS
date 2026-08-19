// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-agenda.spec.md ANTES de chamar o agente.
// Depois: git diff, e revise linha a linha.
//
// Rode: npm run ex -- 03-agenda

export interface Compromisso {
  titulo: string;
  inicio: number; // hora do dia, 0 a 23
  fim: number;    // hora do dia, 0 a 23
}

/**
 * Encontra conflitos de horario numa agenda.
 *
 * Regras:
 *   - dois compromissos conflitam quando seus intervalos se sobrepoem
 *   - encostar nao e conflito: um terminando as 10 e outro comecando as 10 esta ok
 *   - cada par conflitante aparece UMA vez, com os titulos em ordem alfabetica
 *   - os pares vem ordenados pelo primeiro titulo; empate desempata pelo segundo
 *   - compromisso com fim <= inicio lanca Error("horario invalido")
 *   - agenda vazia ou com um compromisso devolve lista vazia
 *   - a funcao NAO pode modificar o array recebido
 */
export function encontrarConflitos(_agenda: Compromisso[]): [string, string][] {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
