import { describe, it, expect } from "vitest";
import { calcularMedia } from "./01-media-corrigida.js";

describe("calcularMedia", () => {
  it("calcula a media do caminho feliz", () => {
    expect(calcularMedia([8, 6, 10])).toBe(8);
  });

  it("funciona com uma nota so", () => {
    expect(calcularMedia([7])).toBe(7);
  });

  it("devolve 0 para array vazio - este e o caso que a IA errou", () => {
    expect(calcularMedia([])).toBe(0);
  });

  it("nunca devolve NaN", () => {
    expect(calcularMedia([])).not.toBeNaN();
    expect(calcularMedia([1, 2])).not.toBeNaN();
  });

  it("lida com notas decimais", () => {
    expect(calcularMedia([7.5, 8.5])).toBe(8);
  });

  it("nao modifica o array recebido", () => {
    const notas = [8, 6, 10];
    calcularMedia(notas);
    expect(notas).toEqual([8, 6, 10]);
  });
});
