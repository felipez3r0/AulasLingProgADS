import { describe, it, expect } from "vitest";
import {
  freteBase,
  acrescimoPorPeso,
  multiplicadorDesconto,
  prazoEmDias,
  calcularEntrega,
} from "./02-decompor-frete.js";

describe("peca 1: freteBase", () => {
  it("cada regiao tem seu valor", () => {
    expect(freteBase("sudeste")).toBe(10);
    expect(freteBase("sul")).toBe(15);
    expect(freteBase("centro-oeste")).toBe(20);
    expect(freteBase("nordeste")).toBe(25);
    expect(freteBase("norte")).toBe(30);
  });
});

describe("peca 2: acrescimoPorPeso", () => {
  it("ate 1kg nao acrescenta", () => {
    expect(acrescimoPorPeso(0.5)).toBe(0);
    expect(acrescimoPorPeso(1)).toBe(0);
  });

  it("acima de 1kg ate 5kg acrescenta 5", () => {
    expect(acrescimoPorPeso(1.1)).toBe(5);
    expect(acrescimoPorPeso(5)).toBe(5);
  });

  it("acima de 5kg acrescenta 12", () => {
    expect(acrescimoPorPeso(5.1)).toBe(12);
    expect(acrescimoPorPeso(50)).toBe(12);
  });

  it("peso invalido lanca erro", () => {
    expect(() => acrescimoPorPeso(0)).toThrow("peso invalido");
    expect(() => acrescimoPorPeso(-1)).toThrow("peso invalido");
  });
});

describe("peca 3: multiplicadorDesconto", () => {
  it("sem desconto ate 200", () => {
    expect(multiplicadorDesconto(200)).toBe(1);
    expect(multiplicadorDesconto(0)).toBe(1);
  });

  it("metade acima de 200", () => {
    expect(multiplicadorDesconto(200.01)).toBe(0.5);
    expect(multiplicadorDesconto(1000)).toBe(0.5);
  });
});

describe("peca 4: prazoEmDias", () => {
  it("cada regiao tem seu prazo", () => {
    expect(prazoEmDias("sudeste")).toBe(2);
    expect(prazoEmDias("norte")).toBe(8);
  });
});

describe("composicao: calcularEntrega", () => {
  it("sudeste, 0.5kg, compra pequena", () => {
    expect(calcularEntrega("sudeste", 0.5, 100)).toEqual({ frete: 10, prazoDias: 2 });
  });

  it("norte, 6kg, compra pequena", () => {
    expect(calcularEntrega("norte", 6, 100)).toEqual({ frete: 42, prazoDias: 8 });
  });

  it("aplica o desconto sobre base mais acrescimo", () => {
    expect(calcularEntrega("norte", 6, 500)).toEqual({ frete: 21, prazoDias: 8 });
  });

  it("arredonda para 2 casas", () => {
    expect(calcularEntrega("sul", 2, 300).frete).toBe(10);
  });

  it("propaga o erro de peso invalido", () => {
    expect(() => calcularEntrega("sul", 0, 100)).toThrow("peso invalido");
  });
});
