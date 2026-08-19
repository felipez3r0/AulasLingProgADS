// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// As tres rodadas da leitura critica falharam porque nunca existiu uma
// especificacao. Aqui ela esta escrita. Implemente de uma vez so.
//
// Rode: npm run ex -- 01-paginacao

export interface Pagina<T> {
  itens: T[];
  paginaAtual: number;
  totalPaginas: number;
  temProxima: boolean;
  temAnterior: boolean;
}

/**
 * Pagina uma lista.
 *
 * Especificacao:
 *   - as paginas sao numeradas a partir de 1
 *   - `porPagina` menor que 1 lanca Error("itens por pagina invalido")
 *   - `pagina` menor que 1 lanca Error("pagina invalida")
 *   - `pagina` acima do total devolve itens vazios (nao e erro)
 *   - totalPaginas e o teto de length/porPagina
 *   - lista vazia: totalPaginas 0, itens vazios, temProxima e temAnterior false
 *   - temAnterior e true quando paginaAtual > 1
 *   - temProxima e true quando paginaAtual < totalPaginas
 *   - NAO modifica a lista recebida
 */
export function paginar<T>(_lista: T[], _pagina: number, _porPagina: number): Pagina<T> {
  throw new Error("TODO: implemente paginar");
}
