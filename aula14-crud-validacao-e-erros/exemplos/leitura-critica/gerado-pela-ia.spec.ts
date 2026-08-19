import { describe, it, expect } from "vitest";
import request from "supertest";
import { criarApp, type Usuario } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA os defeitos. Por isso ele passa.
// Corrigir e o exercicio 1 da aula.

const iniciais: Usuario[] = [
  {
    id: "1",
    email: "ana@fatec.br",
    senhaHash: "$2b$10$abcdefghijklmnopqrstuv",
    cpf: "529.982.247-25",
    admin: false,
  },
];

const api = () => request(criarApp(structuredClone(iniciais)));

describe("BUG 1: vazamento de dados sensiveis", () => {
  it("GET devolve o hash da senha para qualquer um", async () => {
    const r = await api().get("/usuarios/1");
    expect(r.status).toBe(200);
    expect(r.body.senhaHash).toBe("$2b$10$abcdefghijklmnopqrstuv");
  });

  it("e o CPF junto", async () => {
    expect((await api().get("/usuarios/1")).body.cpf).toBe("529.982.247-25");
  });
});

describe("BUG 2: mass assignment", () => {
  // O spread do corpo vem DEPOIS dos valores padrao, entao qualquer
  // campo enviado pelo cliente sobrescreve o que o servidor definiu.
  it("o cliente consegue se tornar admin", async () => {
    const r = await api().post("/usuarios").send({ email: "x@f.br", admin: true });
    expect(r.body.admin).toBe(true);
  });

  it("e consegue escolher o proprio id", async () => {
    const r = await api().post("/usuarios").send({ email: "x@f.br", id: "999" });
    expect(r.body.id).toBe("999");
  });

  it("e ate injetar campos que nao existem no modelo", async () => {
    const r = await api().post("/usuarios").send({ email: "x@f.br", saldo: 1000000 });
    expect(r.body.saldo).toBe(1000000);
  });
});

describe("BUG 3: erro interno exposto e status errado", () => {
  it("recurso inexistente devolve 500, nao 404", async () => {
    expect((await api().get("/usuarios/999")).status).toBe(500);
  });

  it("e devolve o stack trace do servidor ao cliente", async () => {
    const r = await api().get("/usuarios/999");
    expect(typeof r.body.stack).toBe("string");
    expect(r.body.stack).toContain("gerado-pela-ia");
  });

  it.todo("nao expor senhaHash nem cpf");
  it.todo("aceitar apenas os campos previstos no esquema");
  it.todo("404 para inexistente, e mensagem generica no 500");
});
