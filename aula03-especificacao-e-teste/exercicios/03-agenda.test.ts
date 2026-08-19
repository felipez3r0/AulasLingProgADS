import { describe, it, expect } from "vitest";
import { encontrarConflitos, type Compromisso } from "./03-agenda.js";

const agenda = (): Compromisso[] => [
  { titulo: "Aula", inicio: 8, fim: 10 },
  { titulo: "Reuniao", inicio: 9, fim: 11 },
  { titulo: "Almoco", inicio: 12, fim: 13 },
];

describe("encontrarConflitos", () => {
  it("detecta sobreposicao simples", () => {
    expect(encontrarConflitos(agenda())).toEqual([["Aula", "Reuniao"]]);
  });

  it("encostar nao e conflito", () => {
    const grudados: Compromisso[] = [
      { titulo: "A", inicio: 8, fim: 10 },
      { titulo: "B", inicio: 10, fim: 12 },
    ];
    expect(encontrarConflitos(grudados)).toEqual([]);
  });

  it("um compromisso dentro do outro e conflito", () => {
    const dentro: Compromisso[] = [
      { titulo: "Longo", inicio: 8, fim: 18 },
      { titulo: "Curto", inicio: 10, fim: 11 },
    ];
    expect(encontrarConflitos(dentro)).toEqual([["Curto", "Longo"]]);
  });

  it("ordena os titulos dentro do par", () => {
    const invertido: Compromisso[] = [
      { titulo: "Zulu", inicio: 8, fim: 12 },
      { titulo: "Alfa", inicio: 9, fim: 11 },
    ];
    expect(encontrarConflitos(invertido)).toEqual([["Alfa", "Zulu"]]);
  });

  it("cada par aparece uma vez so", () => {
    expect(encontrarConflitos(agenda())).toHaveLength(1);
  });

  it("ordena os pares pelo primeiro titulo", () => {
    const varios: Compromisso[] = [
      { titulo: "Zulu", inicio: 8, fim: 12 },
      { titulo: "Yankee", inicio: 9, fim: 13 },
      { titulo: "Alfa", inicio: 10, fim: 14 },
    ];
    expect(encontrarConflitos(varios)).toEqual([
      ["Alfa", "Yankee"],
      ["Alfa", "Zulu"],
      ["Yankee", "Zulu"],
    ]);
  });

  it("agenda vazia devolve lista vazia", () => {
    expect(encontrarConflitos([])).toEqual([]);
  });

  it("um compromisso so devolve lista vazia", () => {
    expect(encontrarConflitos([{ titulo: "Unico", inicio: 8, fim: 9 }])).toEqual([]);
  });

  it("horario invalido lanca erro", () => {
    expect(() => encontrarConflitos([{ titulo: "X", inicio: 10, fim: 10 }])).toThrow(
      "horario invalido",
    );
    expect(() => encontrarConflitos([{ titulo: "X", inicio: 10, fim: 8 }])).toThrow(
      "horario invalido",
    );
  });

  it("nao modifica o array recebido", () => {
    const itens = agenda();
    encontrarConflitos(itens);
    expect(itens.map((c) => c.titulo)).toEqual(["Aula", "Reuniao", "Almoco"]);
  });
});
