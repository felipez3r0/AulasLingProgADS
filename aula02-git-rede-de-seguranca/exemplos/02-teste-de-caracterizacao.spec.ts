import { describe, it, expect } from "vitest";
import { totalEmEstoque, type Item } from "./02-teste-de-caracterizacao.js";

// Estes casos foram escritos observando a versao ANTIGA rodar.
// Eles nao dizem o que o codigo "deveria" fazer - dizem o que ele FAZ.
// Depois da refatoracao, todos continuam verdes: prova de equivalencia.

describe("totalEmEstoque - comportamento caracterizado", () => {
  it("soma preco vezes quantidade", () => {
    expect(totalEmEstoque([{ preco: 10, quantidade: 2 }])).toBe(20);
  });

  it("lista vazia da zero", () => {
    expect(totalEmEstoque([])).toBe(0);
  });

  it("ignora item com quantidade zero", () => {
    expect(totalEmEstoque([{ preco: 10, quantidade: 0 }])).toBe(0);
  });

  it("ignora item com quantidade negativa - esquisitice preservada", () => {
    expect(totalEmEstoque([{ preco: 100, quantidade: -1 }])).toBe(0);
  });

  it("aceita preco decimal", () => {
    expect(totalEmEstoque([{ preco: 2.5, quantidade: 4 }])).toBe(10);
  });

  it("nao modifica a lista recebida", () => {
    const itens: Item[] = [{ preco: 10, quantidade: 2 }];
    totalEmEstoque(itens);
    expect(itens).toEqual([{ preco: 10, quantidade: 2 }]);
  });
});
