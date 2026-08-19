import { describe, it, expect, beforeEach } from "vitest";
import {
  registrarVenda,
  lerTotalVendido,
  zerarTotalVendido,
  type Produto,
} from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA os defeitos. Por isso ele passa.
// Corrigir e o exercicio 1 da aula.

beforeEach(() => zerarTotalVendido());

const camiseta = (): Produto => ({ nome: "camiseta", preco: 50, estoque: 10 });

describe("registrarVenda - o valor devolvido esta certo", () => {
  it("calcula quantidade vezes preco", () => {
    expect(registrarVenda(camiseta(), 2)).toBe(100);
  });
});

describe("registrarVenda - os efeitos colaterais", () => {
  it("BUG: modifica o produto que recebeu", () => {
    const produto = camiseta();
    registrarVenda(produto, 3);
    expect(produto.estoque).toBe(7); // o objeto do chamador mudou
  });

  it("BUG: permite estoque negativo sem reclamar", () => {
    const produto = camiseta();
    registrarVenda(produto, 999);
    expect(produto.estoque).toBe(-989);
  });

  // A dependencia de estado global e o que torna a funcao dificil de testar:
  // o resultado de uma chamada depende de todas as chamadas anteriores.
  it("BUG: o resultado acumula entre chamadas", () => {
    registrarVenda(camiseta(), 1);
    expect(lerTotalVendido()).toBe(50);
    registrarVenda(camiseta(), 1);
    expect(lerTotalVendido()).toBe(100); // a segunda chamada nao e independente
  });

  // Depois de corrigido (exercicio 1), o comportamento esperado e este:
  it.todo("nao deve modificar o produto recebido");
  it.todo("deve recusar venda maior que o estoque");
});
