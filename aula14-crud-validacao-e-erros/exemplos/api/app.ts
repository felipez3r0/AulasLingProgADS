// A app: rotas finas, que so traduzem HTTP <-> servico.
//
// Toda a logica esta no servico; toda a validacao esta no esquema;
// todo o tratamento de erro esta no middleware final.

import express, { type Express, type Request, type Response, type NextFunction } from "express";

/**
 * Parametros de rota chegam como `string | string[]`.
 *
 * Normalizar na fronteira e o mesmo principio da aula 04: tudo que vem
 * da requisicao e texto nao confiavel, e precisa virar o tipo que o
 * resto do programa espera ANTES de circular por ele.
 */
function parametro(req: Request, nome: string): string {
  const valor = req.params[nome];
  return Array.isArray(valor) ? (valor[0] ?? "") : (valor ?? "");
}
import { ZodError } from "zod";
import { criarServico } from "./servico.js";
import { esquemaTarefaNova, esquemaTarefaAtualizacao, formatarErros, type Tarefa } from "./esquemas.js";
import { ErroDaApi, NaoEncontrado } from "./erros.js";

export function criarApp(iniciais: Tarefa[] = []): Express {
  const app = express();
  const servico = criarServico(iniciais);
  app.use(express.json());

  app.get("/tarefas", (req: Request, res: Response) => {
    const concluidaBruta = req.query["concluida"];
    let concluida: boolean | undefined;
    if (concluidaBruta !== undefined) {
      if (concluidaBruta !== "true" && concluidaBruta !== "false") {
        return res.status(400).json({ erro: "filtro concluida invalido" });
      }
      concluida = concluidaBruta === "true";
    }
    const responsavel = req.query["responsavel"];
    return res.json(
      servico.listar({
        responsavel: typeof responsavel === "string" ? responsavel : undefined,
        concluida,
      }),
    );
  });

  app.get("/tarefas/:id", (req: Request, res: Response, proximo: NextFunction) => {
    try {
      res.json(servico.buscar(parametro(req, "id")));
    } catch (erro) {
      proximo(erro);
    }
  });

  app.post("/tarefas", (req: Request, res: Response, proximo: NextFunction) => {
    try {
      const dados = esquemaTarefaNova.parse(req.body);
      const tarefa = servico.criar(dados);
      res.status(201).location(`/tarefas/${tarefa.id}`).json(tarefa);
    } catch (erro) {
      proximo(erro);
    }
  });

  app.patch("/tarefas/:id", (req: Request, res: Response, proximo: NextFunction) => {
    try {
      const dados = esquemaTarefaAtualizacao.parse(req.body);
      res.json(servico.atualizar(parametro(req, "id"), dados));
    } catch (erro) {
      proximo(erro);
    }
  });

  app.delete("/tarefas/:id", (req: Request, res: Response, proximo: NextFunction) => {
    try {
      servico.remover(parametro(req, "id"));
      res.status(204).send();
    } catch (erro) {
      proximo(erro);
    }
  });

  app.use((_req: Request, _res: Response, proximo: NextFunction) => {
    proximo(new NaoEncontrado("rota nao encontrada"));
  });

  // Middleware de erro: 4 parametros. E o unico lugar que decide status.
  app.use((erro: unknown, _req: Request, res: Response, _proximo: NextFunction) => {
    if (erro instanceof ZodError) {
      return res.status(400).json({ erro: "dados invalidos", problemas: formatarErros(erro) });
    }
    if (erro instanceof ErroDaApi) {
      return res.status(erro.status).json({ erro: erro.message, detalhes: erro.detalhes });
    }
    // Erro nao previsto: 500, e NAO vaza a mensagem interna para o cliente.
    return res.status(500).json({ erro: "erro interno" });
  });

  return app;
}
