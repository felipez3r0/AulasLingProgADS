// Camada de servico: regras de negocio, sem saber que HTTP existe.
//
// Ela lanca erros de dominio. Quem traduz para status e o middleware.

import { NaoEncontrado, Conflito } from "./erros.js";
import type { Tarefa, TarefaNova, TarefaAtualizacao } from "./esquemas.js";

const LIMITE_ATIVAS_POR_RESPONSAVEL = 3;

export function criarServico(iniciais: Tarefa[] = []) {
  const tarefas: Tarefa[] = [...iniciais];
  let proximoId = tarefas.length + 1;

  return {
    listar(filtro: { responsavel?: string; concluida?: boolean } = {}): Tarefa[] {
      return tarefas.filter((t) => {
        if (filtro.responsavel !== undefined && t.responsavel !== filtro.responsavel) return false;
        if (filtro.concluida !== undefined && t.concluida !== filtro.concluida) return false;
        return true;
      });
    },

    buscar(id: string): Tarefa {
      const tarefa = tarefas.find((t) => t.id === id);
      if (!tarefa) throw new NaoEncontrado("tarefa nao encontrada");
      return tarefa;
    },

    criar(dados: TarefaNova): Tarefa {
      const ativas = tarefas.filter(
        (t) => t.responsavel === dados.responsavel && !t.concluida,
      ).length;
      if (ativas >= LIMITE_ATIVAS_POR_RESPONSAVEL) {
        throw new Conflito("limite de tarefas ativas atingido");
      }
      const tarefa: Tarefa = { ...dados, id: String(proximoId++), concluida: false };
      tarefas.push(tarefa);
      return tarefa;
    },

    atualizar(id: string, dados: TarefaAtualizacao): Tarefa {
      const tarefa = this.buscar(id);
      Object.assign(tarefa, dados);
      return tarefa;
    },

    remover(id: string): void {
      const indice = tarefas.findIndex((t) => t.id === id);
      if (indice === -1) throw new NaoEncontrado("tarefa nao encontrada");
      tarefas.splice(indice, 1);
    },
  };
}

export type Servico = ReturnType<typeof criarServico>;
