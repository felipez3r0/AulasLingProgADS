import { describe, it, expect } from "vitest";
import { converterNota } from "./02-conversor-notas.js";

describe("converterNota - faixas", () => {
  it("9 ou mais e A", () => {
    expect(converterNota(10)).toBe("A");
    expect(converterNota(9)).toBe("A");
  });

  it("de 7 a 8.9 e B", () => {
    expect(converterNota(8.9)).toBe("B");
    expect(converterNota(7)).toBe("B");
  });

  it("de 5 a 6.9 e C", () => {
    expect(converterNota(6.9)).toBe("C");
    expect(converterNota(5)).toBe("C");
  });

  it("abaixo de 5 e D", () => {
    expect(converterNota(4.9)).toBe("D");
    expect(converterNota(0)).toBe("D");
  });
});

describe("converterNota - limites das faixas", () => {
  // Estes sao os casos que sugestao de autocomplete costuma errar:
  // a forma do if sai certa, o operador de comparacao sai trocado.
  it("o limite pertence a faixa de cima", () => {
    expect(converterNota(9)).toBe("A");
    expect(converterNota(7)).toBe("B");
    expect(converterNota(5)).toBe("C");
  });
});

describe("converterNota - entradas invalidas", () => {
  it("recusa nota acima de 10", () => {
    expect(() => converterNota(11)).toThrow("nota invalida");
  });

  it("recusa nota negativa", () => {
    expect(() => converterNota(-1)).toThrow("nota invalida");
  });
});
