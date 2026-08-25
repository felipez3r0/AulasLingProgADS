import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import { createApp } from "../src/server.js";

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

describe("GET /alunos", () => {
  // Exemplo já resolvido — mostra o padrão: sobe o servidor numa porta
  // efêmera (listen(0)) e usa fetch nativo, sem lib de teste HTTP extra.
  it("retorna a lista de alunos", async () => {
    const resposta = await fetch(`${baseUrl}/alunos`);
    expect(resposta.status).toBe(200);
    const alunos = await resposta.json();
    expect(Array.isArray(alunos)).toBe(true);
    expect(alunos.length).toBeGreaterThan(0);
  });
});

describe("GET /alunos/:id", () => {
  it.todo("retorna 200 e o aluno quando o id existe");
  it.todo("retorna 404 com { erro } quando o id não existe");
});

describe("POST /alunos", () => {
  it.todo("retorna 201 e o aluno criado quando o payload é válido");
  it.todo("retorna 400 com { erro } quando falta nome ou email");
});

describe("PUT /alunos/:id", () => {
  it.todo("retorna 200 e o aluno atualizado quando o id existe");
  it.todo("retorna 404 quando o id não existe");
});

describe("DELETE /alunos/:id", () => {
  it.todo("retorna 204 quando o id existe");
  it.todo("retorna 404 quando o id não existe");
});
