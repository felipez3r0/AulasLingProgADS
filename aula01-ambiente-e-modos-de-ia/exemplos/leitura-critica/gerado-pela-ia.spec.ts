import { describe, it, expect } from "vitest";
import { calcularMedia } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA o defeito. Por isso ele passa.
// Corrigir o defeito e o exercicio 1 da aula.

describe("calcularMedia - o que funciona", () => {
  it("acerta o caminho feliz", () => {
    expect(calcularMedia([8, 6, 10])).toBe(8);
  });

  it("acerta com uma nota so", () => {
    expect(calcularMedia([7])).toBe(7);
  });
});

describe("calcularMedia - o defeito", () => {
  // 0 / 0 em JavaScript nao lanca erro: devolve NaN, silenciosamente.
  // A funcao nao "quebra" - ela contamina tudo o que depender dela.
  it("BUG: array vazio devolve NaN em vez de 0", () => {
    expect(calcularMedia([])).toBeNaN();
  });

  it("BUG: e NaN se propaga sem ninguem perceber", () => {
    const boletim = calcularMedia([]) + 10;
    expect(boletim).toBeNaN();
  });

  // Depois de corrigido (exercicio 1), o comportamento esperado e este:
  it.todo("array vazio deve devolver 0");
});
