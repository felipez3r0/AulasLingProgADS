import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtemp } from "node:fs/promises";
import {
  lerTexto,
  escreverTexto,
  acrescentarLinha,
  existe,
  listarPorExtensao,
  montarCaminho,
  nomeSemExtensao,
  apagar,
} from "./01-ler-e-escrever.js";

// Testar codigo que mexe em arquivo exige uma pasta temporaria propria.
// Sem isso, o teste suja o projeto e depende do que ficou da vez anterior.
let pasta: string;

beforeEach(async () => {
  pasta = await mkdtemp(join(tmpdir(), "aula10-"));
});

afterEach(async () => {
  await apagar(pasta);
});

describe("escrever e ler", () => {
  it("o que foi escrito e o que se le", async () => {
    const arquivo = join(pasta, "nota.txt");
    await escreverTexto(arquivo, "ola");
    expect(await lerTexto(arquivo)).toBe("ola");
  });

  it("escrever cria as pastas do caminho", async () => {
    const arquivo = join(pasta, "a", "b", "c.txt");
    await escreverTexto(arquivo, "fundo");
    expect(await lerTexto(arquivo)).toBe("fundo");
  });

  it("escrever sobrescreve", async () => {
    const arquivo = join(pasta, "nota.txt");
    await escreverTexto(arquivo, "primeiro");
    await escreverTexto(arquivo, "segundo");
    expect(await lerTexto(arquivo)).toBe("segundo");
  });

  it("acrescentar preserva o que existia", async () => {
    const arquivo = join(pasta, "log.txt");
    await acrescentarLinha(arquivo, "linha 1");
    await acrescentarLinha(arquivo, "linha 2");
    expect(await lerTexto(arquivo)).toBe("linha 1\nlinha 2\n");
  });
});

describe("existencia e erros", () => {
  it("arquivo inexistente", async () => {
    expect(await existe(join(pasta, "nao-existe.txt"))).toBe(false);
  });

  it("ler arquivo inexistente rejeita com ENOENT", async () => {
    await expect(lerTexto(join(pasta, "fantasma.txt"))).rejects.toThrow(/ENOENT/);
  });
});

describe("pastas e caminhos", () => {
  it("lista filtrando por extensao, em ordem", async () => {
    await escreverTexto(join(pasta, "b.json"), "{}");
    await escreverTexto(join(pasta, "a.json"), "{}");
    await escreverTexto(join(pasta, "c.txt"), "x");
    expect(await listarPorExtensao(pasta, ".json")).toEqual(["a.json", "b.json"]);
  });

  it("join monta o caminho com o separador do sistema", () => {
    expect(montarCaminho("dados", "alunos.json")).toContain("alunos.json");
  });

  it("nome sem extensao", () => {
    expect(nomeSemExtensao("/tmp/relatorio.json")).toBe("relatorio");
  });
});
