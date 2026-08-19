import { describe, it, expect } from "vitest";
import {
  criarNotas,
  primeiraNota,
  primeiraNotaOuZero,
  acessoForaDosLimites,
  comPosicao,
  metodosMutantes,
  metodosNaoMutantes,
} from "./01-vetores.js";

describe("acesso por indice", () => {
  it("le o primeiro elemento", () => {
    expect(primeiraNota(criarNotas())).toBe(8);
  });

  it("array vazio devolve undefined, nao erro", () => {
    expect(primeiraNota([])).toBeUndefined();
  });

  it("tratando o ausente explicitamente", () => {
    expect(primeiraNotaOuZero([])).toBe(0);
    expect(primeiraNotaOuZero([5])).toBe(5);
  });

  it("fora dos limites e undefined - nao e lixo de memoria", () => {
    expect(acessoForaDosLimites()).toBeUndefined();
  });
});

describe("percurso", () => {
  it("com indice", () => {
    expect(comPosicao([9, 7])).toEqual(["1a nota: 9", "2a nota: 7"]);
  });
});

describe("metodos mutantes e nao mutantes", () => {
  it("push e shift alteram o array", () => {
    const { depois, removido } = metodosMutantes();
    expect(removido).toBe(1);
    expect(depois).toEqual([2, 3, 4]);
  });

  it("copiar antes de ordenar preserva o original", () => {
    const { original, novo } = metodosNaoMutantes();
    expect(original).toEqual([3, 1, 2]);
    expect(novo).toEqual([1, 2, 3]);
  });
});
