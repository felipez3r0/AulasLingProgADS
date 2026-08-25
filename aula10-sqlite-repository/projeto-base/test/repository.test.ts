import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { unlink } from "node:fs/promises";
import type { Client } from "@libsql/client";
import { criarClienteDb } from "../src/db.js";
import { listarTodos } from "../src/repository.js";
// Descomente conforme for escrevendo os próximos testes:
// import { buscarPorId, criar, remover } from "../src/repository.js";
import { SCHEMA_SQL } from "../src/schema.js";

const ARQUIVO_TESTE = "test/teste.db";
let db: Client;

beforeEach(async () => {
  db = criarClienteDb(`file:${ARQUIVO_TESTE}`);
  await db.execute(SCHEMA_SQL);
});

afterEach(async () => {
  db.close();
  await unlink(ARQUIVO_TESTE).catch(() => {});
});

describe("listarTodos", () => {
  it("retorna array vazio quando não há alunos", async () => {
    const alunos = await listarTodos(db);
    expect(alunos).toEqual([]);
  });
});

describe("criar", () => {
  it.todo("insere um aluno e retorna com id gerado");
  it.todo("usa parâmetros (?), nunca concatena string diretamente na query SQL");
});

describe("buscarPorId", () => {
  it.todo("retorna o aluno quando o id existe");
  it.todo("retorna null quando o id não existe");
});

describe("remover", () => {
  it.todo("retorna true e remove quando o id existe");
  it.todo("retorna false quando o id não existe");
});
