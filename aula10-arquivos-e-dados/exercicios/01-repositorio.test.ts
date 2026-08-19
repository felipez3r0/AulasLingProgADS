import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtemp, rm, writeFile, readdir, mkdir } from "node:fs/promises";
import { lerAlunos, salvarAlunos, inserirAluno, type Aluno } from "./01-repositorio.js";

let pasta: string;
let banco: string;

beforeEach(async () => {
  pasta = await mkdtemp(join(tmpdir(), "ex-aula10-"));
  banco = join(pasta, "dados", "alunos.json");
});

afterEach(async () => {
  await rm(pasta, { recursive: true, force: true });
});

const ana: Aluno = { id: "1", nome: "Ana", ra: "111" };
const bruno: Aluno = { id: "2", nome: "Bruno", ra: "222" };

describe("lerAlunos", () => {
  it("arquivo inexistente devolve lista vazia", async () => {
    expect(await lerAlunos(banco)).toEqual([]);
  });

  it("le o que foi salvo", async () => {
    await salvarAlunos(banco, [ana]);
    expect(await lerAlunos(banco)).toEqual([ana]);
  });

  it("JSON corrompido REJEITA em vez de devolver vazio", async () => {
    await mkdir(join(pasta, "dados"), { recursive: true });
    await writeFile(banco, "{ isto nao e json", "utf8");
    await expect(lerAlunos(banco)).rejects.toThrow("arquivo corrompido");
  });

  it("JSON que nao e lista REJEITA", async () => {
    await mkdir(join(pasta, "dados"), { recursive: true });
    await writeFile(banco, '{"nao":"e lista"}', "utf8");
    await expect(lerAlunos(banco)).rejects.toThrow("formato invalido");
  });
});

describe("salvarAlunos", () => {
  it("cria as pastas do caminho", async () => {
    const fundo = join(pasta, "a", "b", "c", "alunos.json");
    await salvarAlunos(fundo, [ana]);
    expect(await lerAlunos(fundo)).toEqual([ana]);
  });

  it("sobrescreve a colecao inteira", async () => {
    await salvarAlunos(banco, [ana, bruno]);
    await salvarAlunos(banco, [ana]);
    expect(await lerAlunos(banco)).toEqual([ana]);
  });

  it("grava com indentacao de 2 espacos", async () => {
    await salvarAlunos(banco, [ana]);
    const { readFile } = await import("node:fs/promises");
    expect(await readFile(banco, "utf8")).toContain('\n  {\n    "id"');
  });

  it("nao deixa arquivo temporario para tras", async () => {
    await salvarAlunos(banco, [ana]);
    expect(await readdir(join(pasta, "dados"))).toEqual(["alunos.json"]);
  });

  it("lista vazia tambem e salva", async () => {
    await salvarAlunos(banco, []);
    expect(await lerAlunos(banco)).toEqual([]);
  });
});

describe("inserirAluno", () => {
  it("insere no arquivo vazio", async () => {
    expect(await inserirAluno(banco, ana)).toEqual(ana);
    expect(await lerAlunos(banco)).toEqual([ana]);
  });

  it("preserva os anteriores", async () => {
    await inserirAluno(banco, ana);
    await inserirAluno(banco, bruno);
    expect(await lerAlunos(banco)).toEqual([ana, bruno]);
  });

  it("recusa RA duplicado", async () => {
    await inserirAluno(banco, ana);
    await expect(inserirAluno(banco, { id: "9", nome: "Outra", ra: "111" })).rejects.toThrow(
      "RA duplicado: 111",
    );
  });

  it("apos recusar, a colecao continua intacta", async () => {
    await inserirAluno(banco, ana);
    await expect(inserirAluno(banco, { id: "9", nome: "X", ra: "111" })).rejects.toThrow();
    expect(await lerAlunos(banco)).toEqual([ana]);
  });
});
