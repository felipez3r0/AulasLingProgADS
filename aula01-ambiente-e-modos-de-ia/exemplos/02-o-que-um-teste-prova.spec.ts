import { describe, it, expect } from "vitest";
import {
  aplicarDescontoCerto,
  aplicarDescontoErrado,
} from "./02-o-que-um-teste-prova.js";

describe("um teste fraco aprova as duas versoes", () => {
  it("as duas devolvem menos que o valor original", () => {
    expect(aplicarDescontoCerto(100, 10)).toBeLessThan(100);
    expect(aplicarDescontoErrado(100, 10)).toBeLessThan(100);
  });
});

describe("um teste com valor esperado separa as duas", () => {
  it("10% de desconto sobre 100 deve dar 90", () => {
    expect(aplicarDescontoCerto(100, 10)).toBe(90);
  });

  it("a versao errada devolve 99.9, e o teste flagra", () => {
    expect(aplicarDescontoErrado(100, 10)).toBe(99.9);
    expect(aplicarDescontoErrado(100, 10)).not.toBe(90);
  });
});
