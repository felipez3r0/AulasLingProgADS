import { describe, it, expect } from "vitest";
import { calcularFrete } from "./02-caracterizacao.js";

describe("calcularFrete - caminho comum", () => {
  it("cobra 0.5 por quilo em distancia curta", () => {
    expect(calcularFrete(10, 50)).toBe(5);
  });

  it("nao cobra adicional em distancia exatamente 100", () => {
    expect(calcularFrete(10, 100)).toBe(5);
  });

  it("cobra adicional acima de 100 km", () => {
    expect(calcularFrete(10, 200)).toBe(15);
  });
});

describe("calcularFrete - esquisitices preservadas do legado", () => {
  it("peso zero devolve 0 mesmo com distancia enorme", () => {
    expect(calcularFrete(0, 5000)).toBe(0);
  });

  it("peso negativo devolve 0", () => {
    expect(calcularFrete(-5, 200)).toBe(0);
  });

  it("o frete e limitado a 50", () => {
    expect(calcularFrete(1000, 50)).toBe(50);
  });

  it("o limite se aplica depois do adicional de distancia", () => {
    expect(calcularFrete(90, 200)).toBe(50);
  });
});
