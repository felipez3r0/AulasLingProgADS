import { criarApp } from "./api/app.js";
import type { Tarefa } from "./api/esquemas.js";

export { criarApp };
export type { Tarefa };

export const tarefasDeExemplo: Tarefa[] = [
  { id: "1", titulo: "Escrever especificacao", prioridade: "alta", responsavel: "ana", concluida: false },
  { id: "2", titulo: "Revisar diff do agente", prioridade: "media", responsavel: "ana", concluida: true },
  { id: "3", titulo: "Configurar CI", prioridade: "baixa", responsavel: "bruno", concluida: false },
];
