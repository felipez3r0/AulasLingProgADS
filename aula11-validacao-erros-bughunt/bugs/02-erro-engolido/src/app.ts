import express, { Express, NextFunction, Request, Response } from "express";
import { z } from "zod";

const ProdutoSchema = z.object({ nome: z.string().min(2), preco: z.number().positive() });
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

  app.get("/produtos/:id", (req: Request, res: Response) => {
    try {
      const produto = produtos.find((p) => p.id === Number(req.params.id));
      if (!produto) throw new NotFoundError("Produto");
      res.json(produto);
    } catch (erro) {
      // BUG: captura o erro, loga, mas não repassa (next) nem responde
      // com o status/corpo corretos — devolve 200 vazio, escondendo o 404.
      console.error(erro);
      res.status(200).json({});
    }
  });

  app.post("/produtos", (req: Request, res: Response) => {
    const resultado = ProdutoSchema.safeParse(req.body);
    if (!resultado.success) {
      res.status(400).json({ erro: "Dados inválidos", detalhes: resultado.error.issues });
      return;
    }
    const produto: Produto = { id: proximoId++, ...resultado.data };
    produtos.push(produto);
    res.status(201).json(produto);
  });

  app.use((erro: Error, req: Request, res: Response, next: NextFunction) => {
    if (erro instanceof ApiError) { res.status(erro.statusCode).json({ erro: erro.message }); return; }
    res.status(500).json({ erro: "Erro interno do servidor" });
  });

  return app;
}
