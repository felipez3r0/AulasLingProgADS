import { describe, expect, it } from "vitest";
import { calcularMedia } from "../src/turma.js";
// Descomente conforme for escrevendo os testes das próximas duas:
// import { aprovados, estaAprovado } from "../src/turma.js";

describe("calcularMedia", () => {
  // Exemplo já resolvido — mostra o formato esperado (describe/it/expect).
  it("retorna a média aritmética de um array de notas", () => {
    expect(calcularMedia([8, 6, 10])).toBe(8);
  });

  it("retorna 0 para array vazio", () => {
    expect(calcularMedia([])).toBe(0);
  });
});

describe("estaAprovado", () => {
  it.todo("retorna true quando a média é >= 6");
  it.todo("retorna false quando a média é < 6");
});

describe("aprovados", () => {
  it.todo("retorna só os alunos da turma com média >= 6, sem alterar o array original");
});
