// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// Corrija os status HTTP da leitura critica.
//
// Regra de ouro: 4xx e culpa do CLIENTE (ele mandou algo errado);
// 5xx e culpa do SERVIDOR (ele falhou processando algo valido).
// Devolver 5xx para erro do cliente faz clientes bem escritos
// tentarem de novo para sempre.
//
// Rode: npm run ex -- 01-status-corretos

export interface Produto {
  id: string;
  nome: string;
  preco: number;
}

/**
 * Cria a aplicacao Express de produtos.
 *
 * Contrato das rotas:
 *
 *   GET /produtos
 *     200 com a lista
 *     query `precoMax`: filtra produtos com preco menor ou igual
 *     `precoMax` nao numerico -> 400 { erro: "precoMax invalido" }
 *
 *   GET /produtos/:id
 *     200 com o produto
 *     404 { erro: "produto nao encontrado" }
 *
 *   POST /produtos
 *     201 com o produto criado, e cabecalho Location "/produtos/<id>"
 *     nome ausente ou vazio, ou preco nao numerico -> 400 { erro: "dados invalidos" }
 *     preco negativo -> 400 { erro: "dados invalidos" }
 *     nome ja existente (ignorando maiusculas) -> 409 { erro: "produto ja existe" }
 *     o id e o proximo numero da sequencia, como texto
 *
 *   PUT /produtos/:id
 *     200 com o produto atualizado
 *     404 quando nao existe
 *     preco ausente, nao numerico ou negativo -> 400 { erro: "dados invalidos" }
 *
 *   DELETE /produtos/:id
 *     204 sem corpo
 *     404 quando nao existe
 *
 *   qualquer outra rota
 *     404 { erro: "rota nao encontrada" }
 */
export function criarApp(_iniciais: Produto[] = []): import("express").Express {
  throw new Error("TODO: implemente criarApp");
}
