import { describe, it, expect } from "vitest";
import { descrever, tempoEmMinutos, resumir, type ItemCatalogo } from "./02-catalogo.js";

const catalogo = (): ItemCatalogo[] => [
  { tipo: "livro", titulo: "Refatoracao", autor: "Fowler", paginas: 400 },
  { tipo: "filme", titulo: "Arrival", diretor: "Villeneuve", minutos: 116 },
  { tipo: "curso", titulo: "Ban de TypeScript", instrutor: "Ana", horas: 10 },
];

describe("descrever", () => {
  it("livro", () => {
    expect(descrever(catalogo()[0]!)).toBe("Refatoracao, de Fowler (400 paginas)");
  });

  it("filme", () => {
    expect(descrever(catalogo()[1]!)).toBe("Arrival, dirigido por Villeneuve (116 min)");
  });

  it("curso", () => {
    expect(descrever(catalogo()[2]!)).toBe("Ban de TypeScript, com Ana (10h)");
  });
});

describe("tempoEmMinutos", () => {
  it("livro: 2 minutos por pagina", () => {
    expect(tempoEmMinutos(catalogo()[0]!)).toBe(800);
  });

  it("filme: os proprios minutos", () => {
    expect(tempoEmMinutos(catalogo()[1]!)).toBe(116);
  });

  it("curso: 60 minutos por hora", () => {
    expect(tempoEmMinutos(catalogo()[2]!)).toBe(600);
  });
});

describe("resumir", () => {
  it("conta os itens", () => {
    expect(resumir(catalogo()).totalItens).toBe(3);
  });

  it("conta por tipo", () => {
    expect(resumir(catalogo()).porTipo).toEqual({ livro: 1, filme: 1, curso: 1 });
  });

  it("tipo ausente conta zero", () => {
    const so2: ItemCatalogo[] = [
      { tipo: "livro", titulo: "A", autor: "X", paginas: 100 },
      { tipo: "livro", titulo: "B", autor: "Y", paginas: 50 },
    ];
    expect(resumir(so2).porTipo).toEqual({ livro: 2, filme: 0, curso: 0 });
  });

  it("soma o tempo total", () => {
    expect(resumir(catalogo()).tempoTotalMinutos).toBe(1516);
  });

  it("ordena os titulos alfabeticamente", () => {
    expect(resumir(catalogo()).titulosOrdenados).toEqual([
      "Arrival",
      "Ban de TypeScript",
      "Refatoracao",
    ]);
  });

  it("catalogo vazio", () => {
    expect(resumir([])).toEqual({
      totalItens: 0,
      porTipo: { livro: 0, filme: 0, curso: 0 },
      tempoTotalMinutos: 0,
      titulosOrdenados: [],
    });
  });

  it("nao modifica o array recebido", () => {
    const c = catalogo();
    resumir(c);
    expect(c.map((i) => i.titulo)).toEqual(["Refatoracao", "Arrival", "Ban de TypeScript"]);
  });
});
