// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-historico.spec.md ANTES de chamar o agente.
// Depois: git diff, e revise linha a linha.
//
// Rode: npm run ex -- aula02/03

export interface Commit {
  hash: string;
  autor: string;
  mensagem: string;
  arquivosAlterados: number;
}

export interface ResumoAutor {
  autor: string;
  commits: number;
  arquivosAlterados: number;
}

/**
 * Resume um historico de commits por autor.
 *
 * Regras:
 *   - um item por autor, com a contagem de commits e o total de arquivos alterados
 *   - ordenado por numero de commits, do maior para o menor
 *   - empate em commits e desempatado pelo nome do autor, em ordem alfabetica
 *   - historico vazio devolve lista vazia
 *   - a funcao NAO pode modificar o array recebido
 */
export function resumirPorAutor(_commits: Commit[]): ResumoAutor[] {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
