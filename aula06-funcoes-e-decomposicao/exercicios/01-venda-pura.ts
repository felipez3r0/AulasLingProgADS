// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// Reescreva a funcao da leitura critica sem efeito colateral:
// ela nao pode modificar o produto recebido nem depender de estado global.
//
// Rode: npm run ex -- 01-venda-pura

export interface Produto {
  nome: string;
  preco: number;
  estoque: number;
}

export interface ResultadoVenda {
  valor: number;
  produtoAtualizado: Produto;
}

/**
 * Registra uma venda de forma pura.
 *
 * Especificacao:
 *   - devolve o valor da venda (quantidade * preco) e um NOVO produto
 *     com o estoque ja descontado
 *   - NAO modifica o produto recebido
 *   - nao usa nem altera nenhuma variavel fora da funcao
 *   - quantidade maior que o estoque lanca Error("estoque insuficiente")
 *   - quantidade zero ou negativa lanca Error("quantidade invalida")
 *   - o valor e arredondado para 2 casas decimais
 *   - vender exatamente todo o estoque e permitido (estoque final zero)
 */
export function registrarVenda(_produto: Produto, _quantidade: number): ResultadoVenda {
  throw new Error("TODO: implemente registrarVenda");
}
