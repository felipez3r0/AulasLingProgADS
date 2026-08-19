import { describe, it, expect } from "vitest";
import {
  avaliarMonolitico,
  avaliar,
  calcularMedia,
  calcularPresenca,
  classificarPorNota,
  type Aluno,
} from "./02-decomposicao.js";

const aluno = (over: Partial<Aluno> = {}): Aluno => ({
  nome: "Ana",
  notas: [8, 8],
  faltas: 2,
  aulasTotais: 20,
  ...over,
});

describe("as duas versoes concordam", () => {
  it("mesmo resultado nos casos testados", () => {
    for (const caso of [
      aluno(),
      aluno({ notas: [5, 5] }),
      aluno({ notas: [2, 2] }),
      aluno({ faltas: 10 }),
    ]) {
      expect(avaliar(caso)).toBe(avaliarMonolitico(caso));
    }
  });
});

// A vantagem da decomposicao aparece aqui: da para testar CADA peca.
// Na versao monolitica isso e impossivel - so da para testar o resultado final.
describe("as pecas, testadas isoladamente", () => {
  it("calcularMedia", () => {
    expect(calcularMedia([8, 10])).toBe(9);
    expect(calcularMedia([])).toBe(0);
  });

  it("calcularPresenca", () => {
    expect(calcularPresenca(0, 20)).toBe(1);
    expect(calcularPresenca(5, 20)).toBe(0.75);
    expect(calcularPresenca(0, 0)).toBe(0);
  });

  it("classificarPorNota", () => {
    expect(classificarPorNota(6)).toBe("aprovado");
    expect(classificarPorNota(4)).toBe("recuperacao");
    expect(classificarPorNota(3.9)).toBe("reprovado por nota");
  });
});

describe("regra de negocio combinada", () => {
  it("falta reprova mesmo com nota boa", () => {
    expect(avaliar(aluno({ notas: [10, 10], faltas: 10 }))).toBe("reprovado por falta");
  });

  it("presenca exatamente 75% aprova", () => {
    expect(avaliar(aluno({ notas: [8, 8], faltas: 5, aulasTotais: 20 }))).toBe("aprovado");
  });
});
