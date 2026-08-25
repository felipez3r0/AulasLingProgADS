import express, { Express, NextFunction, Request, Response } from "express";

interface Produto { id: number; nome: string; preco: number; }

class ApiError extends Error {
  constructor(public statusCode: number, message: string) { super(message); }
}
class NotFoundError extends ApiError {
  constructor(recurso: string) { super(404, `${recurso} não encontrado`); }
}

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  const produtos: Produto[] = [{ id: 1, nome: "Mouse", preco: 89.9 }];
  let proximoId = 2;

  app.get("/produtos", (req, res) => res.json([...produtos]));

  app.get("/produtos/:id", (req: Request, res: Response, next: NextFunction) => {
    const produto = produtos.find((p) => p.id === Number(req.params.id));
    if (!produto) { next(new NotFoundError("Produto")); return; }
    res.json(produto);
  });

  app.post("/produtos", (req: Request, res: Response) => {
    // BUG: nenhuma validação do corpo da requisição antes de usar.
    const produto: Produto = { id: proximoId++, ...req.body };
    produtos.push(produto);
    res.status(201).json(produto);
  });

  app.use((erro: Error, req: Request, res: Response, next: NextFunction) => {
    if (erro instanceof ApiError) { res.status(erro.statusCode).json({ erro: erro.message }); return; }
    res.status(500).json({ erro: "Erro interno do servidor" });
  });

  return app;
}
