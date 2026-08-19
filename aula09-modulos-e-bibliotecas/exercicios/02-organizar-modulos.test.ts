import { describe, it, expect } from "vitest";
import {
  formatarMoeda,
  formatarPercentual,
  total,
  media,
  maiorValor,
} from "./02-organizar-modulos.js";

describe("formatarMoeda", () => {
  it("formata com separador de milhar e centavos", () => {
    expect(formatarMoeda(1234.5)).toBe("R$ 1.234,50");
  });

  it("sempre com 2 casas", () => {
    expect(formatarMoeda(10)).toBe("R$ 10,00");
    expect(formatarMoeda(0.5)).toBe("R$ 0,50");
  });

  it("zero", () => {
    expect(formatarMoeda(0)).toBe("R$ 0,00");
  });

  it("negativo", () => {
    expect(formatarMoeda(-10)).toBe("-R$ 10,00");
  });

  it("milhoes", () => {
    expect(formatarMoeda(1234567.89)).toBe("R$ 1.234.567,89");
  });
});

describe("formatarPercentual", () => {
  it("converte fracao em percentual", () => {
    expect(formatarPercentual(0.155)).toBe("15,5%");
  });

  it("arredonda para 1 casa", () => {
    expect(formatarPercentual(0.12345)).toBe("12,3%");
  });

  it("zero", () => {
    expect(formatarPercentual(0)).toBe("0,0%");
  });

  it("cem por cento", () => {
    expect(formatarPercentual(1)).toBe("100,0%");
  });
});

describe("calculo", () => {
  it("total soma e arredonda", () => {
    expect(total([10.1, 20.2, 30.3])).toBe(60.6);
    expect(total([])).toBe(0);
  });

  it("media arredonda para 2 casas", () => {
    expect(media([10, 20, 25])).toBe(18.33);
  });

  it("media de lista vazia e zero", () => {
    expect(media([])).toBe(0);
  });

  it("maiorValor", () => {
    expect(maiorValor([3, 9, 1])).toBe(9);
    expect(maiorValor([])).toBe(0);
    expect(maiorValor([-5, -1])).toBe(-1);
  });

  it("nao modificam o array recebido", () => {
    const v = [3, 1, 2];
    total(v);
    media(v);
    maiorValor(v);
    expect(v).toEqual([3, 1, 2]);
  });
});
