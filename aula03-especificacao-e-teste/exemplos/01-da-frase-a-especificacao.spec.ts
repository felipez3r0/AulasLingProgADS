import { describe, it, expect } from "vitest";
import { emailValido } from "./01-da-frase-a-especificacao.js";

// Repare: cada `it` corresponde a UMA linha da especificacao.
// A especificacao virou teste quase palavra por palavra.

describe("emailValido - o que a especificacao promete", () => {
  it("aceita um email comum", () => {
    expect(emailValido("ana@fatec.sp.gov.br")).toBe(true);
  });

  it("exige exatamente um arroba", () => {
    expect(emailValido("anafatec.br")).toBe(false);
    expect(emailValido("ana@@fatec.br")).toBe(false);
    expect(emailValido("a@b@c.br")).toBe(false);
  });

  it("exige algo antes do arroba", () => {
    expect(emailValido("@fatec.br")).toBe(false);
  });

  it("exige um ponto no dominio, com conteudo dos dois lados", () => {
    expect(emailValido("ana@fatec")).toBe(false);
    expect(emailValido("ana@fatec.")).toBe(false);
    expect(emailValido("ana@.br")).toBe(false);
  });

  it("apara espacos nas pontas", () => {
    expect(emailValido("  ana@fatec.br  ")).toBe(true);
  });

  it("string vazia e invalida, e nao lanca erro", () => {
    expect(() => emailValido("")).not.toThrow();
    expect(emailValido("")).toBe(false);
  });

  it("maiusculas nao importam", () => {
    expect(emailValido("ANA@FATEC.BR")).toBe(true);
  });
});
