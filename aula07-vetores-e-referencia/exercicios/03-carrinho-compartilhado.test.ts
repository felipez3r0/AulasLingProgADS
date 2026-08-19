import { describe, it, expect } from "vitest";
import { aplicarAcao, type Carrinho } from "./03-carrinho-compartilhado.js";

const carrinho = (): Carrinho => ({
  dono: "Ana",
  itens: [
    { sku: "A1", quantidade: 2 },
    { sku: "B2", quantidade: 1 },
  ],
  cupons: ["DEZ"],
});

describe("aplicarAcao - adicionar", () => {
  it("soma quantidade a item existente", () => {
    const r = aplicarAcao(carrinho(), { tipo: "adicionar", sku: "A1", quantidade: 3 });
    expect(r.itens[0]?.quantidade).toBe(5);
  });

  it("acrescenta item novo ao fim", () => {
    const r = aplicarAcao(carrinho(), { tipo: "adicionar", sku: "C3", quantidade: 4 });
    expect(r.itens).toHaveLength(3);
    expect(r.itens[2]).toEqual({ sku: "C3", quantidade: 4 });
  });

  it("quantidade invalida lanca erro", () => {
    expect(() => aplicarAcao(carrinho(), { tipo: "adicionar", sku: "A1", quantidade: 0 })).toThrow(
      "quantidade invalida",
    );
  });
});

describe("aplicarAcao - remover", () => {
  it("subtrai quantidade", () => {
    const r = aplicarAcao(carrinho(), { tipo: "remover", sku: "A1", quantidade: 1 });
    expect(r.itens[0]?.quantidade).toBe(1);
  });

  it("remove o item quando zera", () => {
    const r = aplicarAcao(carrinho(), { tipo: "remover", sku: "B2", quantidade: 1 });
    expect(r.itens.map((i) => i.sku)).toEqual(["A1"]);
  });

  it("remove o item quando fica negativo", () => {
    const r = aplicarAcao(carrinho(), { tipo: "remover", sku: "A1", quantidade: 99 });
    expect(r.itens.map((i) => i.sku)).toEqual(["B2"]);
  });

  it("sku inexistente e ignorado", () => {
    const r = aplicarAcao(carrinho(), { tipo: "remover", sku: "ZZ", quantidade: 1 });
    expect(r.itens).toHaveLength(2);
  });
});

describe("aplicarAcao - cupom", () => {
  it("acrescenta cupom novo em maiusculas", () => {
    const r = aplicarAcao(carrinho(), { tipo: "cupom", codigo: "vinte" });
    expect(r.cupons).toEqual(["DEZ", "VINTE"]);
  });

  it("nao duplica cupom, ignorando caixa", () => {
    const r = aplicarAcao(carrinho(), { tipo: "cupom", codigo: "dez" });
    expect(r.cupons).toEqual(["DEZ"]);
  });
});

describe("aplicarAcao - nada compartilhado com o original", () => {
  it("nao altera o carrinho recebido", () => {
    const c = carrinho();
    aplicarAcao(c, { tipo: "adicionar", sku: "A1", quantidade: 3 });
    expect(c).toEqual(carrinho());
  });

  it("o array de itens devolvido e outro", () => {
    const c = carrinho();
    expect(aplicarAcao(c, { tipo: "cupom", codigo: "X" }).itens).not.toBe(c.itens);
  });

  it("cada item devolvido e um objeto novo", () => {
    const c = carrinho();
    const r = aplicarAcao(c, { tipo: "cupom", codigo: "X" });
    expect(r.itens[0]).not.toBe(c.itens[0]);
  });

  it("o array de cupons devolvido e outro", () => {
    const c = carrinho();
    expect(aplicarAcao(c, { tipo: "adicionar", sku: "A1", quantidade: 1 }).cupons).not.toBe(
      c.cupons,
    );
  });

  it("mexer no resultado nao afeta o original", () => {
    const c = carrinho();
    const r = aplicarAcao(c, { tipo: "adicionar", sku: "A1", quantidade: 1 });
    r.itens[0]!.quantidade = 999;
    r.cupons.push("HACK");
    expect(c.itens[0]?.quantidade).toBe(2);
    expect(c.cupons).toEqual(["DEZ"]);
  });
});
