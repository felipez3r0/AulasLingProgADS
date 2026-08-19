import { describe, it, expect } from "vitest";
import { buscarAluno, type Aluno } from "./01-busca-compativel.js";

const turma: Aluno[] = [
  { ra: "111", nome: "Ana" },
  { ra: "222", nome: "Bruno" },
  { ra: "333", nome: "Carla" },
];

describe("buscarAluno", () => {
  it("encontra o primeiro da lista", () => {
    expect(buscarAluno(turma, "111")).toEqual({ ra: "111", nome: "Ana" });
  });

  it("encontra o ultimo da lista", () => {
    expect(buscarAluno(turma, "333")).toEqual({ ra: "333", nome: "Carla" });
  });

  it("devolve null quando nao encontra", () => {
    expect(buscarAluno(turma, "999")).toBeNull();
  });

  it("devolve null em lista vazia", () => {
    expect(buscarAluno([], "111")).toBeNull();
  });

  it("nao devolve undefined - este e o contrato que a refatoracao quebrou", () => {
    expect(buscarAluno(turma, "999")).not.toBeUndefined();
  });

  it("compara RA como texto, sem conversao", () => {
    expect(buscarAluno(turma, "0111")).toBeNull();
  });

  it("nao modifica a lista recebida", () => {
    const copia = [...turma];
    buscarAluno(turma, "222");
    expect(turma).toEqual(copia);
  });
});
