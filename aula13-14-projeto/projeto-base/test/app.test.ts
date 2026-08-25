import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { unlink } from "node:fs/promises";
import type { Client } from "@libsql/client";
import { createApp } from "../src/app.js";
import { criarClienteDb } from "../src/db.js";
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

describe("POST /itens + GET /itens", () => {
  it("cria um item e depois o encontra na listagem", async () => {
    const app = createApp(db);
    const server = app.listen(0);
    const { port } = server.address() as { port: number };
    const baseUrl = `http://localhost:${port}`;

    const criado = await fetch(`${baseUrl}/itens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Exemplo" }),
    });
    expect(criado.status).toBe(201);

    const lista = await fetch(`${baseUrl}/itens`);
    const itens = await lista.json();
    expect(itens.some((i: { nome: string }) => i.nome === "Exemplo")).toBe(true);

    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});

describe("GET /itens/:id inexistente", () => {
  it.todo("retorna 404 com { erro }");
});

// TODO do grupo: testes de PUT, filtros, regras de negócio do tema.
