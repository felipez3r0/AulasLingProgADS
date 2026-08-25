import express, { Express, NextFunction, Request, Response } from "express";
import { z } from "zod";
import type { Client } from "@libsql/client";
import { buscarPorId, criar, listarTodos, remover } from "./repository.js";

const NovoItemSchema = z.object({
  nome: z.string().min(2, "nome deve ter pelo menos 2 caracteres"),
});

class ApiError extends Error {
  constructor(public statusCode: number, message: string) { super(message); }
}
class NotFoundError extends ApiError {
  constructor(recurso: string) { super(404, `${recurso} não encontrado`); }
}

export function createApp(db: Client): Express {
  const app = express();
  app.use(express.json());

  app.get("/itens", async (req, res, next) => {
    try {
      res.json(await listarTodos(db));
    } catch (erro) { next(erro); }
  });

  app.get("/itens/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await buscarPorId(db, Number(req.params.id));
      if (!item) throw new NotFoundError("Item");
      res.json(item);
    } catch (erro) { next(erro); }
  });

  app.post("/itens", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultado = NovoItemSchema.safeParse(req.body);
      if (!resultado.success) {
        res.status(400).json({ erro: "Dados inválidos", detalhes: resultado.error.issues });
        return;
      }
      res.status(201).json(await criar(db, resultado.data));
    } catch (erro) { next(erro); }
  });

  app.delete("/itens/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const removido = await remover(db, Number(req.params.id));
      if (!removido) throw new NotFoundError("Item");
      res.status(204).send();
    } catch (erro) { next(erro); }
  });

  // TODO do grupo: PUT /itens/:id, filtros via query params, relacionamento
  // entre recursos, regras de negócio do tema escolhido — ver contrato.

  app.use((erro: Error, req: Request, res: Response, next: NextFunction) => {
    if (erro instanceof ApiError) { res.status(erro.statusCode).json({ erro: erro.message }); return; }
    console.error(erro);
    res.status(500).json({ erro: "Erro interno do servidor" });
  });

  return app;
}
