import { describe, it, expect } from "vitest";
import {
  somar,
  multiplicar,
  saudar,
  aplicarJuros,
  somarTodos,
  calcular,
} from "./01-funcoes-e-contrato.js";

describe("formas de declarar", () => {
  it("declaracao e arrow fazem a mesma coisa", () => {
    expect(somar(2, 3)).toBe(5);
    expect(multiplicar(2, 3)).toBe(6);
  });
});

describe("parametros", () => {
  it("opcional pode ser omitido", () => {
    expect(saudar("Ana")).toBe("Ola, Ana");
    expect(saudar("Ana", "Profa.")).toBe("Ola, Profa. Ana");
  });

  it("valor padrao entra quando o argumento falta", () => {
    expect(aplicarJuros(100)).toBe(101);
    expect(aplicarJuros(100, 0.5)).toBe(150);
  });

  it("rest aceita qualquer quantidade", () => {
    expect(somarTodos()).toBe(0);
    expect(somarTodos(1, 2, 3)).toBe(6);
    expect(somarTodos(10, 20, 30, 40)).toBe(100);
  });
});

describe("funcoes como valores", () => {
  it("a operacao vem de fora", () => {
    expect(calcular(6, 3, somar)).toBe(9);
    expect(calcular(6, 3, multiplicar)).toBe(18);
    expect(calcular(6, 3, (a, b) => a - b)).toBe(3);
  });
});
