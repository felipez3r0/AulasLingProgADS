import { describe, it, expect } from "vitest";
import { processarPedido, type Pedido } from "./03-pipeline-pedidos.js";

const pedido = (over: Partial<Pedido> = {}): Pedido => ({
  cliente: "Ana",
  itens: [
    { produto: "caderno", quantidade: 2, precoUnitario: 30 },
    { produto: "caneta", quantidade: 4, precoUnitario: 10 },
  ],
  ...over,
});

describe("processarPedido - subtotal", () => {
  it("soma quantidade vezes preco", () => {
    expect(processarPedido(pedido()).subtotal).toBe(100);
  });

  it("conta os itens validos", () => {
    expect(processarPedido(pedido()).itensValidos).toBe(2);
  });

  it("ignora item com quantidade zero", () => {
    const p = pedido({
      itens: [
        { produto: "a", quantidade: 0, precoUnitario: 99 },
        { produto: "b", quantidade: 1, precoUnitario: 10 },
      ],
    });
    const r = processarPedido(p);
    expect(r.subtotal).toBe(10);
    expect(r.itensValidos).toBe(1);
  });

  it("ignora item com preco negativo", () => {
    const p = pedido({
      itens: [
        { produto: "a", quantidade: 1, precoUnitario: -5 },
        { produto: "b", quantidade: 1, precoUnitario: 10 },
      ],
    });
    expect(processarPedido(p).subtotal).toBe(10);
  });

  it("preco zero e valido", () => {
    const p = pedido({ itens: [{ produto: "brinde", quantidade: 1, precoUnitario: 0 }] });
    expect(processarPedido(p).itensValidos).toBe(1);
  });
});

describe("processarPedido - cupom", () => {
  it("DEZ da 10%", () => {
    const r = processarPedido(pedido({ cupom: "DEZ" }));
    expect(r.desconto).toBe(10);
    expect(r.total).toBe(90);
  });

  it("VINTE da 20%", () => {
    const r = processarPedido(pedido({ cupom: "VINTE" }));
    expect(r.desconto).toBe(20);
    expect(r.total).toBe(80);
  });

  it("cupom desconhecido e ignorado", () => {
    expect(processarPedido(pedido({ cupom: "XPTO" })).desconto).toBe(0);
  });

  it("sem cupom nao ha desconto", () => {
    expect(processarPedido(pedido()).desconto).toBe(0);
  });
});

describe("processarPedido - limite de 50 para o desconto", () => {
  it("subtotal exatamente 50 nao recebe desconto", () => {
    const p = pedido({ itens: [{ produto: "a", quantidade: 1, precoUnitario: 50 }], cupom: "DEZ" });
    expect(processarPedido(p).desconto).toBe(0);
  });

  it("subtotal acima de 50 recebe desconto", () => {
    const p = pedido({ itens: [{ produto: "a", quantidade: 1, precoUnitario: 51 }], cupom: "DEZ" });
    expect(processarPedido(p).desconto).toBe(5.1);
  });

  it("o limite considera o subtotal ja filtrado", () => {
    const p = pedido({
      itens: [
        { produto: "invalido", quantidade: -3, precoUnitario: 1000 },
        { produto: "valido", quantidade: 1, precoUnitario: 40 },
      ],
      cupom: "DEZ",
    });
    expect(processarPedido(p).desconto).toBe(0);
  });
});

describe("processarPedido - bordas e garantias", () => {
  it("pedido sem itens fica zerado", () => {
    const r = processarPedido(pedido({ itens: [], cupom: "VINTE" }));
    expect(r).toEqual({ cliente: "Ana", subtotal: 0, desconto: 0, total: 0, itensValidos: 0 });
  });

  it("pedido so com itens invalidos fica zerado", () => {
    const p = pedido({ itens: [{ produto: "a", quantidade: 0, precoUnitario: 10 }] });
    expect(processarPedido(p).total).toBe(0);
  });

  it("arredonda para 2 casas", () => {
    const p = pedido({ itens: [{ produto: "a", quantidade: 3, precoUnitario: 33.33 }], cupom: "DEZ" });
    const r = processarPedido(p);
    expect(r.subtotal).toBe(99.99);
    expect(r.desconto).toBe(10);
    expect(r.total).toBe(89.99);
  });

  it("nao modifica o pedido recebido", () => {
    const p = pedido();
    processarPedido(p);
    expect(p).toEqual(pedido());
  });
});
