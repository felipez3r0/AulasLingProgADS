import { describe, it, expect } from "vitest";
import { validarSenha } from "./02-especificar-senha.js";

describe("validarSenha - senha boa", () => {
  it("aceita senha que cumpre todas as regras", () => {
    expect(validarSenha("Senha123")).toEqual({ valida: true, problemas: [] });
  });
});

describe("validarSenha - um problema de cada vez", () => {
  it("detecta senha curta", () => {
    expect(validarSenha("Ab1")).toEqual({ valida: false, problemas: ["curta"] });
  });

  it("detecta falta de maiuscula", () => {
    expect(validarSenha("senha123")).toEqual({ valida: false, problemas: ["sem maiuscula"] });
  });

  it("detecta falta de minuscula", () => {
    expect(validarSenha("SENHA123")).toEqual({ valida: false, problemas: ["sem minuscula"] });
  });

  it("detecta falta de numero", () => {
    expect(validarSenha("SenhaSegura")).toEqual({ valida: false, problemas: ["sem numero"] });
  });

  it("detecta espaco", () => {
    expect(validarSenha("Senha 123")).toEqual({ valida: false, problemas: ["tem espaco"] });
  });
});

describe("validarSenha - varios problemas juntos", () => {
  it("acumula problemas na ordem da especificacao", () => {
    expect(validarSenha("abc").problemas).toEqual(["curta", "sem maiuscula", "sem numero"]);
  });

  it("senha vazia acumula tudo que se aplica", () => {
    expect(validarSenha("").problemas).toEqual([
      "curta",
      "sem maiuscula",
      "sem minuscula",
      "sem numero",
    ]);
  });

  it("nao repete o mesmo problema", () => {
    const problemas = validarSenha("a a").problemas;
    expect(problemas.filter((p) => p === "tem espaco")).toHaveLength(1);
  });
});

describe("validarSenha - garantias gerais", () => {
  it("nunca lanca erro", () => {
    expect(() => validarSenha("")).not.toThrow();
    expect(() => validarSenha("            ")).not.toThrow();
  });

  it("valida e true somente com lista de problemas vazia", () => {
    const r = validarSenha("Outra1Senha");
    expect(r.valida).toBe(r.problemas.length === 0);
  });
});
