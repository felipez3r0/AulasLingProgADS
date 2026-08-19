import { describe, it, expect } from "vitest";
import { aplicarDesconto } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA o defeito. Por isso ele passa.
// Corrigir e o exercicio 1 da aula.

describe("aplicarDesconto - o que parece funcionar", () => {
  it("sem desconto ate 100", () => {
    expect(aplicarDesconto(100)).toBe(100);
  });

  it("10% entre 100 e 500", () => {
    expect(aplicarDesconto(200)).toBe(180);
  });
});

describe("aplicarDesconto - o defeito", () => {
  // A IA ACUMULOU as faixas: acima de 500 os dois ifs entram,
  // somando 10% + 20% = 30% de desconto.
  // O pedido dizia "20% acima de 500", nao "30%".
  it("BUG: acima de 500 o desconto vira 30%, nao 20%", () => {
    expect(aplicarDesconto(1000)).toBe(700);
  });

  it("BUG: a diferenca cresce com o valor", () => {
    const esperadoPelaRegra = 1000 * 0.8;
    expect(aplicarDesconto(1000)).not.toBe(esperadoPelaRegra);
  });

  // Depois de corrigido (exercicio 1), o comportamento esperado e este:
  it.todo("acima de 500 deve aplicar 20%, resultando em 800 para valor 1000");
});
