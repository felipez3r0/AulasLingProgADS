import { describe, it, expect } from "vitest";
import { mediaMovel, mediaMovelOtimizada } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA os defeitos. Por isso ele passa.
// Corrigir e o exercicio 1 da aula.

const leituras = [10, 20, 30, 40, 50];

describe("mediaMovel - a primeira versao esta correta", () => {
  it("gera as tres janelas esperadas", () => {
    expect(mediaMovel(leituras)).toEqual([20, 30, 40]);
  });

  it("lista menor que a janela devolve vazio", () => {
    expect(mediaMovel([1, 2])).toEqual([]);
  });
});

describe("mediaMovelOtimizada - o off-by-one", () => {
  // O limite virou `i < leituras.length - 1`, entao o laco da 4 voltas
  // em vez de 3. As duas ultimas janelas passam do fim do array e o `?? 0`
  // preenche com zero, puxando a media para baixo.
  it("BUG: gera 4 janelas em vez de 3", () => {
    expect(mediaMovelOtimizada(leituras)).toHaveLength(4);
  });

  it("BUG: a ultima janela usa um zero que nao existe nos dados", () => {
    const r = mediaMovelOtimizada(leituras);
    expect(r[3]).toBe(30); // (40 + 50 + 0) / 3
  });

  it("BUG: o `?? 0` escondeu o erro em vez de denunciar", () => {
    // Sem o `?? 0` haveria NaN, que ao menos seria visivel.
    expect(r0(mediaMovelOtimizada(leituras))).not.toBeNaN();
  });

  // Depois de corrigido (exercicio 1), o comportamento esperado e este:
  it.todo("deve gerar exatamente 3 janelas para 5 leituras");
});

function r0(lista: number[]): number {
  return lista[lista.length - 1] ?? 0;
}
