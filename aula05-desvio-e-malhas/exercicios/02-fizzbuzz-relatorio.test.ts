import { describe, it, expect } from "vitest";
import { gerarRelatorio } from "./02-fizzbuzz-relatorio.js";

describe("gerarRelatorio - linhas", () => {
  it("as primeiras linhas ate 15", () => {
    expect(gerarRelatorio(15).linhas).toEqual([
      "1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8",
      "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz",
    ]);
  });

  it("gera exatamente `limite` linhas", () => {
    expect(gerarRelatorio(30).linhas).toHaveLength(30);
  });
});

describe("gerarRelatorio - contadores exclusivos", () => {
  it("ate 15: 4 Fizz, 2 Buzz, 1 FizzBuzz, 8 numeros", () => {
    const r = gerarRelatorio(15);
    expect(r.totalFizz).toBe(4);
    expect(r.totalBuzz).toBe(2);
    expect(r.totalFizzBuzz).toBe(1);
    expect(r.totalNumeros).toBe(8);
  });

  it("os contadores somam o total de linhas", () => {
    const r = gerarRelatorio(100);
    expect(r.totalFizz + r.totalBuzz + r.totalFizzBuzz + r.totalNumeros).toBe(100);
  });

  it("FizzBuzz nao e contado como Fizz nem como Buzz", () => {
    const r = gerarRelatorio(15);
    expect(r.totalFizz).not.toBe(5);
    expect(r.totalBuzz).not.toBe(3);
  });
});

describe("gerarRelatorio - bordas", () => {
  it("limite 1", () => {
    const r = gerarRelatorio(1);
    expect(r.linhas).toEqual(["1"]);
    expect(r.totalNumeros).toBe(1);
  });

  it("limite 0 devolve tudo zerado", () => {
    const r = gerarRelatorio(0);
    expect(r.linhas).toEqual([]);
    expect(r.totalFizz).toBe(0);
    expect(r.totalBuzz).toBe(0);
    expect(r.totalFizzBuzz).toBe(0);
    expect(r.totalNumeros).toBe(0);
  });

  it("limite negativo tambem devolve tudo zerado", () => {
    expect(gerarRelatorio(-5).linhas).toEqual([]);
  });
});
