import { describe, it, expect } from "vitest";
import { registrarVenda, type Produto } from "./01-venda-pura.js";

const camiseta = (): Produto => ({ nome: "camiseta", preco: 49.9, estoque: 10 });

describe("registrarVenda - calculo", () => {
  it("valor e quantidade vezes preco", () => {
    expect(registrarVenda(camiseta(), 2).valor).toBe(99.8);
  });

  it("arredonda para 2 casas", () => {
    const p: Produto = { nome: "x", preco: 0.1, estoque: 100 };
    expect(registrarVenda(p, 3).valor).toBe(0.3);
  });

  it("desconta o estoque no produto devolvido", () => {
    expect(registrarVenda(camiseta(), 3).produtoAtualizado.estoque).toBe(7);
  });

  it("preserva os demais campos", () => {
    const r = registrarVenda(camiseta(), 1).produtoAtualizado;
    expect(r.nome).toBe("camiseta");
    expect(r.preco).toBe(49.9);
  });
});

describe("registrarVenda - pureza", () => {
  it("nao modifica o produto recebido", () => {
    const produto = camiseta();
    registrarVenda(produto, 3);
    expect(produto.estoque).toBe(10);
  });

  it("devolve um objeto novo, nao o mesmo", () => {
    const produto = camiseta();
    expect(registrarVenda(produto, 1).produtoAtualizado).not.toBe(produto);
  });

  it("chamadas repetidas dao o mesmo resultado", () => {
    const produto = camiseta();
    const a = registrarVenda(produto, 2);
    const b = registrarVenda(produto, 2);
    expect(a.valor).toBe(b.valor);
    expect(a.produtoAtualizado.estoque).toBe(b.produtoAtualizado.estoque);
  });
});

describe("registrarVenda - limites", () => {
  it("vender todo o estoque e permitido", () => {
    expect(registrarVenda(camiseta(), 10).produtoAtualizado.estoque).toBe(0);
  });

  it("um a mais que o estoque lanca erro", () => {
    expect(() => registrarVenda(camiseta(), 11)).toThrow("estoque insuficiente");
  });

  it("quantidade zero lanca erro", () => {
    expect(() => registrarVenda(camiseta(), 0)).toThrow("quantidade invalida");
  });

  it("quantidade negativa lanca erro", () => {
    expect(() => registrarVenda(camiseta(), -1)).toThrow("quantidade invalida");
  });
});
