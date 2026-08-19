import { describe, it, expect } from "vitest";
import {
  totalEmEstoqueOriginal,
  totalEmEstoqueRefatorado,
} from "./01-o-que-um-diff-esconde.js";

const estoqueNormal = [
  { preco: 10, quantidade: 2 },
  { preco: 5, quantidade: 3 },
];

describe("nos dados do dia a dia, as duas versoes concordam", () => {
  it("mesmo total", () => {
    expect(totalEmEstoqueOriginal(estoqueNormal)).toBe(35);
    expect(totalEmEstoqueRefatorado(estoqueNormal)).toBe(35);
  });
});

describe("com quantidade negativa, elas divergem", () => {
  const comNegativo = [
    { preco: 10, quantidade: 2 },
    { preco: 100, quantidade: -1 },
  ];

  it("a original ignora o item negativo", () => {
    expect(totalEmEstoqueOriginal(comNegativo)).toBe(20);
  });

  it("a refatorada subtrai - a mudanca que o diff nao anunciava", () => {
    expect(totalEmEstoqueRefatorado(comNegativo)).toBe(-80);
  });
});
