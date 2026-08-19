import { describe, it, expect } from "vitest";
import { somarPedido, type ItemFormulario } from "./01-somar-formulario.js";

const pedido: ItemFormulario[] = [
  { produto: "caderno", valor: "12" },
  { produto: "caneta", valor: "3" },
];

describe("somarPedido - caminho feliz", () => {
  it("soma valores inteiros", () => {
    expect(somarPedido(pedido)).toBe(15);
  });

  it("o resultado e number, nao string", () => {
    expect(typeof somarPedido(pedido)).toBe("number");
  });

  it("aceita decimais", () => {
    expect(somarPedido([{ produto: "x", valor: "12.5" }, { produto: "y", valor: "0.5" }])).toBe(13);
  });

  it("arredonda para 2 casas", () => {
    expect(
      somarPedido([
        { produto: "a", valor: "0.1" },
        { produto: "b", valor: "0.2" },
      ]),
    ).toBe(0.3);
  });
});

describe("somarPedido - bordas", () => {
  it("pedido vazio devolve 0, nao string vazia", () => {
    expect(somarPedido([])).toBe(0);
    expect(typeof somarPedido([])).toBe("number");
  });

  it("um item so", () => {
    expect(somarPedido([{ produto: "x", valor: "7" }])).toBe(7);
  });
});

describe("somarPedido - entradas invalidas", () => {
  it("valor nao numerico lanca erro em vez de virar NaN", () => {
    expect(() => somarPedido([{ produto: "x", valor: "abc" }])).toThrow("valor invalido: abc");
  });

  it("valor vazio lanca erro em vez de virar zero", () => {
    expect(() => somarPedido([{ produto: "x", valor: "" }])).toThrow("valor invalido: ");
  });

  it("nunca devolve NaN", () => {
    expect(somarPedido(pedido)).not.toBeNaN();
  });
});
