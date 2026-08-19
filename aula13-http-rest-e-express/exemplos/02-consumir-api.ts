// Consumir API com fetch e async/await.
//
// O `buscar` e injetado como parametro para que o teste possa
// substitui-lo. Codigo que chama a rede direto e codigo que so da
// para testar com a rede no ar.

export interface Cotacao {
  moeda: string;
  valor: number;
}

export type FuncaoBuscar = typeof fetch;

/**
 * Busca a cotacao de uma moeda.
 *
 * Repare no tratamento: `fetch` NAO lanca para status 404 ou 500.
 * Ele so lanca quando a requisicao nem aconteceu (rede fora, DNS).
 * Checar `response.ok` e obrigatorio.
 */
export async function buscarCotacao(
  moeda: string,
  buscar: FuncaoBuscar = fetch,
): Promise<Cotacao> {
  const resposta = await buscar(`https://exemplo.invalido/cotacao/${moeda}`);

  if (!resposta.ok) {
    throw new Error(`falha ao buscar cotacao: HTTP ${resposta.status}`);
  }

  const dados = (await resposta.json()) as { valor?: unknown };
  if (typeof dados.valor !== "number") {
    throw new Error("resposta em formato inesperado");
  }

  return { moeda, valor: dados.valor };
}

/**
 * Busca varias cotacoes EM PARALELO.
 *
 * Um `for` com `await` dentro faria uma requisicao de cada vez.
 * `Promise.all` dispara todas e espera o conjunto.
 */
export async function buscarVarias(
  moedas: string[],
  buscar: FuncaoBuscar = fetch,
): Promise<Cotacao[]> {
  return Promise.all(moedas.map((m) => buscarCotacao(m, buscar)));
}

/**
 * Mesma coisa, mas tolerante: uma falha nao derruba as outras.
 * `Promise.allSettled` espera todas e informa o desfecho de cada uma.
 */
export async function buscarVariasTolerante(
  moedas: string[],
  buscar: FuncaoBuscar = fetch,
): Promise<{ sucessos: Cotacao[]; falhas: string[] }> {
  const resultados = await Promise.allSettled(moedas.map((m) => buscarCotacao(m, buscar)));
  const sucessos: Cotacao[] = [];
  const falhas: string[] = [];
  resultados.forEach((r, i) => {
    if (r.status === "fulfilled") sucessos.push(r.value);
    else falhas.push(moedas[i] ?? "");
  });
  return { sucessos, falhas };
}
