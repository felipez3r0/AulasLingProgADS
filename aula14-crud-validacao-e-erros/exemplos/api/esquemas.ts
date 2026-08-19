// Validacao com Zod: o esquema e a fonte da verdade.
//
// Repare que o TIPO e DERIVADO do esquema, e nao o contrario.
// Assim nao ha como o tipo e a validacao discordarem.

import { z } from "zod";

export const esquemaTarefaNova = z.object({
  titulo: z.string().trim().min(3, "titulo precisa de ao menos 3 caracteres").max(100),
  prioridade: z.enum(["baixa", "media", "alta"]),
  responsavel: z.string().trim().min(1),
  prazoEmDias: z.number().int().positive().max(365).optional(),
});

export const esquemaTarefaAtualizacao = esquemaTarefaNova.partial().extend({
  concluida: z.boolean().optional(),
});

/** O tipo sai do esquema. Uma fonte da verdade, nao duas. */
export type TarefaNova = z.infer<typeof esquemaTarefaNova>;
export type TarefaAtualizacao = z.infer<typeof esquemaTarefaAtualizacao>;

export interface Tarefa extends TarefaNova {
  id: string;
  concluida: boolean;
}

/** Traduz o erro do Zod para uma lista legivel de problemas. */
export function formatarErros(erro: z.ZodError): { campo: string; mensagem: string }[] {
  return erro.issues.map((problema) => ({
    campo: problema.path.join(".") || "(raiz)",
    mensagem: problema.message,
  }));
}
