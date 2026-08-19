import { describe, it, expect } from "vitest";
import { calcularTotal, estimarPrazoEntrega, type Item } from "./01-implementacao-honesta.js";

const item = (quantidade: number, precoUnitario: number): Item => ({
  nome: "x",
  quantidade,
  precoUnitario,
});

describe("calcularTotal - regra generica, nao casos decorados", () => {
  // Este teste percorre 40 valores diferentes. Nao da para decorar.
  it("frete gratis acima de 200, em toda a faixa", () => {
    for (let subtotal = 201; subtotal <= 240; subtotal++) {
      expect(calcularTotal([item(1, subtotal)])).toBe(subtotal);
    }
  });

  it("frete de 25 em toda a faixa ate 200", () => {
    for (let subtotal = 160; subtotal <= 200; subtotal++) {
      expect(calcularTotal([item(1, subtotal)])).toBe(subtotal + 25);
    }
  });

  it("o limite exato de 200 paga frete", () => {
    expect(calcularTotal([item(1, 200)])).toBe(225);
  });

  it("200.01 ja tem frete gratis", () => {
    expect(calcularTotal([item(1, 200.01)])).toBe(200.01);
  });
});

describe("calcularTotal - soma dos itens", () => {
  it("soma varios itens", () => {
    expect(calcularTotal([item(2, 50), item(3, 40)])).toBe(220);
  });

  it("o mesmo subtotal por caminhos diferentes da o mesmo total", () => {
    expect(calcularTotal([item(1, 100)])).toBe(calcularTotal([item(2, 50)]));
    expect(calcularTotal([item(4, 25)])).toBe(calcularTotal([item(1, 100)]));
  });

  it("arredonda para 2 casas", () => {
    expect(calcularTotal([item(3, 0.1)])).toBe(25.3);
  });
});

describe("calcularTotal - bordas e erros", () => {
  it("carrinho vazio devolve 0, sem frete", () => {
    expect(calcularTotal([])).toBe(0);
  });

  it("quantidade negativa lanca", () => {
    expect(() => calcularTotal([item(-1, 10)])).toThrow("item invalido");
  });

  it("preco negativo lanca", () => {
    expect(() => calcularTotal([item(1, -10)])).toThrow("item invalido");
  });

  it("quantidade zero e preco zero sao validos", () => {
    expect(() => calcularTotal([item(0, 0)])).not.toThrow();
  });
});

describe("estimarPrazoEntrega - faixas", () => {
  it("primeiro digito 0 a 3 da 2 dias", () => {
    for (const d of "0123") {
      expect(estimarPrazoEntrega(`${d}1310100`)).toBe(2);
    }
  });

  it("primeiro digito 4 a 6 da 4 dias", () => {
    for (const d of "456") {
      expect(estimarPrazoEntrega(`${d}1310100`)).toBe(4);
    }
  });

  it("primeiro digito 7 a 9 da 7 dias", () => {
    for (const d of "789") {
      expect(estimarPrazoEntrega(`${d}1310100`)).toBe(7);
    }
  });

  it("aceita com hifen", () => {
    expect(estimarPrazoEntrega("01310-100")).toBe(2);
  });
});

describe("estimarPrazoEntrega - falha alto, sem chute", () => {
  it("cep vazio lanca", () => {
    expect(() => estimarPrazoEntrega("")).toThrow("cep invalido");
  });

  it("cep com letras lanca", () => {
    expect(() => estimarPrazoEntrega("abcdefgh")).toThrow("cep invalido");
  });

  it("cep curto lanca", () => {
    expect(() => estimarPrazoEntrega("123")).toThrow("cep invalido");
  });

  it("cep longo lanca", () => {
    expect(() => estimarPrazoEntrega("013101000")).toThrow("cep invalido");
  });

  it("nunca devolve um valor padrao silencioso", () => {
    for (const invalido of ["", "abc", "123", "cep-invalido", "0131010"]) {
      expect(() => estimarPrazoEntrega(invalido)).toThrow();
    }
  });
});
