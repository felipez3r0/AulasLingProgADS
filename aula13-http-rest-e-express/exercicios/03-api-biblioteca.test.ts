import { describe, it, expect } from "vitest";
import request from "supertest";
import { criarApp, type Livro, type Emprestimo } from "./03-api-biblioteca.js";

const livros: Livro[] = [
  { id: "1", titulo: "Refatoracao", autor: "Martin Fowler", disponivel: true },
  { id: "2", titulo: "Clean Code", autor: "Robert Martin", disponivel: true },
  { id: "3", titulo: "O Programador Pragmatico", autor: "Andrew Hunt", disponivel: false },
];

const novaApi = (e: Emprestimo[] = []) =>
  criarApp(structuredClone(livros), structuredClone(e));
const api = () => request(novaApi());

describe("GET /livros", () => {
  it("lista com 200", async () => {
    const r = await api().get("/livros");
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(3);
  });

  it("filtra por disponivel=true", async () => {
    expect((await api().get("/livros?disponivel=true")).body).toHaveLength(2);
  });

  it("filtra por disponivel=false", async () => {
    expect((await api().get("/livros?disponivel=false")).body).toHaveLength(1);
  });

  it("filtro invalido da 400", async () => {
    const r = await api().get("/livros?disponivel=talvez");
    expect(r.status).toBe(400);
    expect(r.body.erro).toBe("filtro invalido");
  });

  it("filtra por trecho do autor, ignorando maiusculas", async () => {
    expect((await api().get("/livros?autor=martin")).body).toHaveLength(2);
  });
});

describe("GET /livros/:id", () => {
  it("200 para existente", async () => {
    expect((await api().get("/livros/1")).body.titulo).toBe("Refatoracao");
  });

  it("404 para inexistente", async () => {
    const r = await api().get("/livros/99");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("livro nao encontrado");
  });
});

describe("POST /livros", () => {
  it("201 com Location, e nasce disponivel", async () => {
    const r = await api().post("/livros").send({ titulo: "Novo", autor: "Alguem" });
    expect(r.status).toBe(201);
    expect(r.headers["location"]).toBe("/livros/4");
    expect(r.body.disponivel).toBe(true);
  });

  it("dados invalidos dao 400", async () => {
    expect((await api().post("/livros").send({})).status).toBe(400);
    expect((await api().post("/livros").send({ titulo: "", autor: "X" })).status).toBe(400);
  });
});

describe("POST /emprestimos", () => {
  it("201 e marca o livro como indisponivel", async () => {
    const app = novaApi();
    const r = await request(app).post("/emprestimos").send({ livroId: "1", aluno: "Ana" });
    expect(r.status).toBe(201);
    expect(r.headers["location"]).toBe("/emprestimos/1");
    expect((await request(app).get("/livros/1")).body.disponivel).toBe(false);
  });

  it("dados invalidos dao 400", async () => {
    expect((await api().post("/emprestimos").send({ aluno: "Ana" })).status).toBe(400);
    expect((await api().post("/emprestimos").send({ livroId: "1" })).status).toBe(400);
  });

  it("livro inexistente da 404", async () => {
    const r = await api().post("/emprestimos").send({ livroId: "99", aluno: "Ana" });
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("livro nao encontrado");
  });

  it("livro indisponivel da 409", async () => {
    const r = await api().post("/emprestimos").send({ livroId: "3", aluno: "Ana" });
    expect(r.status).toBe(409);
    expect(r.body.erro).toBe("livro indisponivel");
  });

  it("livro inexistente tem prioridade sobre indisponivel", async () => {
    expect((await api().post("/emprestimos").send({ livroId: "99", aluno: "Ana" })).status).toBe(
      404,
    );
  });

  it("limite de 3 emprestimos por aluno", async () => {
    const muitos: Emprestimo[] = [
      { id: "1", livroId: "10", aluno: "Ana" },
      { id: "2", livroId: "11", aluno: "Ana" },
      { id: "3", livroId: "12", aluno: "Ana" },
    ];
    const r = await request(novaApi(muitos))
      .post("/emprestimos")
      .send({ livroId: "1", aluno: "Ana" });
    expect(r.status).toBe(409);
    expect(r.body.erro).toBe("limite de emprestimos atingido");
  });

  it("o limite e por aluno", async () => {
    const muitos: Emprestimo[] = [
      { id: "1", livroId: "10", aluno: "Ana" },
      { id: "2", livroId: "11", aluno: "Ana" },
      { id: "3", livroId: "12", aluno: "Ana" },
    ];
    const r = await request(novaApi(muitos))
      .post("/emprestimos")
      .send({ livroId: "1", aluno: "Bruno" });
    expect(r.status).toBe(201);
  });
});

describe("DELETE /emprestimos/:id", () => {
  it("204 e o livro volta a ficar disponivel", async () => {
    const app = novaApi();
    await request(app).post("/emprestimos").send({ livroId: "1", aluno: "Ana" });
    const r = await request(app).delete("/emprestimos/1");
    expect(r.status).toBe(204);
    expect((await request(app).get("/livros/1")).body.disponivel).toBe(true);
  });

  it("404 para inexistente", async () => {
    expect((await api().delete("/emprestimos/99")).status).toBe(404);
  });

  it("devolver libera vaga no limite do aluno", async () => {
    const muitos: Emprestimo[] = [
      { id: "1", livroId: "10", aluno: "Ana" },
      { id: "2", livroId: "11", aluno: "Ana" },
      { id: "3", livroId: "12", aluno: "Ana" },
    ];
    const app = novaApi(muitos);
    await request(app).delete("/emprestimos/1");
    const r = await request(app).post("/emprestimos").send({ livroId: "1", aluno: "Ana" });
    expect(r.status).toBe(201);
  });
});

describe("GET /emprestimos", () => {
  it("lista e filtra por aluno", async () => {
    const app = novaApi();
    await request(app).post("/emprestimos").send({ livroId: "1", aluno: "Ana" });
    await request(app).post("/emprestimos").send({ livroId: "2", aluno: "Bruno" });
    expect((await request(app).get("/emprestimos")).body).toHaveLength(2);
    expect((await request(app).get("/emprestimos?aluno=Ana")).body).toHaveLength(1);
  });
});

describe("rota inexistente", () => {
  it("404 com mensagem propria", async () => {
    const r = await api().get("/nao-existe");
    expect(r.status).toBe(404);
    expect(r.body.erro).toBe("rota nao encontrada");
  });
});
