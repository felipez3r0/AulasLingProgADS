// Um dialogo real com IA, reproduzido como codigo.
//
// PEDIDO: "essa funcao de paginacao ta com bug, conserta"
//
// A cada rodada a IA "consertou" e o bug mudou de lugar. Este e o
// padrao que voce precisa reconhecer: quando as correcoes deixam de
// convergir, o problema nao e a implementacao - e o diagnostico.

export interface Pagina<T> {
  itens: T[];
  paginaAtual: number;
  totalPaginas: number;
}

/** RODADA 1 - "a ultima pagina vem vazia" */
export function paginarV1<T>(lista: T[], pagina: number, porPagina: number): Pagina<T> {
  const inicio = pagina * porPagina;
  return {
    itens: lista.slice(inicio, inicio + porPagina),
    paginaAtual: pagina,
    totalPaginas: Math.floor(lista.length / porPagina),
  };
}

/** RODADA 2 - "agora conta certo, mas a pagina 1 pula os primeiros" */
export function paginarV2<T>(lista: T[], pagina: number, porPagina: number): Pagina<T> {
  const inicio = pagina * porPagina;
  return {
    itens: lista.slice(inicio, inicio + porPagina),
    paginaAtual: pagina,
    totalPaginas: Math.ceil(lista.length / porPagina),
  };
}

/** RODADA 3 - "agora a pagina 1 funciona, mas quebrou com lista vazia" */
export function paginarV3<T>(lista: T[], pagina: number, porPagina: number): Pagina<T> {
  const inicio = (pagina - 1) * porPagina;
  return {
    itens: lista.slice(inicio, inicio + porPagina),
    paginaAtual: pagina,
    totalPaginas: Math.ceil(lista.length / porPagina),
  };
}
