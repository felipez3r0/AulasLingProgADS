import { describe, it, expect } from "vitest";
import { analisarCsv, gerarCsv, type LinhaAluno } from "./02-csv.js";

describe("analisarCsv - basico", () => {
  it("le linhas simples", () => {
    expect(analisarCsv("nome,ra,nota\nAna,111,8.5\nBruno,222,7")).toEqual([
      { nome: "Ana", ra: "111", nota: 8.5 },
      { nome: "Bruno", ra: "222", nota: 7 },
    ]);
  });

  it("so cabecalho devolve lista vazia", () => {
    expect(analisarCsv("nome,ra,nota")).toEqual([]);
  });

  it("conteudo vazio devolve lista vazia", () => {
    expect(analisarCsv("")).toEqual([]);
  });

  it("ignora linhas em branco", () => {
    expect(analisarCsv("nome,ra,nota\n\nAna,111,8\n\n")).toEqual([
      { nome: "Ana", ra: "111", nota: 8 },
    ]);
  });

  it("aceita \\r\\n", () => {
    expect(analisarCsv("nome,ra,nota\r\nAna,111,8\r\n")).toEqual([
      { nome: "Ana", ra: "111", nota: 8 },
    ]);
  });
});

describe("analisarCsv - aspas", () => {
  it("virgula dentro de aspas nao separa campo", () => {
    expect(analisarCsv('nome,ra,nota\n"Silva, Ana",111,9')).toEqual([
      { nome: "Silva, Ana", ra: "111", nota: 9 },
    ]);
  });

  it("aspas duplicadas viram uma aspa", () => {
    expect(analisarCsv('nome,ra,nota\n"Ana ""A"" Silva",111,9')).toEqual([
      { nome: 'Ana "A" Silva', ra: "111", nota: 9 },
    ]);
  });
});

describe("analisarCsv - erros", () => {
  it("nota invalida aponta a linha", () => {
    expect(() => analisarCsv("nome,ra,nota\nAna,111,oito")).toThrow("nota invalida na linha 1");
  });

  it("a contagem de linha ignora o cabecalho", () => {
    expect(() => analisarCsv("nome,ra,nota\nAna,111,8\nBruno,222,x")).toThrow(
      "nota invalida na linha 2",
    );
  });

  it("quantidade errada de colunas aponta a linha", () => {
    expect(() => analisarCsv("nome,ra,nota\nAna,111")).toThrow("colunas invalidas na linha 1");
  });
});

describe("gerarCsv", () => {
  it("gera cabecalho e linhas", () => {
    const linhas: LinhaAluno[] = [{ nome: "Ana", ra: "111", nota: 8.5 }];
    expect(gerarCsv(linhas)).toBe("nome,ra,nota\nAna,111,8.5\n");
  });

  it("lista vazia devolve so o cabecalho", () => {
    expect(gerarCsv([])).toBe("nome,ra,nota\n");
  });

  it("campo com virgula sai entre aspas", () => {
    expect(gerarCsv([{ nome: "Silva, Ana", ra: "111", nota: 9 }])).toBe(
      'nome,ra,nota\n"Silva, Ana",111,9\n',
    );
  });

  it("campo com aspas sai escapado", () => {
    expect(gerarCsv([{ nome: 'Ana "A"', ra: "111", nota: 9 }])).toBe(
      'nome,ra,nota\n"Ana ""A""",111,9\n',
    );
  });
});

describe("ida e volta", () => {
  it("gerar e analisar preserva os dados", () => {
    const originais: LinhaAluno[] = [
      { nome: "Silva, Ana", ra: "111", nota: 8.5 },
      { nome: 'Bruno "B"', ra: "222", nota: 7 },
    ];
    expect(analisarCsv(gerarCsv(originais))).toEqual(originais);
  });
});
