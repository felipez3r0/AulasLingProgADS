import { describe, it, expect } from "vitest";
import {
  somarPedido,
  somarPedidoReduce,
  type ItemFormulario,
} from "./gerado-pela-ia.js";

const pedido: ItemFormulario[] = [
  { produto: "caderno", valor: "12" },
  { produto: "caneta", valor: "3" },
];

describe("somarPedido - a versao com Number() funciona", () => {
  it("converte antes de somar", () => {
    expect(somarPedido(pedido)).toBe(15);
  });
});

describe("somarPedido - mas nao trata valor invalido", () => {
  // Number("abc") e NaN, e NaN contamina toda a soma em silencio.
  it("BUG: valor nao numerico transforma o total em NaN", () => {
    expect(somarPedido([{ produto: "x", valor: "abc" }])).toBeNaN();
  });

  it("BUG: campo vazio vira zero, escondendo o erro de digitacao", () => {
    expect(somarPedido([{ produto: "x", valor: "" }])).toBe(0);
  });
});

describe("somarPedidoReduce - a versao que concatena", () => {
  // Com acumulador inicial "" (string), o `+` concatena em vez de somar.
  it("BUG: devolve texto colado em vez de numero", () => {
    expect(somarPedidoReduce(pedido)).toBe("123");
    expect(typeof somarPedidoReduce(pedido)).toBe("string");
  });

  it("BUG: pedido vazio devolve string vazia, nao zero", () => {
    expect(somarPedidoReduce([])).toBe("");
  });

  // Depois de corrigido (exercicio 1), o comportamento esperado e este:
  it.todo("deve devolver 15 como number, e 0 para pedido vazio");
  it.todo("deve recusar valor nao numerico em vez de devolver NaN");
});
