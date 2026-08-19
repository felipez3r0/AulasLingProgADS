import { describe, it, expect } from "vitest";
import { aplicarMovimentacoes, type ItemEstoque } from "./02-inventario.js";

const inventario = (): ItemEstoque[] => [
  { codigo: "A1", nome: "caderno", quantidade: 10 },
  { codigo: "B2", nome: "caneta", quantidade: 5 },
];

describe("aplicarMovimentacoes - calculo", () => {
  it("soma entrada", () => {
    const r = aplicarMovimentacoes(inventario(), [{ codigo: "A1", delta: 5 }]);
    expect(r[0]?.quantidade).toBe(15);
  });

  it("subtrai saida", () => {
    const r = aplicarMovimentacoes(inventario(), [{ codigo: "B2", delta: -3 }]);
    expect(r[1]?.quantidade).toBe(2);
  });

  it("acumula varias movimentacoes do mesmo item", () => {
    const r = aplicarMovimentacoes(inventario(), [
      { codigo: "A1", delta: 5 },
      { codigo: "A1", delta: -2 },
    ]);
    expect(r[0]?.quantidade).toBe(13);
  });

  it("ignora codigo inexistente", () => {
    const r = aplicarMovimentacoes(inventario(), [{ codigo: "ZZ", delta: 100 }]);
    expect(r).toEqual(inventario());
  });

  it("nunca fica negativo", () => {
    const r = aplicarMovimentacoes(inventario(), [{ codigo: "B2", delta: -99 }]);
    expect(r[1]?.quantidade).toBe(0);
  });

  it("preserva a ordem e os demais campos", () => {
    const r = aplicarMovimentacoes(inventario(), [{ codigo: "A1", delta: 1 }]);
    expect(r.map((i) => i.codigo)).toEqual(["A1", "B2"]);
    expect(r[0]?.nome).toBe("caderno");
  });
});

describe("aplicarMovimentacoes - imutabilidade profunda", () => {
  it("nao altera o array recebido", () => {
    const inv = inventario();
    aplicarMovimentacoes(inv, [{ codigo: "A1", delta: 5 }]);
    expect(inv).toEqual(inventario());
  });

  it("nao altera os OBJETOS dentro do array recebido", () => {
    const inv = inventario();
    aplicarMovimentacoes(inv, [{ codigo: "A1", delta: 5 }]);
    expect(inv[0]?.quantidade).toBe(10);
  });

  it("os objetos devolvidos sao novos, nao os mesmos", () => {
    const inv = inventario();
    const r = aplicarMovimentacoes(inv, [{ codigo: "A1", delta: 5 }]);
    expect(r[0]).not.toBe(inv[0]);
  });

  it("nao altera a lista de movimentacoes", () => {
    const movs = [{ codigo: "A1", delta: 5 }];
    aplicarMovimentacoes(inventario(), movs);
    expect(movs).toEqual([{ codigo: "A1", delta: 5 }]);
  });
});

describe("aplicarMovimentacoes - bordas", () => {
  it("inventario vazio", () => {
    expect(aplicarMovimentacoes([], [{ codigo: "A1", delta: 1 }])).toEqual([]);
  });

  it("sem movimentacoes devolve copia equivalente", () => {
    expect(aplicarMovimentacoes(inventario(), [])).toEqual(inventario());
  });
});
