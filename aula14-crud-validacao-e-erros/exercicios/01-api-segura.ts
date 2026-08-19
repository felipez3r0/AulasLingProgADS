// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// Corrija os tres defeitos da leitura critica:
//   1. vazamento de senhaHash e cpf na resposta
//   2. mass assignment (o cliente escolhendo id e admin)
//   3. erro interno exposto, e 500 onde deveria ser 404
//
// Rode: npm run ex -- 01-api-segura

export interface Usuario {
  id: string;
  email: string;
  senhaHash: string;
  cpf: string;
  admin: boolean;
}

/** O que pode sair na resposta. Nem tudo que existe no modelo. */
export interface UsuarioPublico {
  id: string;
  email: string;
  admin: boolean;
}

/**
 * API de usuarios.
 *
 * Contrato:
 *
 *   GET /usuarios
 *     200 com a lista em formato PUBLICO (sem senhaHash, sem cpf)
 *
 *   GET /usuarios/:id
 *     200 em formato publico
 *     404 { erro: "usuario nao encontrado" }
 *
 *   POST /usuarios
 *     corpo aceito: APENAS { email, senha }
 *     qualquer outro campo enviado e IGNORADO (nao lanca erro)
 *     201 em formato publico, com Location "/usuarios/<id>"
 *     o usuario nasce com admin false, id da sequencia, e
 *     senhaHash = "hash:" + senha
 *     email ausente, vazio ou sem "@" -> 400 { erro: "dados invalidos" }
 *     senha com menos de 8 caracteres -> 400 { erro: "dados invalidos" }
 *     email ja cadastrado (ignorando maiusculas) -> 409 { erro: "email ja cadastrado" }
 *
 *   qualquer outra rota -> 404 { erro: "rota nao encontrada" }
 *
 *   qualquer erro nao previsto -> 500 { erro: "erro interno" }
 *     SEM stack, SEM mensagem interna
 */
export function criarApp(_iniciais: Usuario[] = []): import("express").Express {
  throw new Error("TODO: implemente criarApp");
}
