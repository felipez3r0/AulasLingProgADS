// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-api-persistida.spec.md ANTES de chamar
// o agente. Depois: git diff, e revise linha a linha.
//
// Este e o ensaio do projeto final: API + validacao + erros + persistencia.
//
// Rode: npm run ex -- 03-api-persistida

import { z } from "zod";

export const esquemaNota = z.object({
  aluno: z.string().trim().min(1),
  disciplina: z.string().trim().min(1),
  valor: z.number().min(0).max(10),
  semestre: z.number().int().min(1).max(10),
});

export type NotaNova = z.infer<typeof esquemaNota>;

export interface Nota extends NotaNova {
  id: string;
}

/**
 * API de notas, com persistencia em arquivo JSON.
 *
 * A app recebe o CAMINHO do arquivo; nada de caminho fixo no codigo.
 *
 * Contrato:
 *
 *   GET /notas
 *     200 com a lista
 *     query `aluno` filtra por nome exato
 *     query `disciplina` filtra por nome exato
 *     query `semestre` filtra; valor nao numerico -> 400 { erro: "semestre invalido" }
 *
 *   GET /notas/media?aluno=<nome>
 *     200 { aluno, media, quantidade } com a media arredondada a 2 casas
 *     aluno sem notas -> 200 { aluno, media: 0, quantidade: 0 }
 *     `aluno` ausente -> 400 { erro: "aluno obrigatorio" }
 *
 *   GET /notas/:id
 *     200 | 404 { erro: "nota nao encontrada" }
 *
 *   POST /notas
 *     201 com Location "/notas/<id>"
 *     corpo validado por `esquemaNota`; invalido -> 400
 *       { erro: "dados invalidos", problemas: [{ campo, mensagem }] }
 *     mesma combinacao aluno+disciplina+semestre ja existente ->
 *       409 { erro: "nota ja lancada" }
 *     o id e o proximo numero da sequencia, como texto
 *
 *   DELETE /notas/:id
 *     204 | 404 { erro: "nota nao encontrada" }
 *
 *   qualquer outra rota -> 404 { erro: "rota nao encontrada" }
 *   erro nao previsto -> 500 { erro: "erro interno" }, sem stack
 *
 * Persistencia:
 *   - toda alteracao e gravada no arquivo, de forma ATOMICA
 *   - arquivo ausente e estado inicial vazio, nao erro
 *   - arquivo corrompido faz as rotas responderem 500 { erro: "erro interno" }
 *   - os dados sobrevivem: uma app nova no mesmo arquivo enxerga o que foi gravado
 */
export function criarApp(_caminhoDados: string): import("express").Express {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
