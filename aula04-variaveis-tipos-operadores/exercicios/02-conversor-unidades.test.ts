import { describe, it, expect } from "vitest";
import { converterTemperatura } from "./02-conversor-unidades.js";

describe("converterTemperatura - Celsius para outras", () => {
  it("0 C sao 32 F", () => {
    expect(converterTemperatura(0, "C", "F")).toBe(32);
  });

  it("100 C sao 212 F", () => {
    expect(converterTemperatura(100, "C", "F")).toBe(212);
  });

  it("0 C sao 273.15 K", () => {
    expect(converterTemperatura(0, "C", "K")).toBe(273.15);
  });
});

describe("converterTemperatura - de volta para Celsius", () => {
  it("32 F sao 0 C", () => {
    expect(converterTemperatura(32, "F", "C")).toBe(0);
  });

  it("273.15 K sao 0 C", () => {
    expect(converterTemperatura(273.15, "K", "C")).toBe(0);
  });

  it("212 F sao 100 C", () => {
    expect(converterTemperatura(212, "F", "C")).toBe(100);
  });
});

describe("converterTemperatura - F para K e vice-versa", () => {
  it("32 F sao 273.15 K", () => {
    expect(converterTemperatura(32, "F", "K")).toBe(273.15);
  });

  it("373.15 K sao 212 F", () => {
    expect(converterTemperatura(373.15, "K", "F")).toBe(212);
  });
});

describe("converterTemperatura - mesma escala", () => {
  it("nao altera o valor", () => {
    expect(converterTemperatura(25, "C", "C")).toBe(25);
    expect(converterTemperatura(77, "F", "F")).toBe(77);
    expect(converterTemperatura(300, "K", "K")).toBe(300);
  });
});

describe("converterTemperatura - arredondamento", () => {
  it("arredonda para 2 casas decimais", () => {
    expect(converterTemperatura(37, "C", "F")).toBe(98.6);
    expect(converterTemperatura(1, "C", "F")).toBe(33.8);
  });
});

describe("converterTemperatura - limites e erros", () => {
  it("zero absoluto exato e valido", () => {
    expect(converterTemperatura(-273.15, "C", "K")).toBe(0);
  });

  it("abaixo do zero absoluto lanca erro", () => {
    expect(() => converterTemperatura(-300, "C", "K")).toThrow("abaixo do zero absoluto");
  });

  it("kelvin negativo lanca erro", () => {
    expect(() => converterTemperatura(-1, "K", "C")).toThrow("abaixo do zero absoluto");
  });

  it("escala invalida lanca erro", () => {
    expect(() => converterTemperatura(0, "X" as never, "C")).toThrow("escala invalida");
  });
});
