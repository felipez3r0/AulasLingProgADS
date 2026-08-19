import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtemp, rm, writeFile, mkdir, readFile, readdir } from "node:fs/promises";
import { importarPasta } from "./03-importador.js";

let raiz: string;
let entrada: string;
let saida: string;

beforeEach(async () => {
  raiz = await mkdtemp(join(tmpdir(), "ex-import-"));
  entrada = join(raiz, "entrada");
  saida = join(raiz, "saida", "consolidado.json");
  await mkdir(entrada, { recursive: true });
});

afterEach(async () => {
  await rm(raiz, { recursive: true, force: true });
});

const csv = (nome: string, conteudo: string): Promise<void> =>
  writeFile(join(entrada, nome), conteudo, "utf8");

const lerSaida = async (): Promise<unknown> => JSON.parse(await readFile(saida, "utf8"));

describe("importarPasta - caminho feliz", () => {
  it("importa um arquivo", async () => {
    await csv("turma-a.csv", "nome,ra,nota\nAna,111,8\nBruno,222,7");
    const r = await importarPasta(entrada, saida);
    expect(r.importados).toBe(2);
    expect(r.ignorados).toBe(0);
    expect(r.problemas).toEqual([]);
    expect(r.arquivoGerado).toBe(saida);
  });

  it("consolida varios arquivos", async () => {
    await csv("turma-a.csv", "nome,ra,nota\nAna,111,8");
    await csv("turma-b.csv", "nome,ra,nota\nBruno,222,7");
    expect((await importarPasta(entrada, saida)).importados).toBe(2);
  });

  it("grava ordenado por RA", async () => {
    await csv("turma-a.csv", "nome,ra,nota\nZeca,333,5\nAna,111,8");
    await importarPasta(entrada, saida);
    expect(await lerSaida()).toEqual([
      { nome: "Ana", ra: "111", nota: 8 },
      { nome: "Zeca", ra: "333", nota: 5 },
    ]);
  });

  it("ignora arquivos que nao sao .csv", async () => {
    await csv("turma-a.csv", "nome,ra,nota\nAna,111,8");
    await writeFile(join(entrada, "leiame.txt"), "nao sou csv", "utf8");
    expect((await importarPasta(entrada, saida)).importados).toBe(1);
  });

  it("grava com indentacao de 2 espacos", async () => {
    await csv("t.csv", "nome,ra,nota\nAna,111,8");
    await importarPasta(entrada, saida);
    expect(await readFile(saida, "utf8")).toContain('\n  {\n    "nome"');
  });
});

describe("importarPasta - linhas problematicas", () => {
  it("nota invalida e ignorada e registrada", async () => {
    await csv("t.csv", "nome,ra,nota\nAna,111,oito\nBruno,222,7");
    const r = await importarPasta(entrada, saida);
    expect(r.importados).toBe(1);
    expect(r.ignorados).toBe(1);
    expect(r.problemas).toEqual(["t.csv:1 nota invalida"]);
  });

  it("colunas invalidas sao ignoradas e registradas", async () => {
    await csv("t.csv", "nome,ra,nota\nAna,111\nBruno,222,7");
    const r = await importarPasta(entrada, saida);
    expect(r.problemas).toEqual(["t.csv:1 colunas invalidas"]);
  });

  it("RA duplicado e ignorado; vale o primeiro", async () => {
    await csv("a.csv", "nome,ra,nota\nAna,111,8");
    await csv("b.csv", "nome,ra,nota\nOutra,111,3");
    const r = await importarPasta(entrada, saida);
    expect(r.importados).toBe(1);
    expect(r.problemas).toEqual(["b.csv:1 RA duplicado"]);
    expect(await lerSaida()).toEqual([{ nome: "Ana", ra: "111", nota: 8 }]);
  });

  it("a numeracao de linha ignora o cabecalho", async () => {
    await csv("t.csv", "nome,ra,nota\nAna,111,8\nBruno,222,x");
    expect((await importarPasta(entrada, saida)).problemas).toEqual(["t.csv:2 nota invalida"]);
  });
});

describe("importarPasta - bordas e seguranca", () => {
  it("pasta sem csv gera lista vazia", async () => {
    const r = await importarPasta(entrada, saida);
    expect(r.importados).toBe(0);
    expect(await lerSaida()).toEqual([]);
  });

  it("pasta inexistente rejeita", async () => {
    await expect(importarPasta(join(raiz, "nao-existe"), saida)).rejects.toThrow(
      "pasta nao encontrada",
    );
  });

  it("nao deixa arquivo temporario para tras", async () => {
    await csv("t.csv", "nome,ra,nota\nAna,111,8");
    await importarPasta(entrada, saida);
    expect(await readdir(join(raiz, "saida"))).toEqual(["consolidado.json"]);
  });

  it("nao altera os arquivos de entrada", async () => {
    await csv("t.csv", "nome,ra,nota\nAna,111,8");
    await importarPasta(entrada, saida);
    expect(await readFile(join(entrada, "t.csv"), "utf8")).toBe("nome,ra,nota\nAna,111,8");
  });
});
