import { describe, it, expect } from "vitest";
import { paginar } from "./01-paginacao.js";

const dez = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("paginar - fatias", () => {
  it("pagina 1 devolve os primeiros", () => {
    expect(paginar(dez, 1, 3).itens).toEqual([1, 2, 3]);
  });

  it("pagina 2 devolve os seguintes", () => {
    expect(paginar(dez, 2, 3).itens).toEqual([4, 5, 6]);
  });

  it("a ultima pagina pode vir incompleta", () => {
    expect(paginar(dez, 4, 3).itens).toEqual([10]);
  });

  it("pagina acima do total vem vazia, sem erro", () => {
    expect(paginar(dez, 99, 3).itens).toEqual([]);
  });
});

describe("paginar - totais", () => {
  it("10 itens de 3 em 3 dao 4 paginas", () => {
    expect(paginar(dez, 1, 3).totalPaginas).toBe(4);
  });

  it("divisao exata", () => {
    expect(paginar(dez, 1, 5).totalPaginas).toBe(2);
  });

  it("um item por pagina", () => {
    expect(paginar(dez, 1, 1).totalPaginas).toBe(10);
  });

  it("porPagina maior que a lista da 1 pagina", () => {
    expect(paginar(dez, 1, 100).totalPaginas).toBe(1);
  });
});

describe("paginar - navegacao", () => {
  it("primeira pagina nao tem anterior", () => {
    const p = paginar(dez, 1, 3);
    expect(p.temAnterior).toBe(false);
    expect(p.temProxima).toBe(true);
  });

  it("pagina do meio tem os dois", () => {
    const p = paginar(dez, 2, 3);
    expect(p.temAnterior).toBe(true);
    expect(p.temProxima).toBe(true);
  });

  it("ultima pagina nao tem proxima", () => {
    const p = paginar(dez, 4, 3);
    expect(p.temAnterior).toBe(true);
    expect(p.temProxima).toBe(false);
  });
});

describe("paginar - bordas e erros", () => {
  it("lista vazia", () => {
    const p = paginar([], 1, 3);
    expect(p.itens).toEqual([]);
    expect(p.totalPaginas).toBe(0);
    expect(p.temProxima).toBe(false);
    expect(p.temAnterior).toBe(false);
  });

  it("porPagina zero lanca erro", () => {
    expect(() => paginar(dez, 1, 0)).toThrow("itens por pagina invalido");
  });

  it("porPagina negativo lanca erro", () => {
    expect(() => paginar(dez, 1, -1)).toThrow("itens por pagina invalido");
  });

  it("pagina zero lanca erro", () => {
    expect(() => paginar(dez, 0, 3)).toThrow("pagina invalida");
  });

  it("pagina negativa lanca erro", () => {
    expect(() => paginar(dez, -1, 3)).toThrow("pagina invalida");
  });

  it("nao modifica a lista recebida", () => {
    const lista = [...dez];
    paginar(lista, 2, 3);
    expect(lista).toEqual(dez);
  });

  it("paginaAtual e a informada", () => {
    expect(paginar(dez, 3, 3).paginaAtual).toBe(3);
  });
});
