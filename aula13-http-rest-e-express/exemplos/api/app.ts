// A aplicacao Express, separada do servidor.
//
// Esta separacao e o que torna a API TESTAVEL: o teste importa `criarApp`
// e faz requisicoes sem abrir porta nenhuma. Se `app.listen` estivesse
// aqui dentro, cada teste precisaria subir um servidor de verdade.

import express, { type Request, type Response, type NextFunction } from "express";

export interface Aluno {
  id: string;
  nome: string;
  ra: string;
  curso: string;
}

/** Estado em memoria. Na aula 14 isso vira persistencia em arquivo. */
export function criarApp(alunosIniciais: Aluno[] = []) {
  const app = express();
  const alunos: Aluno[] = [...alunosIniciais];

  app.use(express.json());

  // Middleware: roda antes das rotas e registra o que chegou.
  app.use((req: Request, _res: Response, proximo: NextFunction) => {
    req.headers["x-recebido-em"] = new Date().toISOString();
    proximo();
  });

  // GET /alunos - lista, com filtro opcional por curso
  app.get("/alunos", (req: Request, res: Response) => {
    const curso = req.query["curso"];
    if (typeof curso === "string") {
      return res.json(alunos.filter((a) => a.curso.toLowerCase() === curso.toLowerCase()));
    }
    return res.json(alunos);
  });

  // GET /alunos/:id - um recurso
  app.get("/alunos/:id", (req: Request, res: Response) => {
    const aluno = alunos.find((a) => a.id === req.params.id);
    if (!aluno) return res.status(404).json({ erro: "aluno nao encontrado" });
    return res.json(aluno);
  });

  // POST /alunos - cria; 201 e Location sao parte do contrato REST
  app.post("/alunos", (req: Request, res: Response) => {
    const { nome, ra, curso } = req.body as Partial<Aluno>;
    if (!nome || !ra || !curso) {
      return res.status(400).json({ erro: "nome, ra e curso sao obrigatorios" });
    }
    if (alunos.some((a) => a.ra === ra)) {
      return res.status(409).json({ erro: "RA ja cadastrado" });
    }
    const aluno: Aluno = { id: String(alunos.length + 1), nome, ra, curso };
    alunos.push(aluno);
    return res.status(201).location(`/alunos/${aluno.id}`).json(aluno);
  });

  // DELETE /alunos/:id - 204 significa "deu certo, e nao ha corpo"
  app.delete("/alunos/:id", (req: Request, res: Response) => {
    const indice = alunos.findIndex((a) => a.id === req.params.id);
    if (indice === -1) return res.status(404).json({ erro: "aluno nao encontrado" });
    alunos.splice(indice, 1);
    return res.status(204).send();
  });

  // Rota inexistente
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ erro: "rota nao encontrada" });
  });

  return app;
}
