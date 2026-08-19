import { describe, it, expect } from "vitest";
import { mensagemDoPedido, type Pedido } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA o defeito. Por isso ele passa.
// Corrigir e o exercicio 1 da aula.

describe("mensagemDoPedido - o caminho feliz funciona", () => {
  it("pedido enviado com rastreio", () => {
    const p: Pedido = { id: "1", status: "enviado", codigoRastreio: "BR123" };
    expect(mensagemDoPedido(p)).toBe("Pedido a caminho. Rastreio: BR123");
  });

  it("pedido pendente", () => {
    expect(mensagemDoPedido({ id: "1", status: "pendente" })).toBe("Pedido pendente");
  });
});

describe("mensagemDoPedido - os estados impossiveis que o tipo permite", () => {
  // Todos os campos extras sao opcionais, entao NADA obriga o codigo de
  // rastreio a existir quando o status e "enviado". O compilador aceita.
  it("BUG: enviado sem rastreio compila e vaza 'undefined' para o cliente", () => {
    const p: Pedido = { id: "1", status: "enviado" };
    expect(mensagemDoPedido(p)).toBe("Pedido a caminho. Rastreio: undefined");
  });

  it("BUG: cancelado sem motivo tambem", () => {
    const p: Pedido = { id: "1", status: "cancelado" };
    expect(mensagemDoPedido(p)).toBe("Pedido cancelado: undefined");
  });

  // Pior: o tipo permite combinacoes que nao existem no mundo real.
  it("BUG: o tipo aceita um pedido cancelado COM codigo de rastreio", () => {
    const impossivel: Pedido = {
      id: "1",
      status: "cancelado",
      codigoRastreio: "BR123",
      motivoCancelamento: "cliente desistiu",
      dataPagamento: "2026-01-01",
    };
    expect(mensagemDoPedido(impossivel)).toContain("cancelado");
  });

  // Depois de corrigido (exercicio 1), o comportamento esperado e este:
  it.todo("o tipo deve tornar impossivel representar 'enviado' sem rastreio");
});
