import { describe, it, expect } from "vitest";
import request from "supertest";
import { criarApp, alunosDeExemplo, descreverInicializacao } from "./01-api-rest.js";

// `supertest` faz a requisicao direto na app, sem abrir porta.
const api = () => request(criarApp(structuredClone(alunosDeExemplo)));

describe("GET /alunos", () => {
  it("lista todos com status 200", async () => {
    const r = await api().get("/alunos");
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(2);
  });

  it("responde JSON", async () => {
    const r = await api().get("/alunos");
    expect(r.headers["content-type"]).toMatch(/json/);
  });

  it("filtra por curso via query param", async () => {
    const r = await api().get("/alunos?curso=ADS");
    expect(r.body).toHaveLength(1);
    expect(r.body[0].nome).toBe("Ana Silva");
  });

  it("o filtro ignora maiusculas", async () => {
    expect((await api().get("/alunos?curso=ads")).body).toHaveLength(1);
  });

  it("curso sem resultado devolve lista vazia, nao 404", async () => {
    const r = await api().get("/alunos?curso=Inexistente");
    expect(r.status).toBe(200);
    expect(r.body).toEqual([]);
  });
});

describe("GET /alunos/:id", () => {
  it("devolve o aluno", async () => {
    const r = await api().get("/alunos/1");
    expect(r.status).toBe(200);
    expect(r.body.nome).toBe("Ana Silva");
  });

  it("id inexistente da 404", async () => {
    const r = await api().get("/alunos/999");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("aluno nao encontrado");
  });
});

describe("POST /alunos", () => {
  it("cria e devolve 201 com Location", async () => {
    const r = await api()
      .post("/alunos")
      .send({ nome: "Carla", ra: "333", curso: "ADS" });
    expect(r.status).toBe(201);
    expect(r.headers["location"]).toBe("/alunos/3");
    expect(r.body.id).toBe("3");
  });

  it("campo faltando da 400", async () => {
    const r = await api().post("/alunos").send({ nome: "Sem RA" });
    expect(r.status).toBe(400);
  });

  it("RA duplicado da 409, nao 400", async () => {
    const r = await api()
      .post("/alunos")
      .send({ nome: "Outra", ra: "111", curso: "ADS" });
    expect(r.status).toBe(409);
  });

  it("o aluno criado aparece na listagem", async () => {
    const app = criarApp(structuredClone(alunosDeExemplo));
    await request(app).post("/alunos").send({ nome: "Dani", ra: "444", curso: "ADS" });
    expect((await request(app).get("/alunos")).body).toHaveLength(3);
  });
});

describe("DELETE /alunos/:id", () => {
  it("remove e devolve 204 sem corpo", async () => {
    const app = criarApp(structuredClone(alunosDeExemplo));
    const r = await request(app).delete("/alunos/1");
    expect(r.status).toBe(204);
    expect(r.body).toEqual({});
    expect((await request(app).get("/alunos")).body).toHaveLength(1);
  });

  it("id inexistente da 404", async () => {
    expect((await api().delete("/alunos/999")).status).toBe(404);
  });
});

describe("rota inexistente", () => {
  it("da 404 com mensagem propria", async () => {
    const r = await api().get("/nao-existe");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("rota nao encontrada");
  });
});

describe("inicializacao", () => {
  it("a app nao abre porta sozinha", () => {
    expect(descreverInicializacao(3000)).toContain("3000");
  });
});
