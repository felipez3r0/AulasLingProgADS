import { describe, it, expect } from "vitest";
import { saudacao, versaoDoNode } from "./01-primeiro-programa.js";

describe("saudacao", () => {
  it("inclui o nome recebido", () => {
    expect(saudacao("Ana")).toBe("Ola, Ana! Bem-vindo a disciplina.");
  });

  // Um teste so vale alguma coisa se ele consegue FALHAR.
  // Este falharia se alguem trocasse o template por um texto fixo.
  it("muda quando o nome muda", () => {
    expect(saudacao("Bruno")).not.toBe(saudacao("Ana"));
  });
});

describe("versaoDoNode", () => {
  it("roda em Node 20 ou superior", () => {
    const maior = Number(versaoDoNode().replace("v", "").split(".")[0]);
    expect(maior).toBeGreaterThanOrEqual(20);
  });
});
