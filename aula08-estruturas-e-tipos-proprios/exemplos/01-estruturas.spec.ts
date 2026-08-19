import { describe, it, expect } from "vitest";
import {
  criarAluno,
  descrever,
  desativar,
  notaOuZero,
  type Matricula,
} from "./01-estruturas.js";

describe("estruturas", () => {
  it("cria com os valores padrao", () => {
    expect(criarAluno("111", "Ana")).toEqual({
      ra: "111",
      nome: "Ana",
      curso: "ADS",
      ativo: true,
    });
  });

  it("destructuring extrai campos", () => {
    expect(descrever(criarAluno("111", "Ana"))).toBe("Ana (ADS)");
  });
});

describe("atualizar sem mutar", () => {
  it("devolve um objeto novo desativado", () => {
    const aluno = criarAluno("111", "Ana");
    const desativado = desativar(aluno);
    expect(desativado.ativo).toBe(false);
    expect(aluno.ativo).toBe(true);
    expect(desativado).not.toBe(aluno);
  });
});

describe("propriedade opcional", () => {
  it("sem nota devolve zero", () => {
    const m: Matricula = { id: "1", alunoRa: "111", disciplina: "LP" };
    expect(notaOuZero(m)).toBe(0);
  });

  it("com nota devolve a nota", () => {
    const m: Matricula = { id: "1", alunoRa: "111", disciplina: "LP", nota: 8 };
    expect(notaOuZero(m)).toBe(8);
  });

  it("nota zero e preservada - o motivo de usar ?? e nao ||", () => {
    const m: Matricula = { id: "1", alunoRa: "111", disciplina: "LP", nota: 0 };
    expect(notaOuZero(m)).toBe(0);
  });
});
