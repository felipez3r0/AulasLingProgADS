import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import { createApp } from "../src/app.js";

let server: Server;
let baseUrl: string;

beforeAll(() => {
  return new Promise<void>((resolve) => {
    server = createApp().listen(0, () => {
      const { port } = server.address() as { port: number };
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

afterAll(() => {
  return new Promise<void>((resolve) => server.close(() => resolve()));
});

describe("validação (POST /produtos)", () => {
  it("retorna 400 quando falta o nome", async () => {
    const resposta = await fetch(`${baseUrl}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preco: 10 }),
    });
    expect(resposta.status).toBe(400);
  });

  it("retorna 201 quando o payload é válido", async () => {
    const resposta = await fetch(`${baseUrl}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Teclado", preco: 150 }),
    });
    expect(resposta.status).toBe(201);
  });
});

describe("erro tratado (GET /produtos/:id)", () => {
  it("retorna 404 em JSON, com corpo { erro }, quando o id não existe", async () => {
    const resposta = await fetch(`${baseUrl}/produtos/9999`);
    expect(resposta.status).toBe(404);
    expect(resposta.headers.get("content-type")).toContain("application/json");
    const corpo = await resposta.json();
    expect(corpo.erro).toBeDefined();
  });
});
