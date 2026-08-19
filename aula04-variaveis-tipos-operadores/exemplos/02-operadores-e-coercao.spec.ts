import { describe, it, expect } from "vitest";
import {
  precedencia,
  ehPar,
  somaComTexto,
  somaConvertida,
  comparacoes,
  aprovado,
  comPadrao,
  comOuLogico,
} from "./02-operadores-e-coercao.js";

describe("aritmetica", () => {
  it("multiplicacao vem antes da soma", () => {
    expect(precedencia()).toBe(14);
  });

  it("resto identifica pares", () => {
    expect(ehPar(4)).toBe(true);
    expect(ehPar(7)).toBe(false);
    expect(ehPar(0)).toBe(true);
    expect(ehPar(-3)).toBe(false);
  });
});

describe("coercao com o operador +", () => {
  it("string + numero concatena", () => {
    expect(somaComTexto()).toBe("105");
    expect(typeof somaComTexto()).toBe("string");
  });

  it("convertendo antes, soma de verdade", () => {
    expect(somaConvertida()).toBe(15);
  });
});

describe("== contra ===", () => {
  it("0 == '' e verdadeiro; 0 === '' e falso", () => {
    expect(comparacoes().frouxa).toBe(true);
    expect(comparacoes().estrita).toBe(false);
  });
});

describe("logicos e valores padrao", () => {
  it("aprovacao exige media e presenca", () => {
    expect(aprovado(7, 0.8)).toBe(true);
    expect(aprovado(7, 0.5)).toBe(false);
    expect(aprovado(5, 0.9)).toBe(false);
  });

  it("?? so cai no padrao para null e undefined", () => {
    expect(comPadrao(null)).toBe(0);
    expect(comPadrao(undefined)).toBe(0);
    expect(comPadrao(5)).toBe(5);
    expect(comPadrao(0)).toBe(0); // zero e um valor legitimo, e sobrevive
  });

  it("|| tambem cai no padrao para zero - a diferenca que gera bug", () => {
    expect(comOuLogico(5)).toBe(5);
    expect(comOuLogico(0)).toBe(-1); // zero foi tratado como ausencia
  });
});
