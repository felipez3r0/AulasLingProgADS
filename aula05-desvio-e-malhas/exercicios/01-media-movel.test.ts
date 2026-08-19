import { describe, it, expect } from "vitest";
import { mediaMovel } from "./01-media-movel.js";

describe("mediaMovel - quantidade de janelas", () => {
  it("5 leituras com janela 3 gera exatamente 3 janelas", () => {
    expect(mediaMovel([10, 20, 30, 40, 50], 3)).toHaveLength(3);
  });

  it("os valores das janelas", () => {
    expect(mediaMovel([10, 20, 30, 40, 50], 3)).toEqual([20, 30, 40]);
  });

  it("janela 2 sobre 4 leituras gera 3 janelas", () => {
    expect(mediaMovel([2, 4, 6, 8], 2)).toEqual([3, 5, 7]);
  });

  it("janela 1 devolve as proprias leituras", () => {
    expect(mediaMovel([1, 2, 3], 1)).toEqual([1, 2, 3]);
  });
});

describe("mediaMovel - bordas", () => {
  it("janela do tamanho exato da lista gera uma janela", () => {
    expect(mediaMovel([1, 2, 3], 3)).toEqual([2]);
  });

  it("lista menor que a janela devolve vazio", () => {
    expect(mediaMovel([1, 2], 3)).toEqual([]);
  });

  it("lista vazia devolve vazio", () => {
    expect(mediaMovel([], 3)).toEqual([]);
  });

  it("nenhuma media e NaN", () => {
    for (const m of mediaMovel([10, 20, 30, 40, 50], 3)) {
      expect(m).not.toBeNaN();
    }
  });
});

describe("mediaMovel - arredondamento e erros", () => {
  it("arredonda para 2 casas decimais", () => {
    expect(mediaMovel([1, 2, 2], 3)).toEqual([1.67]);
  });

  it("janela zero lanca erro", () => {
    expect(() => mediaMovel([1, 2, 3], 0)).toThrow("janela invalida");
  });

  it("janela negativa lanca erro", () => {
    expect(() => mediaMovel([1, 2, 3], -1)).toThrow("janela invalida");
  });

  it("nao modifica o array recebido", () => {
    const dados = [10, 20, 30];
    mediaMovel(dados, 2);
    expect(dados).toEqual([10, 20, 30]);
  });
});
