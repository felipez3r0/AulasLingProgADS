import { describe, it, expect } from "vitest";
import {
  formatarId,
  descreverPagamento,
  primeiro,
  dividir,
  resumir,
  type Pagamento,
} from "./02-unioes.js";

describe("uniao simples e type guard", () => {
  it("trata string e number de formas diferentes", () => {
    expect(formatarId("abc")).toBe("ABC");
    expect(formatarId(42)).toBe("#42");
  });
});

describe("uniao discriminada", () => {
  it("cada variante tem seu formato", () => {
    const casos: Pagamento[] = [
      { metodo: "dinheiro", valor: 50 },
      { metodo: "cartao", valor: 100, parcelas: 3 },
      { metodo: "pix", valor: 30, chave: "ana@fatec.br" },
    ];
    expect(descreverPagamento(casos[0]!)).toBe("R$ 50 em dinheiro");
    expect(descreverPagamento(casos[1]!)).toBe("R$ 100 em 3x no cartao");
    expect(descreverPagamento(casos[2]!)).toBe("R$ 30 via pix para ana@fatec.br");
  });
});

describe("generics", () => {
  it("preserva o tipo do elemento", () => {
    expect(primeiro([1, 2, 3])).toBe(1);
    expect(primeiro(["a", "b"])).toBe("a");
    expect(primeiro([])).toBeUndefined();
  });
});

describe("Resultado: falha como valor, nao como excecao", () => {
  it("sucesso carrega o valor", () => {
    const r = dividir(10, 2);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.valor).toBe(5);
  });

  it("falha carrega o erro, sem lancar", () => {
    expect(() => dividir(10, 0)).not.toThrow();
    const r = dividir(10, 0);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.erro).toBe("divisao por zero");
  });
});

describe("utility types", () => {
  it("Pick reduz aos campos escolhidos", () => {
    expect(resumir({ id: "1", nome: "Caderno", preco: 10, estoque: 5 })).toEqual({
      id: "1",
      nome: "Caderno",
    });
  });
});
