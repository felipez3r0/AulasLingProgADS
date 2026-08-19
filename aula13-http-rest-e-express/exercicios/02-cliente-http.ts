// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Metodo: contrato primeiro, sugestao depois.
//
// O Copilot vai escrever `await fetch(...)` e ir direto para o
// `.json()`. Ele esquece de checar `response.ok` com muita frequencia -
// porque `fetch` NAO lanca para 404 nem para 500.
//
// Rode: npm run ex -- 02-cliente-http

export interface Aluno {
  id: string;
  nome: string;
  ra: string;
}

export type FuncaoBuscar = typeof fetch;

export interface ResultadoBusca {
  encontrados: Aluno[];
  naoEncontrados: string[];
  falhas: { id: string; motivo: string }[];
}

/**
 * Busca varios alunos por id, tolerando falhas individuais.
 *
 * Especificacao:
 *   - a URL de cada aluno e `${baseUrl}/alunos/${id}`
 *   - status 200: o aluno entra em `encontrados`
 *   - status 404: o id entra em `naoEncontrados`
 *   - qualquer outro status: entra em `falhas` com
 *     motivo "HTTP <status>"
 *   - se `fetch` rejeitar (rede fora), entra em `falhas` com
 *     motivo "falha de rede"
 *   - se o corpo do 200 nao tiver `id`, `nome` e `ra` como string,
 *     entra em `falhas` com motivo "resposta invalida"
 *   - as requisicoes acontecem EM PARALELO
 *   - a ordem de cada lista segue a ordem dos ids recebidos
 *   - lista de ids vazia devolve as tres listas vazias
 *   - a funcao NUNCA rejeita: toda falha vira dado no resultado
 */
export async function buscarAlunos(
  _baseUrl: string,
  _ids: string[],
  _buscar: FuncaoBuscar = fetch,
): Promise<ResultadoBusca> {
  throw new Error("TODO: implemente buscarAlunos");
}
