import { describe, it, expect } from "vitest";
import { diagnosticar } from "./03-diagnostico.js";

describe("diagnosticar - erro comum", () => {
  it("extrai mensagem e tipo", () => {
    const r = diagnosticar(new Error("deu ruim"));
    expect(r.mensagem).toBe("deu ruim");
    expect(r.tipo).toBe("Error");
  });

  it("reconhece subtipos de erro", () => {
    expect(diagnosticar(new TypeError("tipo errado")).tipo).toBe("TypeError");
    expect(diagnosticar(new RangeError("fora da faixa")).tipo).toBe("RangeError");
  });

  it("sem causa, a cadeia vem vazia", () => {
    expect(diagnosticar(new Error("sozinho")).cadeiaDeCausas).toEqual([]);
  });
});

describe("diagnosticar - cadeia de causas", () => {
  it("lista as causas do mais externo para o mais interno", () => {
    const raiz = new Error("ENOENT: arquivo nao encontrado");
    const meio = new Error("falha ao ler configuracao", { cause: raiz });
    const topo = new Error("falha ao iniciar aplicacao", { cause: meio });
    expect(diagnosticar(topo).cadeiaDeCausas).toEqual([
      "falha ao ler configuracao",
      "ENOENT: arquivo nao encontrado",
    ]);
  });

  it("a mensagem do topo nao entra na cadeia", () => {
    const topo = new Error("topo", { cause: new Error("fundo") });
    const r = diagnosticar(topo);
    expect(r.mensagem).toBe("topo");
    expect(r.cadeiaDeCausas).toEqual(["fundo"]);
  });

  it("cadeia circular nao trava", () => {
    const a = new Error("a");
    const b = new Error("b", { cause: a });
    (a as Error & { cause?: unknown }).cause = b;
    const r = diagnosticar(b);
    expect(r.cadeiaDeCausas.length).toBeLessThan(10);
  });
});

describe("diagnosticar - origem no stack", () => {
  it("extrai arquivo e linha", () => {
    const erro = new Error("com stack");
    erro.stack = "Error: com stack\n    at minhaFuncao (/app/src/servico.ts:42:15)";
    const r = diagnosticar(erro);
    expect(r.arquivoDeOrigem).toBe("/app/src/servico.ts");
    expect(r.linhaDeOrigem).toBe(42);
  });

  it("stack sem formato reconhecivel devolve null", () => {
    const erro = new Error("sem stack util");
    erro.stack = "Error: sem stack util";
    const r = diagnosticar(erro);
    expect(r.arquivoDeOrigem).toBeNull();
    expect(r.linhaDeOrigem).toBeNull();
  });

  it("stack ausente devolve null", () => {
    const erro = new Error("sem stack");
    delete (erro as Partial<Error>).stack;
    expect(diagnosticar(erro).arquivoDeOrigem).toBeNull();
  });
});

describe("diagnosticar - erro de sistema", () => {
  it("reconhece codigo ENOENT", () => {
    const erro = Object.assign(new Error("nao existe"), { code: "ENOENT" });
    expect(diagnosticar(erro).ehErroDeSistema).toBe(true);
  });

  it("erro comum nao e de sistema", () => {
    expect(diagnosticar(new Error("comum")).ehErroDeSistema).toBe(false);
  });

  it("codigo que nao comeca com E nao conta", () => {
    const erro = Object.assign(new Error("x"), { code: "ABORT" });
    expect(diagnosticar(erro).ehErroDeSistema).toBe(false);
  });
});

describe("diagnosticar - nunca lanca", () => {
  it("aceita string lancada", () => {
    const r = diagnosticar("so um texto");
    expect(r.mensagem).toBe("so um texto");
    expect(r.tipo).toBe("NaoEhErro");
  });

  it("aceita numero", () => {
    expect(diagnosticar(42).mensagem).toBe("42");
  });

  it("aceita null", () => {
    expect(() => diagnosticar(null)).not.toThrow();
    expect(diagnosticar(null).tipo).toBe("NaoEhErro");
  });

  it("aceita undefined", () => {
    expect(() => diagnosticar(undefined)).not.toThrow();
  });

  it("aceita objeto qualquer", () => {
    expect(() => diagnosticar({ qualquer: "coisa" })).not.toThrow();
    expect(diagnosticar({ qualquer: "coisa" }).tipo).toBe("NaoEhErro");
  });
});
