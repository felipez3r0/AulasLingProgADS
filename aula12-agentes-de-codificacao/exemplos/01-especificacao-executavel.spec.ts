import { describe, it, expect } from "vitest";
import { calcularDesconto, type Cliente } from "./01-especificacao-executavel.js";

// Repare: cada `it` corresponde a UMA linha do contrato.
// E este conjunto de testes que voce entrega ao agente como criterio de aceite.

const cliente = (over: Partial<Cliente> = {}): Cliente => ({
  nome: "Ana",
  comprasNoAno: 0,
  totalGastoNoAno: 0,
  desdeQuandoEmMeses: 0,
  ...over,
});

describe("base por volume - faixas nao acumulam", () => {
  it("ate 1000 nao ha desconto", () => {
    expect(calcularDesconto(cliente({ totalGastoNoAno: 1000 }))).toBe(0);
  });

  it("acima de 1000 da 5", () => {
    expect(calcularDesconto(cliente({ totalGastoNoAno: 1000.01 }))).toBe(5);
    expect(calcularDesconto(cliente({ totalGastoNoAno: 5000 }))).toBe(5);
  });

  it("acima de 5000 da 10, e nao 15", () => {
    expect(calcularDesconto(cliente({ totalGastoNoAno: 5000.01 }))).toBe(10);
  });
});

describe("bonus de fidelidade - o maior substitui o menor", () => {
  it("12 meses da +2", () => {
    expect(calcularDesconto(cliente({ desdeQuandoEmMeses: 12 }))).toBe(2);
  });

  it("24 meses da +5, nao +7", () => {
    expect(calcularDesconto(cliente({ desdeQuandoEmMeses: 24 }))).toBe(5);
  });

  it("11 meses nao da bonus", () => {
    expect(calcularDesconto(cliente({ desdeQuandoEmMeses: 11 }))).toBe(0);
  });
});

describe("bonus de frequencia - este SOMA", () => {
  it("10 compras dao +3", () => {
    expect(calcularDesconto(cliente({ comprasNoAno: 10 }))).toBe(3);
  });

  it("9 compras nao dao bonus", () => {
    expect(calcularDesconto(cliente({ comprasNoAno: 9 }))).toBe(0);
  });
});

describe("combinacoes e limite", () => {
  it("volume + fidelidade + frequencia", () => {
    // 10 (volume) + 5 (24 meses) + 3 (10 compras) = 18, limitado a 15
    expect(
      calcularDesconto(
        cliente({ totalGastoNoAno: 9000, desdeQuandoEmMeses: 30, comprasNoAno: 12 }),
      ),
    ).toBe(15);
  });

  it("combinacao abaixo do limite nao e cortada", () => {
    // 5 (volume) + 2 (12 meses) = 7
    expect(
      calcularDesconto(cliente({ totalGastoNoAno: 2000, desdeQuandoEmMeses: 12 })),
    ).toBe(7);
  });

  it("cliente novo sem historico tem desconto zero", () => {
    expect(calcularDesconto(cliente())).toBe(0);
  });
});

describe("dados invalidos", () => {
  it("qualquer campo negativo lanca", () => {
    expect(() => calcularDesconto(cliente({ totalGastoNoAno: -1 }))).toThrow("dados invalidos");
    expect(() => calcularDesconto(cliente({ comprasNoAno: -1 }))).toThrow("dados invalidos");
    expect(() => calcularDesconto(cliente({ desdeQuandoEmMeses: -1 }))).toThrow("dados invalidos");
  });
});
