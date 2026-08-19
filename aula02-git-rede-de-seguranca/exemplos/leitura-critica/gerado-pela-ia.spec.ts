import { describe, it, expect } from "vitest";
import { buscarAluno, type Aluno } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA a mudanca de comportamento. Por isso ele passa.
// Corrigir e o exercicio 1 da aula.

const turma: Aluno[] = [
  { ra: "111", nome: "Ana" },
  { ra: "222", nome: "Bruno" },
];

describe("buscarAluno - o que continuou igual", () => {
  it("encontra o aluno pelo RA", () => {
    expect(buscarAluno(turma, "222")).toEqual({ ra: "222", nome: "Bruno" });
  });
});

describe("buscarAluno - a mudanca que o diff nao anunciava", () => {
  // A versao antiga devolvia `null`. A nova devolve `undefined`.
  // Sao valores diferentes, e todo codigo que fazia `if (resultado === null)`
  // parou de funcionar - em silencio, sem erro de compilacao no chamador
  // que usava `== null`, e com erro de tipo no que usava `=== null`.
  it("BUG: nao encontrado devolve undefined, nao null", () => {
    expect(buscarAluno(turma, "999")).toBeUndefined();
    expect(buscarAluno(turma, "999")).not.toBeNull();
  });

  it("BUG: quem comparava com null passa a nunca entrar no ramo", () => {
    const resultado = buscarAluno(turma, "999");
    const ramoAntigoFoiExecutado = (resultado as unknown) === null;
    expect(ramoAntigoFoiExecutado).toBe(false);
  });

  // Depois de corrigido (exercicio 1), o comportamento esperado e este:
  it.todo("nao encontrado deve devolver null, como a versao original");
});
