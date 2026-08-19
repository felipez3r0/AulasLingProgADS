// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Metodo: modele os TIPOS primeiro, com a IA desligada ou so no chat.
// Depois ligue o Copilot para implementar as funcoes.
//
// A ordem importa: com os tipos fechados, a sugestao do Copilot nasce
// muito mais restrita - e o compilador recusa o que estiver fora.
//
// Rode: npm run ex -- 02-catalogo

/** Um item do catalogo pode ser um livro, um filme ou um curso. */
export type ItemCatalogo =
  | { tipo: "livro"; titulo: string; autor: string; paginas: number }
  | { tipo: "filme"; titulo: string; diretor: string; minutos: number }
  | { tipo: "curso"; titulo: string; instrutor: string; horas: number };

export interface ResumoCatalogo {
  totalItens: number;
  porTipo: { livro: number; filme: number; curso: number };
  tempoTotalMinutos: number;
  titulosOrdenados: string[];
}

/**
 * Descreve um item em uma linha.
 *
 * Especificacao:
 *   - livro: "<titulo>, de <autor> (<paginas> paginas)"
 *   - filme: "<titulo>, dirigido por <diretor> (<minutos> min)"
 *   - curso: "<titulo>, com <instrutor> (<horas>h)"
 *   - use switch com verificacao de exaustividade
 */
export function descrever(_item: ItemCatalogo): string {
  throw new Error("TODO: implemente descrever");
}

/**
 * Estima o tempo de consumo em minutos.
 *
 * Especificacao:
 *   - livro: 2 minutos por pagina
 *   - filme: os proprios minutos
 *   - curso: 60 minutos por hora
 */
export function tempoEmMinutos(_item: ItemCatalogo): number {
  throw new Error("TODO: implemente tempoEmMinutos");
}

/**
 * Resume o catalogo.
 *
 * Especificacao:
 *   - totalItens: quantidade de itens
 *   - porTipo: contagem de cada tipo (zero quando nao ha)
 *   - tempoTotalMinutos: soma de tempoEmMinutos de todos
 *   - titulosOrdenados: titulos em ordem alfabetica crescente
 *   - catalogo vazio devolve tudo zerado e lista vazia
 *   - NAO modifica o array recebido
 */
export function resumir(_catalogo: ItemCatalogo[]): ResumoCatalogo {
  throw new Error("TODO: implemente resumir");
}
