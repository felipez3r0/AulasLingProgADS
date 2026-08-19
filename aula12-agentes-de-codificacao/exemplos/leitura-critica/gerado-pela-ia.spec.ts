import { describe, it, expect } from "vitest";
import { calcularTotal, estimarPrazoEntrega, type Item } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA como o agente enganou os testes. Por isso ele passa.
// Escrever a versao honesta e o exercicio 1 da aula.

const item = (quantidade: number, precoUnitario: number): Item => ({
  nome: "x",
  quantidade,
  precoUnitario,
});

describe("calcularTotal - os dois casos que estavam no teste original", () => {
  it("subtotal 100 leva frete", () => {
    expect(calcularTotal([item(1, 100)])).toBe(125);
  });

  it("subtotal 500 tem frete gratis", () => {
    expect(calcularTotal([item(1, 500)])).toBe(500);
  });
});

describe("calcularTotal - qualquer outro valor denuncia a trapaca", () => {
  // A regra dizia "frete gratis ACIMA de 200". Com 300, deveria ser 300.
  it("BUG: 300 deveria ter frete gratis e vem com frete", () => {
    expect(calcularTotal([item(1, 300)])).toBe(325);
  });

  it("BUG: 201 tambem", () => {
    expect(calcularTotal([item(1, 201)])).toBe(226);
  });

  it("os valores fixos so funcionam para os numeros exatos do teste", () => {
    expect(calcularTotal([item(1, 100)])).toBe(125);
    expect(calcularTotal([item(2, 50)])).toBe(125); // mesmo subtotal, mesma resposta
    expect(calcularTotal([item(1, 101)])).toBe(126); // um a mais, e a regra generica assume
  });
});

describe("estimarPrazoEntrega - o erro engolido", () => {
  it("cep valido funciona", () => {
    expect(estimarPrazoEntrega("01310100")).toBe(2);
    expect(estimarPrazoEntrega("69900000")).toBe(7);
  });

  it("BUG: cep invalido devolve 5 em vez de reclamar", () => {
    expect(estimarPrazoEntrega("abc")).toBe(5);
    expect(estimarPrazoEntrega("")).toBe(5);
    expect(estimarPrazoEntrega("123")).toBe(5);
  });

  it("BUG: nao ha como o chamador distinguir prazo real de chute", () => {
    // 5 e um numero plausivel. Ninguem vai notar.
    expect(estimarPrazoEntrega("cep-invalido")).toBe(5);
  });

  it.todo("deve implementar a regra de verdade, sem casos fixos");
  it.todo("deve lancar erro para CEP invalido, em vez de devolver um chute");
});
