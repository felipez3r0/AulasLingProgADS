import { describe, it, expect } from "vitest";
import { montarBoletim, type Aluno } from "./03-boletim.js";

const turma = (): Aluno[] => [
  { nome: "Ana", notas: [10, 9, 8] },
  { nome: "Bruno", notas: [4, 5, 3] },
  { nome: "Carla", notas: [7, 7, 7] },
];

describe("montarBoletim", () => {
  it("calcula media e conceito de cada aluno", () => {
    const boletim = montarBoletim(turma());
    const ana = boletim.find((l) => l.nome === "Ana");
    expect(ana?.media).toBe(9);
    expect(ana?.conceito).toBe("A");
    expect(ana?.aprovado).toBe(true);
  });

  it("reprova quem tem media abaixo de 5", () => {
    const bruno = montarBoletim(turma()).find((l) => l.nome === "Bruno");
    expect(bruno?.aprovado).toBe(false);
    expect(bruno?.conceito).toBe("D");
  });

  it("ordena por media, da maior para a menor", () => {
    const nomes = montarBoletim(turma()).map((l) => l.nome);
    expect(nomes).toEqual(["Ana", "Carla", "Bruno"]);
  });

  it("arredonda a media para 1 casa decimal", () => {
    const boletim = montarBoletim([{ nome: "Dani", notas: [7, 8, 8] }]);
    expect(boletim[0]?.media).toBe(7.7);
  });

  it("trata aluno sem notas", () => {
    const boletim = montarBoletim([{ nome: "Eva", notas: [] }]);
    expect(boletim[0]?.media).toBe(0);
    expect(boletim[0]?.conceito).toBe("D");
    expect(boletim[0]?.aprovado).toBe(false);
  });

  it("aceita turma vazia", () => {
    expect(montarBoletim([])).toEqual([]);
  });

  // A restricao que agentes violam com mais frequencia:
  // usar .sort() direto no array recebido reordena o array do chamador.
  it("nao modifica o array recebido", () => {
    const alunos = turma();
    montarBoletim(alunos);
    expect(alunos.map((a) => a.nome)).toEqual(["Ana", "Bruno", "Carla"]);
  });

  it("nao modifica os objetos de aluno", () => {
    const alunos = turma();
    montarBoletim(alunos);
    expect(alunos[0]).toEqual({ nome: "Ana", notas: [10, 9, 8] });
  });
});
