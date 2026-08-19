// Reproducao minima: reduzir ate sobrar so o que quebra.
//
// Este arquivo mostra o caminho de reducao em quatro passos, do bug
// "no meio de um pipeline grande" ate a linha que realmente falha.

export interface Venda {
  vendedor: string;
  valor: number;
  data: string;
}

/** PASSO 1 - O bug aparece aqui, no meio de tudo. */
export function relatorioMensal(vendas: Venda[]): Record<string, number> {
  const porVendedor: Record<string, number> = {};
  for (const venda of vendas) {
    const chave = normalizarNome(venda.vendedor);
    porVendedor[chave] = (porVendedor[chave] ?? 0) + venda.valor;
  }
  return porVendedor;
}

/**
 * PASSO 2 - Suspeita: a normalizacao. Isolada, da para testar sozinha.
 *
 * `split(" ").join(" ")` parece que normaliza espacos, mas nao faz nada:
 * o que foi separado por um espaco e reunido pelo mesmo espaco. Espacos
 * repetidos e tabulacoes sobrevivem intactos.
 */
export function normalizarNome(nome: string): string {
  return nome.trim().toLowerCase().split(" ").join(" ");
}

/**
 * PASSO 3 - A menor entrada que reproduz.
 * Nomes com espacos duplos, tabulacao ou acentuacao diferente viram
 * chaves DIFERENTES, entao o mesmo vendedor aparece duas vezes.
 */
export function reproducaoMinima(): { a: string; b: string; iguais: boolean } {
  const a = normalizarNome("Ana  Silva"); // dois espacos
  const b = normalizarNome("Ana Silva");
  return { a, b, iguais: a === b };
}

/**
 * PASSO 4 - A correcao, com o caso minimo virando teste permanente.
 *
 * `split(/\s+/)` separa por QUALQUER sequencia de espacos em branco,
 * e o `filter(Boolean)` descarta os vazios das pontas.
 */
export function normalizarNomeCorrigido(nome: string): string {
  return nome.trim().toLowerCase().split(/\s+/).filter(Boolean).join(" ");
}

export function relatorioMensalCorrigido(vendas: Venda[]): Record<string, number> {
  const porVendedor: Record<string, number> = {};
  for (const venda of vendas) {
    const chave = normalizarNomeCorrigido(venda.vendedor);
    porVendedor[chave] = (porVendedor[chave] ?? 0) + venda.valor;
  }
  return porVendedor;
}
