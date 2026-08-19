import { describe, it, expect } from "vitest";
import request from "supertest";
import { criarApp, type Usuario } from "./01-api-segura.js";

const iniciais: Usuario[] = [
  { id: "1", email: "ana@fatec.br", senhaHash: "hash:segredo123", cpf: "529.982.247-25", admin: true },
  { id: "2", email: "bruno@fatec.br", senhaHash: "hash:outro123", cpf: "111.444.777-35", admin: false },
];

const api = () => request(criarApp(structuredClone(iniciais)));

describe("nao vaza dados sensiveis", () => {
  it("GET lista sem senhaHash nem cpf", async () => {
    const r = await api().get("/usuarios");
    expect(r.status).toBe(200);
    for (const u of r.body) {
      expect(u.senhaHash).toBeUndefined();
      expect(u.cpf).toBeUndefined();
    }
  });

  it("GET por id tambem nao vaza", async () => {
    const r = await api().get("/usuarios/1");
    expect(r.body).toEqual({ id: "1", email: "ana@fatec.br", admin: true });
  });

  it("POST nao devolve senhaHash", async () => {
    const r = await api().post("/usuarios").send({ email: "novo@f.br", senha: "senhaforte1" });
    expect(r.body.senhaHash).toBeUndefined();
    expect(r.body.cpf).toBeUndefined();
  });
});

describe("nao aceita campos que o cliente nao deveria escolher", () => {
  it("admin enviado pelo cliente e ignorado", async () => {
    const r = await api()
      .post("/usuarios")
      .send({ email: "novo@f.br", senha: "senhaforte1", admin: true });
    expect(r.status).toBe(201);
    expect(r.body.admin).toBe(false);
  });

  it("id enviado pelo cliente e ignorado", async () => {
    const r = await api()
      .post("/usuarios")
      .send({ email: "novo@f.br", senha: "senhaforte1", id: "999" });
    expect(r.body.id).toBe("3");
  });

  it("campo desconhecido e ignorado, sem erro", async () => {
    const r = await api()
      .post("/usuarios")
      .send({ email: "novo@f.br", senha: "senhaforte1", saldo: 1000000 });
    expect(r.status).toBe(201);
    expect(r.body.saldo).toBeUndefined();
  });

  it("cpf enviado pelo cliente nao aparece na resposta", async () => {
    const r = await api()
      .post("/usuarios")
      .send({ email: "novo@f.br", senha: "senhaforte1", cpf: "000.000.000-00" });
    expect(r.body.cpf).toBeUndefined();
  });
});

describe("validacao", () => {
  it("email ausente da 400", async () => {
    expect((await api().post("/usuarios").send({ senha: "senhaforte1" })).status).toBe(400);
  });

  it("email sem arroba da 400", async () => {
    const r = await api().post("/usuarios").send({ email: "semarroba", senha: "senhaforte1" });
    expect(r.status).toBe(400);
    expect(r.body.erro).toBe("dados invalidos");
  });

  it("senha curta da 400", async () => {
    expect((await api().post("/usuarios").send({ email: "a@b.br", senha: "1234567" })).status).toBe(
      400,
    );
  });

  it("senha de exatamente 8 caracteres passa", async () => {
    expect((await api().post("/usuarios").send({ email: "a@b.br", senha: "12345678" })).status).toBe(
      201,
    );
  });

  it("email duplicado da 409, ignorando maiusculas", async () => {
    const r = await api().post("/usuarios").send({ email: "ANA@FATEC.BR", senha: "senhaforte1" });
    expect(r.status).toBe(409);
    expect(r.body.erro).toBe("email ja cadastrado");
  });
});

describe("criacao bem sucedida", () => {
  it("201 com Location e formato publico", async () => {
    const r = await api().post("/usuarios").send({ email: "novo@f.br", senha: "senhaforte1" });
    expect(r.status).toBe(201);
    expect(r.headers["location"]).toBe("/usuarios/3");
    expect(r.body).toEqual({ id: "3", email: "novo@f.br", admin: false });
  });

  it("o criado aparece na listagem", async () => {
    const app = criarApp(structuredClone(iniciais));
    await request(app).post("/usuarios").send({ email: "novo@f.br", senha: "senhaforte1" });
    expect((await request(app).get("/usuarios")).body).toHaveLength(3);
  });
});

describe("erros", () => {
  it("id inexistente da 404, nao 500", async () => {
    const r = await api().get("/usuarios/999");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("usuario nao encontrado");
  });

  it("rota inexistente da 404", async () => {
    const r = await api().get("/nao-existe");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("rota nao encontrada");
  });

  it("nenhuma resposta de erro traz stack", async () => {
    for (const r of [await api().get("/usuarios/999"), await api().get("/nao-existe")]) {
      expect(r.body.stack).toBeUndefined();
    }
  });
});
