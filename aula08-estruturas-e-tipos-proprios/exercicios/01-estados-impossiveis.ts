// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// Substitua a interface de campos opcionais por uma UNIAO DISCRIMINADA,
// de forma que estados impossiveis nao possam sequer ser escritos.
//
// A prova de que voce acertou nao esta so nos testes: se voce tentar
// criar `{ status: "enviado" }` sem rastreio, o codigo NAO DEVE COMPILAR.
//
// Rode: npm run ex -- 01-estados-impossiveis
// E tambem: npm run typecheck

/**
 * Estado de um pedido, modelado como uniao discriminada.
 *
 * Especificacao das variantes:
 *   - pendente:  { status: "pendente" }
 *   - pago:      { status: "pago"; dataPagamento: string }
 *   - enviado:   { status: "enviado"; dataPagamento: string; codigoRastreio: string }
 *   - cancelado: { status: "cancelado"; motivo: string }
 *
 * Todas tem `id: string`.
 *
 * TODO: substitua o `type Pedido` abaixo pela uniao discriminada.
 */
export type Pedido =
  | { id: string; status: "pendente" }
  // TODO: complete as outras tres variantes
  ;

/**
 * Devolve a mensagem para o cliente.
 *
 * Especificacao:
 *   - pendente:  "Pedido aguardando pagamento"
 *   - pago:      "Pagamento confirmado em <dataPagamento>"
 *   - enviado:   "Pedido a caminho. Rastreio: <codigoRastreio>"
 *   - cancelado: "Pedido cancelado: <motivo>"
 *
 *   - nenhuma mensagem pode conter "undefined"
 *   - use `switch` com verificacao de exaustividade (o caso `never`),
 *     para que acrescentar uma variante nova quebre a compilacao
 */
export function mensagemDoPedido(_pedido: Pedido): string {
  throw new Error("TODO: implemente mensagemDoPedido");
}
