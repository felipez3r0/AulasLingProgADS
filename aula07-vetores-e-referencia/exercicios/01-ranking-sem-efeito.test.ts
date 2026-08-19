import { describe, it, expect } from "vitest";
import { maioresNotas } from "./01-ranking-sem-efeito.js";

describe("maioresNotas - resultado", () => {
  it("devolve as N maiores em ordem decrescente", () => {
    expect(maioresNotas([5, 9, 2, 10, 7], 3)).toEqual([10, 9, 7]);
  });

  it("mantem repetidas", () => {
    expect(maioresNotas([8, 8, 5], 2)).toEqual([8, 8]);
  });

  it("lista menor que a quantidade devolve tudo que tem", () => {
    expect(maioresNotas([4, 8], 5)).toEqual([8, 4]);
  });

  it("quantidade 1 devolve a maior", () => {
    expect(maioresNotas([3, 1, 7], 1)).toEqual([7]);
  });
});

describe("maioresNotas - bordas", () => {
  it("lista vazia", () => {
    expect(maioresNotas([], 3)).toEqual([]);
  });

  it("quantidade zero", () => {
    expect(maioresNotas([1, 2, 3], 0)).toEqual([]);
  });

  it("quantidade negativa", () => {
    expect(maioresNotas([1, 2, 3], -1)).toEqual([]);
  });

  it("aceita negativos", () => {
    expect(maioresNotas([-5, -1, -10], 2)).toEqual([-1, -5]);
  });
});

describe("maioresNotas - sem efeito colateral", () => {
  it("nao reordena o array recebido", () => {
    const notas = [5, 9, 2, 10, 7];
    maioresNotas(notas, 3);
    expect(notas).toEqual([5, 9, 2, 10, 7]);
  });

  it("nao altera o tamanho do array recebido", () => {
    const notas = [1, 2, 3];
    maioresNotas(notas, 2);
    expect(notas).toHaveLength(3);
  });

  it("devolve um array novo, nao o mesmo", () => {
    const notas = [1, 2, 3];
    expect(maioresNotas(notas, 3)).not.toBe(notas);
  });

  it("chamadas repetidas dao o mesmo resultado", () => {
    const notas = [5, 9, 2];
    expect(maioresNotas(notas, 2)).toEqual(maioresNotas(notas, 2));
  });
});
