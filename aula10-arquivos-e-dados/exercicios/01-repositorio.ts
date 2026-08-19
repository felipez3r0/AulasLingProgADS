// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// Corrija os tres defeitos da leitura critica:
//   1. caminho fixo   -> receba o caminho como parametro
//   2. catch que engole -> falhe alto com JSON corrompido
//   3. escrita direta -> escreva de forma atomica (temporario + rename)
//
// Rode: npm run ex -- 01-repositorio

export interface Aluno {
  id: string;
  nome: string;
  ra: string;
}

/**
 * Le a colecao de alunos.
 *
 * Especificacao:
 *   - arquivo inexistente devolve lista vazia (nao e erro)
 *   - JSON invalido REJEITA com Error("arquivo corrompido")
 *   - JSON valido que nao seja uma lista REJEITA com Error("formato invalido")
 */
export async function lerAlunos(_caminho: string): Promise<Aluno[]> {
  throw new Error("TODO: implemente lerAlunos");
}

/**
 * Salva a colecao inteira.
 *
 * Especificacao:
 *   - cria as pastas do caminho se nao existirem
 *   - escrita ATOMICA: grave em `<caminho>.tmp` e so entao renomeie
 *   - nao deixa arquivo temporario para tras
 *   - grava com indentacao de 2 espacos
 */
export async function salvarAlunos(_caminho: string, _alunos: Aluno[]): Promise<void> {
  throw new Error("TODO: implemente salvarAlunos");
}

/**
 * Acrescenta um aluno.
 *
 * Especificacao:
 *   - RA ja existente REJEITA com Error("RA duplicado: <ra>")
 *   - devolve o aluno inserido
 *   - preserva os alunos anteriores
 */
export async function inserirAluno(_caminho: string, _aluno: Aluno): Promise<Aluno> {
  throw new Error("TODO: implemente inserirAluno");
}
