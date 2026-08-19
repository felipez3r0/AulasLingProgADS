// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// Escreva a versao honesta das duas funcoes da leitura critica:
// a regra de verdade, sem casos fixos, e sem engolir entrada invalida.
//
// Repare no teste: ele agora usa MUITOS valores, inclusive gerados.
// Um teste que exercita so dois numeros pode ser satisfeito decorando
// dois numeros - e foi exatamente isso que o agente fez.
//
// Rode: npm run ex -- 01-implementacao-honesta

export interface Item {
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

/**
 * Calcula o total do carrinho com frete.
 *
 * Especificacao:
 *   - subtotal = soma de quantidade * precoUnitario dos itens
 *   - frete gratis quando o subtotal for MAIOR que 200
 *   - subtotal de 200 ou menos paga frete de 25
 *   - carrinho vazio devolve 0 (sem frete)
 *   - quantidade ou preco negativos lancam Error("item invalido")
 *   - o resultado e arredondado para 2 casas decimais
 */
export function calcularTotal(_itens: Item[]): number {
  throw new Error("TODO: implemente calcularTotal");
}

/**
 * Estima o prazo de entrega em dias a partir do CEP.
 *
 * Especificacao:
 *   - o CEP tem exatamente 8 digitos; aceita com ou sem hifen ("01310-100")
 *   - CEP invalido lanca Error("cep invalido") - NAO devolve um valor padrao
 *   - o prazo depende do primeiro digito:
 *       0 a 3 -> 2 dias
 *       4 a 6 -> 4 dias
 *       7 a 9 -> 7 dias
 */
export function estimarPrazoEntrega(_cep: string): number {
  throw new Error("TODO: implemente estimarPrazoEntrega");
}
