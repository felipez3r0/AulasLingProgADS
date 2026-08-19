// Persistencia: o servico da aula 13 ganha um repositorio em arquivo.
//
// Reune a aula 10 (arquivos, escrita atomica) com a aula 13 (API).
// Este e o esqueleto do projeto final.

import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { dirname } from "node:path";
import type { Tarefa } from "./api/esquemas.js";

/** Le a colecao. Arquivo ausente e estado inicial, nao erro. */
export async function carregar(caminho: string): Promise<Tarefa[]> {
  let bruto: string;
  try {
    bruto = await readFile(caminho, "utf8");
  } catch (erro) {
    if (erro instanceof Error && "code" in erro && erro.code === "ENOENT") return [];
    throw erro;
  }
  let dados: unknown;
  try {
    dados = JSON.parse(bruto);
  } catch {
    // Arquivo ilegivel NAO vira lista vazia - isso apagaria tudo na
    // proxima gravacao. Ver a leitura critica da aula 10.
    throw new Error("arquivo de dados corrompido");
  }
  if (!Array.isArray(dados)) throw new Error("formato invalido");
  return dados as Tarefa[];
}

/** Escrita atomica: temporario e rename. */
export async function salvar(caminho: string, tarefas: Tarefa[]): Promise<void> {
  await mkdir(dirname(caminho), { recursive: true });
  const temporario = `${caminho}.tmp`;
  await writeFile(temporario, JSON.stringify(tarefas, null, 2), "utf8");
  await rename(temporario, caminho);
}

/**
 * Repositorio: le, aplica a operacao, grava.
 *
 * Cada operacao le e grava o arquivo inteiro. E ineficiente e e o
 * suficiente para o volume desta disciplina - trocar por um banco de
 * verdade muda so este modulo.
 */
export function criarRepositorio(caminho: string) {
  return {
    async listar(): Promise<Tarefa[]> {
      return carregar(caminho);
    },

    async salvarTodas(tarefas: Tarefa[]): Promise<void> {
      await salvar(caminho, tarefas);
    },

    async inserir(tarefa: Tarefa): Promise<Tarefa> {
      const tarefas = await carregar(caminho);
      await salvar(caminho, [...tarefas, tarefa]);
      return tarefa;
    },

    async remover(id: string): Promise<boolean> {
      const tarefas = await carregar(caminho);
      const restantes = tarefas.filter((t) => t.id !== id);
      if (restantes.length === tarefas.length) return false;
      await salvar(caminho, restantes);
      return true;
    },
  };
}
