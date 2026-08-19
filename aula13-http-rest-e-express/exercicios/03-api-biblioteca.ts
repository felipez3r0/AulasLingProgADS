// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-api-biblioteca.spec.md ANTES de chamar
// o agente. Depois: git diff, e revise linha a linha.
//
// Rode: npm run ex -- 03-api-biblioteca

export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  disponivel: boolean;
}

export interface Emprestimo {
  id: string;
  livroId: string;
  aluno: string;
}

/**
 * API de biblioteca com dois recursos relacionados.
 *
 * GET /livros
 *   200 com a lista
 *   query `disponivel=true|false` filtra; outro valor -> 400 { erro: "filtro invalido" }
 *   query `autor` filtra por trecho do nome, ignorando maiusculas
 *
 * GET /livros/:id
 *   200 | 404 { erro: "livro nao encontrado" }
 *
 * POST /livros
 *   201 com Location "/livros/<id>"; o livro nasce disponivel
 *   titulo ou autor ausentes/vazios -> 400 { erro: "dados invalidos" }
 *   id e o proximo numero da sequencia, como texto
 *
 * POST /emprestimos
 *   corpo { livroId, aluno }
 *   201 com Location "/emprestimos/<id>"; marca o livro como indisponivel
 *   livroId ou aluno ausentes -> 400 { erro: "dados invalidos" }
 *   livro inexistente -> 404 { erro: "livro nao encontrado" }
 *   livro indisponivel -> 409 { erro: "livro indisponivel" }
 *   aluno com 3 emprestimos ativos -> 409 { erro: "limite de emprestimos atingido" }
 *
 * DELETE /emprestimos/:id
 *   204, e o livro volta a ficar disponivel
 *   404 { erro: "emprestimo nao encontrado" }
 *
 * GET /emprestimos
 *   200 com a lista; query `aluno` filtra por nome exato
 *
 * qualquer outra rota -> 404 { erro: "rota nao encontrada" }
 */
export function criarApp(
  _livros: Livro[] = [],
  _emprestimos: Emprestimo[] = [],
): import("express").Express {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
