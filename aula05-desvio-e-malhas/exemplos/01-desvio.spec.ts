import { describe, it, expect } from "vitest";
import {
  classificar,
  classificarOrdemErrada,
  diaDaSemana,
  situacao,
} from "./01-desvio.js";

describe("classificar - ordem correta", () => {
  it("cada faixa devolve seu conceito", () => {
    expect(classificar(10)).toBe("A");
    expect(classificar(8)).toBe("B");
    expect(classificar(6)).toBe("C");
    expect(classificar(2)).toBe("D");
  });

  it("os limites pertencem a faixa de cima", () => {
    expect(classificar(9)).toBe("A");
    expect(classificar(7)).toBe("B");
    expect(classificar(5)).toBe("C");
  });
});

describe("classificar - ordem errada demonstra o problema", () => {
  it("nota 10 deveria ser A, mas cai no primeiro if e vira C", () => {
    expect(classificarOrdemErrada(10)).toBe("C");
  });

  it("os ramos B e A sao inalcancaveis - e ninguem avisa", () => {
    expect(classificarOrdemErrada(8)).toBe("C");
    expect(classificarOrdemErrada(9)).toBe("C");
  });

  it("so o ramo final continua funcionando", () => {
    expect(classificarOrdemErrada(2)).toBe("D");
  });
});

describe("switch e ternario", () => {
  it("switch compara com ===", () => {
    expect(diaDaSemana(1)).toBe("domingo");
    expect(diaDaSemana(7)).toBe("sabado");
    expect(diaDaSemana(99)).toBe("dia invalido");
  });

  it("ternario", () => {
    expect(situacao(6)).toBe("aprovado");
    expect(situacao(5.9)).toBe("reprovado");
  });
});
