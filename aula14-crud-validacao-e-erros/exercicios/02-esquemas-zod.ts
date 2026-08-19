// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Metodo: escreva o esquema, depois deixe o Copilot ajudar nas
// mensagens e nos refinamentos.
//
// Zod e um caso em que a IA ajuda muito - e tambem inventa metodos
// que nao existem com frequencia. Confira cada um na documentacao.
//
// Rode: npm run ex -- 02-esquemas-zod

import { z } from "zod";

/**
 * Esquema de cadastro de evento.
 *
 * Regras:
 *   - `titulo`: texto, aparado, de 5 a 80 caracteres
 *       mensagem quando curto: "titulo muito curto"
 *   - `descricao`: texto opcional, no maximo 500 caracteres
 *   - `vagas`: inteiro positivo, no maximo 1000
 *       mensagem quando nao positivo: "vagas deve ser positivo"
 *   - `modalidade`: "presencial" | "online" | "hibrido"
 *   - `dataIso`: texto no formato aaaa-mm-dd
 *       mensagem: "data deve estar no formato aaaa-mm-dd"
 *   - `local`: texto opcional
 *   - `tags`: lista de textos, no maximo 5, sem repetidos
 *       mensagem quando repetidos: "tags nao podem repetir"
 *
 *   - REGRA CRUZADA: quando `modalidade` for "presencial" ou "hibrido",
 *     `local` e OBRIGATORIO. Mensagem: "local e obrigatorio nesta modalidade".
 *     O erro deve apontar para o campo `local`.
 *
 * Dica: para a regra cruzada, use `.superRefine` ou `.refine` no objeto.
 */
export const esquemaEvento = z.object({
  // TODO: implemente os campos
  titulo: z.string(),
});

export type Evento = z.infer<typeof esquemaEvento>;

/**
 * Valida e devolve o resultado sem lancar.
 *
 * Especificacao:
 *   - sucesso: { ok: true, dados }
 *   - falha: { ok: false, problemas } onde cada problema e
 *     { campo, mensagem }, com `campo` sendo o caminho unido por ponto
 *     (ex: "tags.2") ou "(raiz)" quando o caminho for vazio
 *   - a ordem dos problemas segue a ordem em que o Zod os reporta
 */
export type ResultadoValidacao =
  | { ok: true; dados: Evento }
  | { ok: false; problemas: { campo: string; mensagem: string }[] };

export function validarEvento(_entrada: unknown): ResultadoValidacao {
  throw new Error("TODO: implemente validarEvento");
}
