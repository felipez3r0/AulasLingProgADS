// Codigo gerado por IA a partir do pedido:
//
//   "modela o estado de um pedido: pode estar pendente, pago,
//    enviado com codigo de rastreio, ou cancelado com motivo"
//
// Leia antes de rodar. O tipo compila. Ele tambem permite estados
// que nao existem no mundo real.

/**
 * Estado de um pedido.
 */
export interface Pedido {
  id: string;
  status: "pendente" | "pago" | "enviado" | "cancelado";
  codigoRastreio?: string;
  motivoCancelamento?: string;
  dataPagamento?: string;
}

/** Devolve uma mensagem para o cliente. */
export function mensagemDoPedido(pedido: Pedido): string {
  if (pedido.status === "enviado") {
    return `Pedido a caminho. Rastreio: ${pedido.codigoRastreio}`;
  }
  if (pedido.status === "cancelado") {
    return `Pedido cancelado: ${pedido.motivoCancelamento}`;
  }
  return `Pedido ${pedido.status}`;
}
