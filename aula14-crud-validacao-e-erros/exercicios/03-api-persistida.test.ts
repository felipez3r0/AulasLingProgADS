import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtemp, rm, writeFile, mkdir, readdir, readFile } from "node:fs/promises";
import { criarApp } from "./03-api-persistida.js";

let pasta: string;
let banco: string;

beforeEach(async () => {
  pasta = await mkdtemp(join(tmpdir(), "ex-a14-"));
  banco = join(pasta, "dados", "notas.json");
});

afterEach(async () => {
  await rm(pasta, { recursive: true, force: true });
});

const api = () => request(criarApp(banco));
const nota = (over: Record<string, unknown> = {}) => ({
  aluno: "Ana",
  disciplina: "LP",
  valor: 8,
  semestre: 2,
  ...over,
});

describe("POST /notas", () => {
  it("201 com Location", async () => {
    const r = await api().post("/notas").send(nota());
    expect(r.status).toBe(201);
    expect(r.headers["location"]).toBe("/notas/1");
    expect(r.body).toMatchObject({ id: "1", aluno: "Ana", valor: 8 });
  });

  it("dados invalidos dao 400 com problemas", async () => {
    const r = await api().post("/notas").send(nota({ valor: 11 }));
    expect(r.status).toBe(400);
    expect(r.body.erro).toBe("dados invalidos");
    expect(Array.isArray(r.body.problemas)).toBe(true);
    expect(r.body.problemas[0].campo).toBe("valor");
  });

  it("aluno vazio da 400", async () => {
    expect((await api().post("/notas").send(nota({ aluno: "" }))).status).toBe(400);
  });

  it("semestre nao inteiro da 400", async () => {
    expect((await api().post("/notas").send(nota({ semestre: 2.5 }))).status).toBe(400);
  });

  it("valor 0 e 10 sao validos", async () => {
    expect((await api().post("/notas").send(nota({ valor: 0 }))).status).toBe(201);
    expect((await api().post("/notas").send(nota({ valor: 10, disciplina: "BD" }))).status).toBe(201);
  });

  it("nota duplicada da 409", async () => {
    const app = criarApp(banco);
    await request(app).post("/notas").send(nota());
    const r = await request(app).post("/notas").send(nota({ valor: 9 }));
    expect(r.status).toBe(409);
    expect(r.body.erro).toBe("nota ja lancada");
  });

  it("mesma disciplina em semestre diferente e permitida", async () => {
    const app = criarApp(banco);
    await request(app).post("/notas").send(nota());
    expect((await request(app).post("/notas").send(nota({ semestre: 3 }))).status).toBe(201);
  });
});

describe("GET /notas", () => {
  it("lista vazia quando o arquivo nao existe", async () => {
    const r = await api().get("/notas");
    expect(r.status).toBe(200);
    expect(r.body).toEqual([]);
  });

  it("filtra por aluno e por disciplina", async () => {
    const app = criarApp(banco);
    await request(app).post("/notas").send(nota());
    await request(app).post("/notas").send(nota({ aluno: "Bruno" }));
    await request(app).post("/notas").send(nota({ disciplina: "BD" }));
    expect((await request(app).get("/notas?aluno=Ana")).body).toHaveLength(2);
    expect((await request(app).get("/notas?disciplina=BD")).body).toHaveLength(1);
  });

  it("filtra por semestre", async () => {
    const app = criarApp(banco);
    await request(app).post("/notas").send(nota());
    await request(app).post("/notas").send(nota({ semestre: 3 }));
    expect((await request(app).get("/notas?semestre=3")).body).toHaveLength(1);
  });

  it("semestre invalido da 400", async () => {
    const r = await api().get("/notas?semestre=segundo");
    expect(r.status).toBe(400);
    expect(r.body.erro).toBe("semestre invalido");
  });
});

describe("GET /notas/media", () => {
  it("calcula a media do aluno", async () => {
    const app = criarApp(banco);
    await request(app).post("/notas").send(nota({ valor: 8 }));
    await request(app).post("/notas").send(nota({ valor: 9, disciplina: "BD" }));
    const r = await request(app).get("/notas/media?aluno=Ana");
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ aluno: "Ana", media: 8.5, quantidade: 2 });
  });

  it("arredonda a 2 casas", async () => {
    const app = criarApp(banco);
    for (const [i, v] of [7, 8, 8].entries()) {
      await request(app).post("/notas").send(nota({ valor: v, disciplina: `D${i}` }));
    }
    expect((await request(app).get("/notas/media?aluno=Ana")).body.media).toBe(7.67);
  });

  it("aluno sem notas devolve media zero", async () => {
    const r = await api().get("/notas/media?aluno=Ninguem");
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ aluno: "Ninguem", media: 0, quantidade: 0 });
  });

  it("aluno ausente da 400", async () => {
    const r = await api().get("/notas/media");
    expect(r.status).toBe(400);
    expect(r.body.erro).toBe("aluno obrigatorio");
  });

  it("a rota media nao e confundida com um id", async () => {
    expect((await api().get("/notas/media?aluno=Ana")).status).toBe(200);
  });
});

describe("GET e DELETE /notas/:id", () => {
  it("busca por id", async () => {
    const app = criarApp(banco);
    await request(app).post("/notas").send(nota());
    expect((await request(app).get("/notas/1")).body.aluno).toBe("Ana");
  });

  it("id inexistente da 404", async () => {
    const r = await api().get("/notas/99");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("nota nao encontrada");
  });

  it("DELETE devolve 204 e some da listagem", async () => {
    const app = criarApp(banco);
    await request(app).post("/notas").send(nota());
    expect((await request(app).delete("/notas/1")).status).toBe(204);
    expect((await request(app).get("/notas")).body).toEqual([]);
  });

  it("DELETE em id inexistente da 404", async () => {
    expect((await api().delete("/notas/99")).status).toBe(404);
  });
});

describe("persistencia", () => {
  it("os dados sobrevivem a uma app nova", async () => {
    await request(criarApp(banco)).post("/notas").send(nota());
    expect((await request(criarApp(banco)).get("/notas")).body).toHaveLength(1);
  });

  it("grava no arquivo indicado", async () => {
    await request(criarApp(banco)).post("/notas").send(nota());
    expect(JSON.parse(await readFile(banco, "utf8"))).toHaveLength(1);
  });

  it("escrita atomica: nao deixa temporario", async () => {
    await request(criarApp(banco)).post("/notas").send(nota());
    expect(await readdir(join(pasta, "dados"))).toEqual(["notas.json"]);
  });

  it("arquivo corrompido da 500, e nao apaga os dados", async () => {
    await mkdir(join(pasta, "dados"), { recursive: true });
    await writeFile(banco, "{ nao e json", "utf8");
    const r = await api().get("/notas");
    expect(r.status).toBe(500);
    expect(r.body.erro).toBe("erro interno");
    expect(await readFile(banco, "utf8")).toBe("{ nao e json");
  });
});

describe("erros gerais", () => {
  it("rota inexistente da 404", async () => {
    const r = await api().get("/nao-existe");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("rota nao encontrada");
  });

  it("nenhuma resposta de erro traz stack", async () => {
    for (const r of [await api().get("/notas/99"), await api().get("/nao-existe")]) {
      expect(r.body.stack).toBeUndefined();
    }
  });
});
