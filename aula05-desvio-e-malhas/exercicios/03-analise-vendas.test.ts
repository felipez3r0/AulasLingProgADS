import { describe, it, expect } from "vitest";
import { analisarVendas, type Venda } from "./03-analise-vendas.js";

const vendas = (): Venda[] => [
  { vendedor: "Ana", valor: 100, mes: 1 },
  { vendedor: "Bruno", valor: 300, mes: 2 },
  { vendedor: "Ana", valor: 500, mes: 3 },
  { vendedor: "Carla", valor: 50, mes: 5 },
];

describe("analisarVendas - melhor e pior mes", () => {
  it("melhor mes e o de maior soma", () => {
    expect(analisarVendas(vendas()).melhorMes).toBe(3);
  });

  it("pior mes ignora meses sem venda", () => {
    expect(analisarVendas(vendas()).piorMes).toBe(5);
  });

  it("soma vendas do mesmo mes", () => {
    const mesmoMes: Venda[] = [
      { vendedor: "A", valor: 100, mes: 1 },
      { vendedor: "B", valor: 900, mes: 1 },
      { vendedor: "C", valor: 500, mes: 2 },
    ];
    expect(analisarVendas(mesmoMes).melhorMes).toBe(1);
  });

  it("empate no melhor mes vence o mes menor", () => {
    const empate: Venda[] = [
      { vendedor: "A", valor: 100, mes: 4 },
      { vendedor: "B", valor: 100, mes: 9 },
    ];
    expect(analisarVendas(empate).melhorMes).toBe(4);
  });
});

describe("analisarVendas - meses sem venda", () => {
  it("lista os meses sem venda em ordem crescente", () => {
    expect(analisarVendas(vendas()).mesesSemVenda).toEqual([4, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("ano cheio nao tem mes sem venda", () => {
    const cheio: Venda[] = Array.from({ length: 12 }, (_, i) => ({
      vendedor: "A",
      valor: 10,
      mes: i + 1,
    }));
    expect(analisarVendas(cheio).mesesSemVenda).toEqual([]);
  });
});

describe("analisarVendas - sequencia de crescimento", () => {
  it("tres meses crescendo dao sequencia 2", () => {
    // meses 1,2,3 crescem: 100 -> 300 -> 500 sao 2 crescimentos seguidos
    expect(analisarVendas(vendas()).sequenciaMaiorCrescimento).toBe(2);
  });

  it("crescimento constante o ano todo da 11", () => {
    const crescente: Venda[] = Array.from({ length: 12 }, (_, i) => ({
      vendedor: "A",
      valor: (i + 1) * 10,
      mes: i + 1,
    }));
    expect(analisarVendas(crescente).sequenciaMaiorCrescimento).toBe(11);
  });

  it("vendas so em decrescimo dao sequencia 0", () => {
    const caindo: Venda[] = [
      { vendedor: "A", valor: 500, mes: 1 },
      { vendedor: "A", valor: 400, mes: 2 },
      { vendedor: "A", valor: 300, mes: 3 },
    ];
    expect(analisarVendas(caindo).sequenciaMaiorCrescimento).toBe(0);
  });
});

describe("analisarVendas - bordas e erros", () => {
  it("lista vazia", () => {
    const r = analisarVendas([]);
    expect(r.melhorMes).toBe(0);
    expect(r.piorMes).toBe(0);
    expect(r.mesesSemVenda).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(r.sequenciaMaiorCrescimento).toBe(0);
  });

  it("mes invalido lanca erro", () => {
    expect(() => analisarVendas([{ vendedor: "A", valor: 10, mes: 13 }])).toThrow("mes invalido");
    expect(() => analisarVendas([{ vendedor: "A", valor: 10, mes: 0 }])).toThrow("mes invalido");
  });

  it("nao modifica o array recebido", () => {
    const v = vendas();
    analisarVendas(v);
    expect(v).toEqual(vendas());
  });
});
