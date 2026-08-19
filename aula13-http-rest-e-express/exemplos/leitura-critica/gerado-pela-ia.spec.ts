import { describe, it, expect } from "vitest";
import request from "supertest";
import { criarApp, type Produto } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA os defeitos. Por isso ele passa.
// Corrigir e o exercicio 1 da aula.

const iniciais: Produto[] = [{ id: "1", nome: "Caderno", preco: 12 }];
const api = () => request(criarApp(structuredClone(iniciais)));

describe("as rotas respondem", () => {
  it("busca um produto existente", async () => {
    const r = await api().get("/produtos/1");
    expect(r.status).toBe(200);
    expect(r.body.nome).toBe("Caderno");
  });
});

describe("BUG 1: 200 para recurso inexistente", () => {
  it("id que nao existe devolve 200 com null", async () => {
    const r = await api().get("/produtos/999");
    expect(r.status).toBe(200);
    expect(r.body).toBeNull();
  });

  it("o cliente nao consegue distinguir 'nao existe' de 'existe e e nulo'", async () => {
    const existente = await api().get("/produtos/1");
    const inexistente = await api().get("/produtos/999");
    expect(existente.status).toBe(inexistente.status); // ambos 200
  });
});

describe("BUG 2: 200 na criacao, sem Location", () => {
  it("POST devolve 200 em vez de 201", async () => {
    const r = await api().post("/produtos").send({ nome: "Caneta", preco: 3 });
    expect(r.status).toBe(200);
    expect(r.headers["location"]).toBeUndefined();
  });

  it("e aceita corpo vazio, criando produto com nome vazio e preco zero", async () => {
    const r = await api().post("/produtos").send({});
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ nome: "", preco: 0 });
  });
});

describe("BUG 3: 500 para erro do cliente", () => {
  it("dado invalido devolve 500, culpando o servidor", async () => {
    const r = await api().put("/produtos/1").send({ preco: "caro" });
    expect(r.status).toBe(500);
  });

  it("recurso inexistente tambem devolve 500", async () => {
    const r = await api().put("/produtos/999").send({ preco: 10 });
    expect(r.status).toBe(500);
  });

  // Por que isso importa: um cliente bem escrito TENTA DE NOVO em 5xx,
  // porque 5xx significa "problema meu, tente mais tarde". Com 500 aqui,
  // o cliente vai repetir para sempre uma requisicao que nunca vai funcionar.
  it.todo("400 para dado invalido, 404 para inexistente, 201 na criacao");
});
