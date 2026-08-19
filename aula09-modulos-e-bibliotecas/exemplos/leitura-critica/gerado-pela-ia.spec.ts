import { describe, it, expect } from "vitest";
import { validarCPF, formatarData } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA os defeitos. Por isso ele passa.
// Corrigir e o exercicio 1 da aula.

describe("validarCPF - funciona", () => {
  it("aceita CPF valido", () => {
    expect(validarCPF("529.982.247-25")).toBe(true);
  });

  it("recusa digito verificador errado", () => {
    expect(validarCPF("529.982.247-26")).toBe(false);
  });

  it("recusa quantidade errada de digitos", () => {
    expect(validarCPF("123")).toBe(false);
  });
});

describe("validarCPF - o defeito", () => {
  // Sequencias repetidas (111.111.111-11, 000.000.000-00) passam na conta
  // dos digitos verificadores, mas nao sao CPFs validos. E a validacao
  // que quase toda implementacao gerada esquece.
  it("BUG: aceita sequencia repetida", () => {
    expect(validarCPF("111.111.111-11")).toBe(true);
    expect(validarCPF("000.000.000-00")).toBe(true);
  });

  it.todo("deve recusar sequencias de digitos repetidos");
});

describe("formatarData - o defeito de fuso", () => {
  // `new Date("2026-03-01")` e meia-noite UTC. Em UTC-3 isso e
  // 21h do dia 28/02 no horario local, e getDate() devolve 28.
  it("BUG: o dia volta um em fuso a oeste de Greenwich", () => {
    expect(formatarData("2026-03-01")).toBe("28/02/2026");
  });

  it.todo("deve devolver 01/03/2026, sem depender do fuso da maquina");
});
