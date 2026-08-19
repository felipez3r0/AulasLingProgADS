// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// A refatoracao da leitura critica trocou `null` por `undefined` sem avisar.
// Reescreva a funcao mantendo o comportamento ORIGINAL: nao encontrado
// devolve `null`.
//
// Voce pode usar `find` ou laco - o que importa e o contrato, nao o estilo.
//
// Rode: npm run ex -- aula02/01

export interface Aluno {
  ra: string;
  nome: string;
}

/**
 * Busca um aluno pelo RA.
 * Devolve `null` quando nao encontra - igual a versao original.
 */
export function buscarAluno(_alunos: Aluno[], _ra: string): Aluno | null {
  throw new Error("TODO: implemente buscarAluno");
}
