import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { lerColecao, salvarColecao, inserir, buscarPorId, remover } from "./02-json-como-banco.js";

let pasta: string;
let banco: string;

beforeEach(async () => {
  pasta = await mkdtemp(join(tmpdir(), "aula10-json-"));
  banco = join(pasta, "dados", "alunos.json");
});

afterEach(async () => {
  await rm(pasta, { recursive: true, force: true });
});

describe("lerColecao", () => {
  it("arquivo inexistente devolve lista vazia", async () => {
    expect(await lerColecao(banco)).toEqual([]);
  });

  it("le o que foi salvo", async () => {
    await salvarColecao(banco, [{ id: "1", nome: "Ana", ra: "111" }]);
    expect(await lerColecao(banco)).toEqual([{ id: "1", nome: "Ana", ra: "111" }]);
  });

  it("JSON invalido rejeita, em vez de devolver lista vazia", async () => {
    await salvarColecao(banco, []);
    await writeFile(banco, "{ isto nao e json", "utf8");
    await expect(lerColecao(banco)).rejects.toThrow();
  });

  it("JSON valido mas que nao e lista rejeita", async () => {
    await salvarColecao(banco, []);
    await writeFile(banco, '{"nao":"e uma lista"}', "utf8");
    await expect(lerColecao(banco)).rejects.toThrow("formato invalido");
  });
});

describe("operacoes", () => {
  it("insere e busca", async () => {
    await inserir(banco, { id: "1", nome: "Ana", ra: "111" });
    expect(await buscarPorId(banco, "1")).toEqual({ id: "1", nome: "Ana", ra: "111" });
  });

  it("busca id inexistente devolve null", async () => {
    expect(await buscarPorId(banco, "999")).toBeNull();
  });

  it("recusa RA duplicado", async () => {
    await inserir(banco, { id: "1", nome: "Ana", ra: "111" });
    await expect(inserir(banco, { id: "2", nome: "Bruno", ra: "111" })).rejects.toThrow(
      "RA duplicado",
    );
  });

  it("remove e informa se removeu", async () => {
    await inserir(banco, { id: "1", nome: "Ana", ra: "111" });
    expect(await remover(banco, "1")).toBe(true);
    expect(await remover(banco, "1")).toBe(false);
    expect(await lerColecao(banco)).toEqual([]);
  });
});

describe("escrita atomica", () => {
  it("nao deixa arquivo temporario para tras", async () => {
    await salvarColecao(banco, [{ id: "1", nome: "Ana", ra: "111" }]);
    const { readdir } = await import("node:fs/promises");
    const arquivos = await readdir(join(pasta, "dados"));
    expect(arquivos).toEqual(["alunos.json"]);
  });
});
