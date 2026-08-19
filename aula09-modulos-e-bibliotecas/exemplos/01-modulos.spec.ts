import { describe, it, expect } from "vitest";
import { precoFinal, aplicarPercentual, calcularImposto, formatarReal } from "./01-modulos.js";

describe("modulos compostos", () => {
  it("aplica margem", () => {
    expect(aplicarPercentual(100, 20)).toBe(120);
  });

  it("calcula imposto com aliquota padrao", () => {
    expect(calcularImposto(100)).toBe(18);
  });

  it("formata em real", () => {
    expect(formatarReal(1234.5)).toBe("R$ 1234,50");
  });

  it("compoe tudo", () => {
    // 100 + 20% = 120; imposto 18% de 120 = 21.6; total 141.6
    expect(precoFinal(100, 20)).toBe("R$ 141,60");
  });
});
