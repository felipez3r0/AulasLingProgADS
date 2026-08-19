import { describe, it, expect } from "vitest";
import request from "supertest";
import { criarApp, type Produto } from "./01-status-corretos.js";

const iniciais: Produto[] = [
  { id: "1", nome: "Caderno", preco: 12 },
  { id: "2", nome: "Caneta", preco: 3 },
];

const api = () => request(criarApp(structuredClone(iniciais)));

describe("GET /produtos", () => {
  it("lista com 200", async () => {
    const r = await api().get("/produtos");
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(2);
  });

  it("filtra por precoMax", async () => {
    const r = await api().get("/produtos?precoMax=5");
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(1);
    expect(r.body[0].nome).toBe("Caneta");
  });

  it("precoMax invalido da 400, nao 500", async () => {
    const r = await api().get("/produtos?precoMax=caro");
    expect(r.status).toBe(400);
    expect(r.body.erro).toBe("precoMax invalido");
  });
});

describe("GET /produtos/:id", () => {
  it("200 para existente", async () => {
    expect((await api().get("/produtos/1")).status).toBe(200);
  });

  it("404 para inexistente, com mensagem", async () => {
    const r = await api().get("/produtos/999");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("produto nao encontrado");
  });
});

describe("POST /produtos", () => {
  it("201 com Location", async () => {
    const r = await api().post("/produtos").send({ nome: "Borracha", preco: 2 });
    expect(r.status).toBe(201);
    expect(r.headers["location"]).toBe("/produtos/3");
    expect(r.body).toMatchObject({ id: "3", nome: "Borracha", preco: 2 });
  });

  it("corpo vazio da 400", async () => {
    const r = await api().post("/produtos").send({});
    expect(r.status).toBe(400);
    expect(r.body.erro).toBe("dados invalidos");
  });

  it("nome vazio da 400", async () => {
    expect((await api().post("/produtos").send({ nome: "", preco: 5 })).status).toBe(400);
  });

  it("preco nao numerico da 400", async () => {
    expect((await api().post("/produtos").send({ nome: "X", preco: "caro" })).status).toBe(400);
  });

  it("preco negativo da 400", async () => {
    expect((await api().post("/produtos").send({ nome: "X", preco: -1 })).status).toBe(400);
  });

  it("preco zero e valido", async () => {
    expect((await api().post("/produtos").send({ nome: "Brinde", preco: 0 })).status).toBe(201);
  });

  it("nome duplicado da 409", async () => {
    const r = await api().post("/produtos").send({ nome: "caderno", preco: 15 });
    expect(r.status).toBe(409);
    expect(r.body.erro).toBe("produto ja existe");
  });

  it("o criado aparece na listagem", async () => {
    const app = criarApp(structuredClone(iniciais));
    await request(app).post("/produtos").send({ nome: "Regua", preco: 4 });
    expect((await request(app).get("/produtos")).body).toHaveLength(3);
  });
});

describe("PUT /produtos/:id", () => {
  it("200 e atualiza", async () => {
    const r = await api().put("/produtos/1").send({ preco: 20 });
    expect(r.status).toBe(200);
    expect(r.body.preco).toBe(20);
  });

  it("404 para inexistente, nao 500", async () => {
    expect((await api().put("/produtos/999").send({ preco: 20 })).status).toBe(404);
  });

  it("preco invalido da 400, nao 500", async () => {
    const r = await api().put("/produtos/1").send({ preco: "caro" });
    expect(r.status).toBe(400);
    expect(r.body.erro).toBe("dados invalidos");
  });

  it("preco ausente da 400", async () => {
    expect((await api().put("/produtos/1").send({})).status).toBe(400);
  });
});

describe("DELETE /produtos/:id", () => {
  it("204 sem corpo", async () => {
    const app = criarApp(structuredClone(iniciais));
    const r = await request(app).delete("/produtos/1");
    expect(r.status).toBe(204);
    expect(r.body).toEqual({});
    expect((await request(app).get("/produtos")).body).toHaveLength(1);
  });

  it("404 para inexistente", async () => {
    expect((await api().delete("/produtos/999")).status).toBe(404);
  });
});

describe("rota inexistente", () => {
  it("404 com mensagem propria", async () => {
    const r = await api().get("/nao-existe");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("rota nao encontrada");
  });
});
