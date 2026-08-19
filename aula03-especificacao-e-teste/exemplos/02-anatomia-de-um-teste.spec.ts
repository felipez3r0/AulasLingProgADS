import { describe, it, expect } from "vitest";
import { calcularTotal, type Produto } from "./02-anatomia-de-um-teste.js";

const carrinho = (): Produto[] => [
  { nome: "caderno", preco: 12.5, quantidade: 2 },
  { nome: "caneta", preco: 3.25, quantidade: 4 },
];

describe("anatomia: Preparar, Agir, Verificar", () => {
  it("soma preco vezes quantidade de cada produto", () => {
    const itens = carrinho();          // Preparar
    const total = calcularTotal(itens); // Agir
    expect(total).toBe(38);             // Verificar
  });
});

describe("assercao fraca x assercao forte", () => {
  // FRACA: passa com qualquer numero positivo. Nao prova o calculo.
  it("fraca - o total e maior que zero", () => {
    expect(calcularTotal(carrinho())).toBeGreaterThan(0);
  });

  // FORTE: so passa com o valor certo. Uma implementacao errada falha aqui.
  it("forte - o total e exatamente 38", () => {
    expect(calcularTotal(carrinho())).toBe(38);
  });
});

describe("casos de borda - cada um vem de uma linha da especificacao", () => {
  it("carrinho vazio devolve 0", () => {
    expect(calcularTotal([])).toBe(0);
  });

  it("quantidade zero nao contribui", () => {
    expect(calcularTotal([{ nome: "x", preco: 99, quantidade: 0 }])).toBe(0);
  });

  it("quantidade negativa lanca erro", () => {
    expect(() => calcularTotal([{ nome: "x", preco: 10, quantidade: -1 }])).toThrow(
      "quantidade invalida",
    );
  });

  it("arredonda para 2 casas decimais", () => {
    // 0.1 * 3 da 0.30000000000000004 em ponto flutuante
    expect(calcularTotal([{ nome: "x", preco: 0.1, quantidade: 3 }])).toBe(0.3);
  });

  it("nao modifica o carrinho recebido", () => {
    const itens = carrinho();
    calcularTotal(itens);
    expect(itens).toEqual(carrinho());
  });
});
