// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-maquina-de-estados.spec.md ANTES de
// chamar o agente. Depois: git diff, e revise linha a linha.
//
// Rode: npm run ex -- 03-maquina

import type { Pedido } from "./01-estados-impossiveis.js";

export type Evento =
  | { tipo: "pagar"; data: string }
  | { tipo: "enviar"; codigoRastreio: string }
  | { tipo: "cancelar"; motivo: string };

export type Transicao =
  | { ok: true; pedido: Pedido }
  | { ok: false; erro: string };

/**
 * Aplica um evento a um pedido, devolvendo o novo estado.
 *
 * Transicoes permitidas:
 *   pendente  + pagar     -> pago
 *   pago      + enviar    -> enviado
 *   pendente  + cancelar  -> cancelado
 *   pago      + cancelar  -> cancelado
 *
 * Qualquer outra combinacao e recusada com
 *   { ok: false, erro: "transicao invalida: <status> + <tipo>" }
 *
 * Regras:
 *   - pedido enviado nao aceita mais nenhum evento
 *   - pedido cancelado nao aceita mais nenhum evento
 *   - ao enviar, a dataPagamento do estado "pago" e preservada
 *   - a funcao NAO lanca excecao: falha e representada no tipo de retorno
 *   - a funcao NAO modifica o pedido recebido
 *   - o id e sempre preservado
 */
export function aplicarEvento(_pedido: Pedido, _evento: Evento): Transicao {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
