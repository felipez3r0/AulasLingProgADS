import { describe, it, expect } from "vitest";
import {
  estatisticas,
  normalizarNome,
  seguro,
  clonarPorJson,
  ordenarSemMutar,
} from "./02-biblioteca-padrao.js";

describe("Array", () => {
  it("estatisticas basicas", () => {
    expect(estatisticas([3, -1, 4, 2])).toEqual({
      soma: 8,
      maior: 4,
      pares: [4, 2],
      temNegativo: true,
    });
  });

  it("lista vazia", () => {
    expect(estatisticas([])).toEqual({ soma: 0, maior: undefined, pares: [], temNegativo: false });
  });
});

describe("String", () => {
  it("normaliza nome com espacos extras", () => {
    expect(normalizarNome("  ANA   maria  SILVA ")).toBe("Ana Maria Silva");
  });
});

describe("Number", () => {
  it("converte com seguranca", () => {
    expect(seguro("12")).toBe(12);
    expect(seguro("abc")).toBe(0);
    expect(seguro(null)).toBe(0);
    expect(seguro(Infinity)).toBe(0);
  });
});

describe("JSON", () => {
  it("clona estrutura aninhada", () => {
    const original = { itens: [{ nome: "a" }] };
    const copia = clonarPorJson(original);
    copia.itens[0]!.nome = "mudou";
    expect(original.itens[0]?.nome).toBe("a");
  });
});

describe("toSorted nao muta", () => {
  it("preserva o array original", () => {
    const original = [3, 1, 2];
    expect(ordenarSemMutar(original)).toEqual([1, 2, 3]);
    expect(original).toEqual([3, 1, 2]);
  });
});
