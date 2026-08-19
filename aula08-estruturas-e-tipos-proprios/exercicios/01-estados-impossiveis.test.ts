import { describe, it, expect } from "vitest";
import { mensagemDoPedido, type Pedido } from "./01-estados-impossiveis.js";

describe("mensagemDoPedido - cada variante", () => {
  it("pendente", () => {
    const p = { id: "1", status: "pendente" } as unknown as Pedido;
    expect(mensagemDoPedido(p)).toBe("Pedido aguardando pagamento");
  });

  it("pago", () => {
    const p = { id: "1", status: "pago", dataPagamento: "2026-03-01" } as unknown as Pedido;
    expect(mensagemDoPedido(p)).toBe("Pagamento confirmado em 2026-03-01");
  });

  it("enviado", () => {
    const p = {
      id: "1",
      status: "enviado",
      dataPagamento: "2026-03-01",
      codigoRastreio: "BR123",
    } as unknown as Pedido;
    expect(mensagemDoPedido(p)).toBe("Pedido a caminho. Rastreio: BR123");
  });

  it("cancelado", () => {
    const p = { id: "1", status: "cancelado", motivo: "cliente desistiu" } as unknown as Pedido;
    expect(mensagemDoPedido(p)).toBe("Pedido cancelado: cliente desistiu");
  });
});

describe("mensagemDoPedido - nada de undefined", () => {
  it("nenhuma mensagem contem undefined", () => {
    const casos = [
      { id: "1", status: "pendente" },
      { id: "1", status: "pago", dataPagamento: "2026-03-01" },
      { id: "1", status: "enviado", dataPagamento: "2026-03-01", codigoRastreio: "BR1" },
      { id: "1", status: "cancelado", motivo: "x" },
    ] as unknown as Pedido[];
    for (const p of casos) {
      expect(mensagemDoPedido(p)).not.toContain("undefined");
    }
  });
});

describe("mensagemDoPedido - o tipo faz o trabalho", () => {
  // Estes testes verificam a FORMA do tipo em tempo de execucao.
  // A verificacao de verdade e o `npm run typecheck` passar enquanto
  // os estados impossiveis ficam impossiveis de escrever.
  it("a variante enviada carrega rastreio", () => {
    const p = {
      id: "1",
      status: "enviado",
      dataPagamento: "2026-03-01",
      codigoRastreio: "BR9",
    } as unknown as Pedido;
    expect(mensagemDoPedido(p)).toContain("BR9");
  });

  it("a variante cancelada carrega motivo", () => {
    const p = { id: "1", status: "cancelado", motivo: "sem estoque" } as unknown as Pedido;
    expect(mensagemDoPedido(p)).toContain("sem estoque");
  });
});
