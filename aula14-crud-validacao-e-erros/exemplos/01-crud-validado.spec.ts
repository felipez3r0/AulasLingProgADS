import { describe, it, expect } from "vitest";
import request from "supertest";
import { criarApp, tarefasDeExemplo } from "./01-crud-validado.js";

const api = () => request(criarApp(structuredClone(tarefasDeExemplo)));

describe("GET /tarefas", () => {
  it("lista com 200", async () => {
    const r = await api().get("/tarefas");
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(3);
  });

  it("filtra por responsavel", async () => {
    expect((await api().get("/tarefas?responsavel=ana")).body).toHaveLength(2);
  });

  it("filtra por concluida", async () => {
    expect((await api().get("/tarefas?concluida=false")).body).toHaveLength(2);
  });

  it("combina filtros", async () => {
    expect((await api().get("/tarefas?responsavel=ana&concluida=true")).body).toHaveLength(1);
  });

  it("filtro invalido da 400", async () => {
    expect((await api().get("/tarefas?concluida=talvez")).status).toBe(400);
  });
});

describe("POST /tarefas - validacao com Zod", () => {
  it("cria com 201 e Location", async () => {
    const r = await api()
      .post("/tarefas")
      .send({ titulo: "Nova tarefa", prioridade: "alta", responsavel: "carla" });
    expect(r.status).toBe(201);
    expect(r.headers["location"]).toBe("/tarefas/4");
    expect(r.body.concluida).toBe(false);
  });

  it("titulo curto da 400 com o campo e a mensagem", async () => {
    const r = await api()
      .post("/tarefas")
      .send({ titulo: "ab", prioridade: "alta", responsavel: "carla" });
    expect(r.status).toBe(400);
    expect(r.body.erro).toBe("dados invalidos");
    expect(r.body.problemas).toContainEqual({
      campo: "titulo",
      mensagem: "titulo precisa de ao menos 3 caracteres",
    });
  });

  it("prioridade fora do enum da 400", async () => {
    const r = await api()
      .post("/tarefas")
      .send({ titulo: "Valida", prioridade: "urgentissima", responsavel: "carla" });
    expect(r.status).toBe(400);
    expect(r.body.problemas[0].campo).toBe("prioridade");
  });

  it("acusa varios campos de uma vez", async () => {
    const r = await api().post("/tarefas").send({});
    expect(r.status).toBe(400);
    expect(r.body.problemas.length).toBeGreaterThanOrEqual(3);
  });

  it("apara espacos do titulo", async () => {
    const r = await api()
      .post("/tarefas")
      .send({ titulo: "   Com espacos   ", prioridade: "baixa", responsavel: "carla" });
    expect(r.body.titulo).toBe("Com espacos");
  });

  it("prazo nao inteiro da 400", async () => {
    const r = await api()
      .post("/tarefas")
      .send({ titulo: "Valida", prioridade: "baixa", responsavel: "carla", prazoEmDias: 1.5 });
    expect(r.status).toBe(400);
  });
});

describe("regra de negocio no servico", () => {
  it("limite de 3 tarefas ativas por responsavel da 409", async () => {
    const app = criarApp(structuredClone(tarefasDeExemplo));
    const nova = (n: number) => ({
      titulo: `Tarefa ${n}`,
      prioridade: "baixa" as const,
      responsavel: "bruno",
    });
    await request(app).post("/tarefas").send(nova(1));
    await request(app).post("/tarefas").send(nova(2));
    const r = await request(app).post("/tarefas").send(nova(3));
    expect(r.status).toBe(409);
    expect(r.body.erro).toBe("limite de tarefas ativas atingido");
  });

  it("tarefa concluida nao conta para o limite", async () => {
    const app = criarApp(structuredClone(tarefasDeExemplo));
    const r = await request(app)
      .post("/tarefas")
      .send({ titulo: "Mais uma", prioridade: "baixa", responsavel: "ana" });
    expect(r.status).toBe(201);
  });
});

describe("PATCH e DELETE", () => {
  it("PATCH atualiza parcialmente", async () => {
    const r = await api().patch("/tarefas/1").send({ concluida: true });
    expect(r.status).toBe(200);
    expect(r.body.concluida).toBe(true);
    expect(r.body.titulo).toBe("Escrever especificacao");
  });

  it("PATCH em id inexistente da 404", async () => {
    expect((await api().patch("/tarefas/99").send({ concluida: true })).status).toBe(404);
  });

  it("PATCH com dado invalido da 400", async () => {
    expect((await api().patch("/tarefas/1").send({ prioridade: "urgente" })).status).toBe(400);
  });

  it("DELETE devolve 204", async () => {
    const app = criarApp(structuredClone(tarefasDeExemplo));
    expect((await request(app).delete("/tarefas/1")).status).toBe(204);
    expect((await request(app).get("/tarefas")).body).toHaveLength(2);
  });

  it("DELETE em id inexistente da 404", async () => {
    expect((await api().delete("/tarefas/99")).status).toBe(404);
  });
});

describe("tratamento de erro centralizado", () => {
  it("rota inexistente da 404 pelo mesmo caminho", async () => {
    const r = await api().get("/nao-existe");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("rota nao encontrada");
  });

  it("erro de dominio vira o status certo", async () => {
    const r = await api().get("/tarefas/99");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("tarefa nao encontrada");
  });
});
