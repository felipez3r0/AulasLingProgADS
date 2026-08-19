import { describe, it, expect } from "vitest";
import {
  calcularSaldo,
  maioresTransacoes,
  extratoAcumulado,
  type Transacao,
} from "./02-caca-ao-bug.js";

const transacoes = (): Transacao[] => [
  { id: "t1", tipo: "credito", valor: 100 },
  { id: "t2", tipo: "debito", valor: 30 },
  { id: "t3", tipo: "credito", valor: 50 },
];

describe("calcularSaldo - o que ja funciona", () => {
  it("soma creditos e subtrai debitos", () => {
    expect(calcularSaldo(transacoes(), 0)).toBe(120);
  });

  it("considera o saldo inicial", () => {
    expect(calcularSaldo(transacoes(), 500)).toBe(620);
  });

  it("lista vazia devolve o saldo inicial", () => {
    expect(calcularSaldo([], 42)).toBe(42);
  });

  it("valor negativo lanca erro", () => {
    expect(() => calcularSaldo([{ id: "x", tipo: "credito", valor: -1 }], 0)).toThrow(
      "valor invalido",
    );
  });
});

describe("calcularSaldo - BUG 1", () => {
  // `NaN < 0` e false, entao NaN atravessa a validacao intacto.
  // A partir dai o saldo inteiro vira NaN, em silencio.
  it("NaN no valor lanca erro em vez de contaminar o saldo", () => {
    expect(() => calcularSaldo([{ id: "x", tipo: "credito", valor: NaN }], 0)).toThrow(
      "valor invalido",
    );
  });

  it("Infinity tambem lanca erro", () => {
    expect(() => calcularSaldo([{ id: "x", tipo: "credito", valor: Infinity }], 0)).toThrow(
      "valor invalido",
    );
  });

  it("o saldo nunca sai NaN", () => {
    expect(calcularSaldo(transacoes(), 0)).not.toBeNaN();
  });
});

describe("maioresTransacoes - BUG 2", () => {
  it("devolve as maiores em ordem decrescente", () => {
    expect(maioresTransacoes(transacoes(), 2).map((t) => t.id)).toEqual(["t1", "t3"]);
  });

  it("desempata pelo id em ordem crescente", () => {
    const empate: Transacao[] = [
      { id: "zz", tipo: "credito", valor: 100 },
      { id: "aa", tipo: "credito", valor: 100 },
    ];
    expect(maioresTransacoes(empate, 2).map((t) => t.id)).toEqual(["aa", "zz"]);
  });

  it("nao modifica a lista recebida", () => {
    const lista = transacoes();
    maioresTransacoes(lista, 2);
    expect(lista.map((t) => t.id)).toEqual(["t1", "t2", "t3"]);
  });

  it("quantidade maior que a lista devolve tudo", () => {
    expect(maioresTransacoes(transacoes(), 99)).toHaveLength(3);
  });

  it("lista vazia", () => {
    expect(maioresTransacoes([], 3)).toEqual([]);
  });
});

describe("extratoAcumulado - BUG 3", () => {
  it("o saldo ACUMULA ao longo das transacoes", () => {
    expect(extratoAcumulado(transacoes(), 0)).toEqual([
      { id: "t1", saldo: 100 },
      { id: "t2", saldo: 70 },
      { id: "t3", saldo: 120 },
    ]);
  });

  it("parte do saldo inicial", () => {
    expect(extratoAcumulado(transacoes(), 1000)[2]?.saldo).toBe(1120);
  });

  it("o ultimo saldo do extrato bate com calcularSaldo", () => {
    const extrato = extratoAcumulado(transacoes(), 250);
    expect(extrato[extrato.length - 1]?.saldo).toBe(calcularSaldo(transacoes(), 250));
  });

  it("lista vazia devolve lista vazia", () => {
    expect(extratoAcumulado([], 100)).toEqual([]);
  });

  it("uma transacao so", () => {
    expect(extratoAcumulado([{ id: "a", tipo: "debito", valor: 10 }], 100)).toEqual([
      { id: "a", saldo: 90 },
    ]);
  });
});
