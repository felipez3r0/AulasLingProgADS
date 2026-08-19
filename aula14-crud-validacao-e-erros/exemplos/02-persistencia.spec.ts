import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtemp, rm, writeFile, mkdir, readdir } from "node:fs/promises";
import { criarRepositorio, carregar, salvar } from "./02-persistencia.js";
import type { Tarefa } from "./api/esquemas.js";

let pasta: string;
let banco: string;

beforeEach(async () => {
  pasta = await mkdtemp(join(tmpdir(), "aula14-"));
  banco = join(pasta, "dados", "tarefas.json");
});

afterEach(async () => {
  await rm(pasta, { recursive: true, force: true });
});

const tarefa = (id: string): Tarefa => ({
  id,
  titulo: `Tarefa ${id}`,
  prioridade: "media",
  responsavel: "ana",
  concluida: false,
});

describe("carregar", () => {
  it("arquivo ausente devolve lista vazia", async () => {
    expect(await carregar(banco)).toEqual([]);
  });

  it("le o que foi salvo", async () => {
    await salvar(banco, [tarefa("1")]);
    expect(await carregar(banco)).toEqual([tarefa("1")]);
  });

  it("arquivo corrompido REJEITA, em vez de apagar tudo", async () => {
    await mkdir(join(pasta, "dados"), { recursive: true });
    await writeFile(banco, "{ nao e json", "utf8");
    await expect(carregar(banco)).rejects.toThrow("corrompido");
  });
});

describe("salvar", () => {
  it("escrita atomica nao deixa temporario", async () => {
    await salvar(banco, [tarefa("1")]);
    expect(await readdir(join(pasta, "dados"))).toEqual(["tarefas.json"]);
  });
});

describe("repositorio", () => {
  it("insere e lista", async () => {
    const repo = criarRepositorio(banco);
    await repo.inserir(tarefa("1"));
    await repo.inserir(tarefa("2"));
    expect(await repo.listar()).toHaveLength(2);
  });

  it("remove e informa se removeu", async () => {
    const repo = criarRepositorio(banco);
    await repo.inserir(tarefa("1"));
    expect(await repo.remover("1")).toBe(true);
    expect(await repo.remover("1")).toBe(false);
    expect(await repo.listar()).toEqual([]);
  });

  it("os dados sobrevivem a um novo repositorio no mesmo arquivo", async () => {
    await criarRepositorio(banco).inserir(tarefa("1"));
    expect(await criarRepositorio(banco).listar()).toHaveLength(1);
  });
});
