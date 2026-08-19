// Codigo gerado por IA a partir do pedido:
//
//   "refatora essa funcao pra ficar mais limpa"
//
// A funcao original estava assim:
//
//   export function buscarAluno(alunos: Aluno[], ra: string): Aluno | null {
//     for (const aluno of alunos) {
//       if (aluno.ra === ra) {
//         return aluno;
//       }
//     }
//     return null;
//   }
//
// Leia o "depois" abaixo e compare mentalmente com o "antes".
// O diff seria de 5 linhas. Uma coisa mudou.

export interface Aluno {
  ra: string;
  nome: string;
}

/** Busca um aluno pelo RA. */
export function buscarAluno(alunos: Aluno[], ra: string): Aluno | undefined {
  return alunos.find((aluno) => aluno.ra === ra);
}
