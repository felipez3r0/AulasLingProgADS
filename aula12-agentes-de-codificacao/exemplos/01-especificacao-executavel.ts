// Uma especificacao executavel: a mesma tarefa descrita de dois jeitos.
//
// Este arquivo nao ensina sintaxe nova. Ele mostra a DIFERENCA entre
// um pedido e um contrato - e por que so o segundo e delegavel.

/**
 * PEDIDO VAGO (o que a maioria escreve):
 *
 *   "faz uma funcao que calcula o desconto do cliente"
 *
 * Perguntas que ficaram em aberto - e que o agente vai responder sozinho:
 *   - desconto sobre o que?
 *   - as faixas acumulam?
 *   - cliente sem historico?
 *   - o que e "cliente antigo"?
 *   - arredonda como?
 */

export interface Cliente {
  nome: string;
  comprasNoAno: number;
  totalGastoNoAno: number;
  desdeQuandoEmMeses: number;
}

/**
 * CONTRATO (o que voce deve escrever):
 *
 * Calcula o percentual de desconto do cliente.
 *
 *   - base por volume gasto no ano:
 *       ate 1000        -> 0
 *       acima de 1000   -> 5
 *       acima de 5000   -> 10
 *     (as faixas NAO acumulam: vale a mais alta atingida)
 *
 *   - bonus de fidelidade, SOMADO a base:
 *       12 meses ou mais de casa -> +2
 *       24 meses ou mais         -> +5 (substitui o +2, nao soma)
 *
 *   - bonus de frequencia, SOMADO ao resultado:
 *       10 compras ou mais no ano -> +3
 *
 *   - o desconto total e limitado a 15
 *   - valores negativos em qualquer campo lancam Error("dados invalidos")
 *   - o resultado e um inteiro
 *
 * Criterio de aceite: `npm test -- 01-especificacao` verde.
 */
export function calcularDesconto(cliente: Cliente): number {
  if (
    cliente.comprasNoAno < 0 ||
    cliente.totalGastoNoAno < 0 ||
    cliente.desdeQuandoEmMeses < 0
  ) {
    throw new Error("dados invalidos");
  }

  let desconto = 0;
  if (cliente.totalGastoNoAno > 5000) desconto = 10;
  else if (cliente.totalGastoNoAno > 1000) desconto = 5;

  if (cliente.desdeQuandoEmMeses >= 24) desconto += 5;
  else if (cliente.desdeQuandoEmMeses >= 12) desconto += 2;

  if (cliente.comprasNoAno >= 10) desconto += 3;

  return Math.min(desconto, 15);
}
