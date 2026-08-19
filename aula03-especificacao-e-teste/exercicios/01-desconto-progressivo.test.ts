import { describe, it, expect } from "vitest";
import { aplicarDesconto } from "./01-desconto-progressivo.js";

describe("aplicarDesconto - faixas", () => {
  it("sem desconto ate 100", () => {
    expect(aplicarDesconto(50)).toBe(50);
    expect(aplicarDesconto(100)).toBe(100);
  });

  it("10% acima de 100 ate 500", () => {
    expect(aplicarDesconto(200)).toBe(180);
    expect(aplicarDesconto(500)).toBe(450);
  });

  it("20% acima de 500 - e nao 30%", () => {
    expect(aplicarDesconto(1000)).toBe(800);
    expect(aplicarDesconto(600)).toBe(480);
  });
});

describe("aplicarDesconto - limites das faixas", () => {
  it("exatamente 100 fica na faixa sem desconto", () => {
    expect(aplicarDesconto(100)).toBe(100);
  });

  it("exatamente 500 fica na faixa de 10%", () => {
    expect(aplicarDesconto(500)).toBe(450);
  });

  it("500.01 ja esta na faixa de 20%", () => {
    expect(aplicarDesconto(500.01)).toBe(400.01);
  });
});

describe("aplicarDesconto - bordas", () => {
  it("valor zero devolve zero", () => {
    expect(aplicarDesconto(0)).toBe(0);
  });

  it("valor negativo lanca erro", () => {
    expect(() => aplicarDesconto(-1)).toThrow("valor invalido");
  });

  it("arredonda para 2 casas decimais", () => {
    expect(aplicarDesconto(333.33)).toBe(300);
  });
});
