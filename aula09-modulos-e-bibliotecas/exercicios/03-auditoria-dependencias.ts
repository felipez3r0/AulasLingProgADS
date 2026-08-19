// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-auditoria-dependencias.spec.md ANTES
// de chamar o agente. Depois: git diff, e revise linha a linha.
//
// O tema e o proprio assunto da aula: auditar dependencias.
//
// Rode: npm run ex -- 03-auditoria

export interface Dependencia {
  nome: string;
  versaoDeclarada: string; // ex: "^1.2.3", "~2.0.0", "3.1.4", "*"
  ultimaPublicacao: string; // ISO: "2026-01-15"
  downloadsSemanais: number;
  temRepositorio: boolean;
}

export type Risco = "alto" | "medio" | "baixo";

export interface Achado {
  nome: string;
  risco: Risco;
  motivos: string[];
}

/**
 * Audita uma lista de dependencias e classifica o risco de cada uma.
 *
 * Motivos possiveis, NESTA ORDEM:
 *   - "sem repositorio"        quando temRepositorio e false
 *   - "poucos downloads"       quando downloadsSemanais < 1000
 *   - "abandonada"             quando ultimaPublicacao tem mais de 2 anos
 *                              em relacao a `hoje`
 *   - "versao sem trava"       quando versaoDeclarada e "*" ou comeca com ">"
 *
 * Risco:
 *   - "alto"  com 3 ou mais motivos
 *   - "medio" com 1 ou 2 motivos
 *   - "baixo" sem motivo nenhum
 *
 * Regras:
 *   - o resultado traz TODAS as dependencias, inclusive as de risco baixo
 *   - ordenado por risco (alto, medio, baixo) e, dentro do mesmo risco,
 *     por nome em ordem alfabetica
 *   - data em formato invalido lanca Error("data invalida: <nome>")
 *   - lista vazia devolve lista vazia
 *   - a funcao NAO modifica o array recebido
 */
export function auditar(_deps: Dependencia[], _hoje: string): Achado[] {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
