import { describe, it, expect } from "vitest";
import { validarCPF, formatarData } from "./01-validadores.js";

describe("validarCPF - validos", () => {
  it("aceita com pontuacao", () => {
    expect(validarCPF("529.982.247-25")).toBe(true);
  });

  it("aceita sem pontuacao", () => {
    expect(validarCPF("52998224725")).toBe(true);
  });
});

describe("validarCPF - invalidos", () => {
  it("recusa digito verificador errado", () => {
    expect(validarCPF("529.982.247-26")).toBe(false);
  });

  it("recusa quantidade errada de digitos", () => {
    expect(validarCPF("123")).toBe(false);
    expect(validarCPF("529982247250")).toBe(false);
  });

  it("recusa sequencia de digitos repetidos", () => {
    for (const d of "0123456789") {
      expect(validarCPF(d.repeat(11))).toBe(false);
    }
  });

  it("entrada vazia devolve false sem lancar", () => {
    expect(() => validarCPF("")).not.toThrow();
    expect(validarCPF("")).toBe(false);
  });

  it("texto sem digitos devolve false", () => {
    expect(validarCPF("abcdefghijk")).toBe(false);
  });
});

describe("formatarData - conversao", () => {
  it("converte data comum", () => {
    expect(formatarData("2026-03-01")).toBe("01/03/2026");
  });

  it("preserva zeros a esquerda", () => {
    expect(formatarData("2026-03-05")).toBe("05/03/2026");
  });

  it("primeiro dia do ano", () => {
    expect(formatarData("2026-01-01")).toBe("01/01/2026");
  });

  it("ultimo dia do ano", () => {
    expect(formatarData("2026-12-31")).toBe("31/12/2026");
  });

  it("nao depende do fuso: o dia nunca volta um", () => {
    expect(formatarData("2026-03-01").startsWith("01")).toBe(true);
    expect(formatarData("2026-01-01").startsWith("01")).toBe(true);
  });
});

describe("formatarData - entradas invalidas", () => {
  it("formato errado lanca erro", () => {
    expect(() => formatarData("01/03/2026")).toThrow("data invalida");
    expect(() => formatarData("2026-3-1")).toThrow("data invalida");
    expect(() => formatarData("")).toThrow("data invalida");
  });

  it("mes fora da faixa lanca erro", () => {
    expect(() => formatarData("2026-13-01")).toThrow("data invalida");
    expect(() => formatarData("2026-00-01")).toThrow("data invalida");
  });

  it("dia fora da faixa lanca erro", () => {
    expect(() => formatarData("2026-03-32")).toThrow("data invalida");
    expect(() => formatarData("2026-03-00")).toThrow("data invalida");
  });
});
