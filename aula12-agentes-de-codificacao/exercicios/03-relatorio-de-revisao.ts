// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-relatorio-de-revisao.spec.md ANTES de
// chamar o agente. Depois: git diff, e revise linha a linha.
//
// A ironia e proposital: voce vai DELEGAR A UM AGENTE a construcao da
// ferramenta que decide se o trabalho de um agente pode ser aprovado.
// Revise com o cuidado que o assunto merece.
//
// Rode: npm run ex -- 03-relatorio-de-revisao

import type { Alerta } from "./02-alertas-de-diff.js";

export interface EntregaDoAgente {
  descricao: string;
  arquivosAlterados: string[];
  linhasAdicionadas: number;
  linhasRemovidas: number;
  alertas: Alerta[];
  testesPassaram: boolean;
  typecheckPassou: boolean;
}

export type Decisao = "aprovar" | "pedir ajustes" | "recusar";

export interface RelatorioDeRevisao {
  decisao: Decisao;
  motivos: string[];
  precisaLerComCuidado: boolean;
}

/**
 * Decide se uma entrega de agente pode ser aprovada.
 *
 * Motivos possiveis, NESTA ORDEM:
 *   - "testes falhando"           quando testesPassaram e false
 *   - "typecheck falhando"        quando typecheckPassou e false
 *   - "alerta grave: <regra>"     um por alerta de gravidade "alta",
 *                                 na ordem em que aparecem
 *   - "alerta: <regra>"           um por alerta de gravidade "media"
 *   - "diff grande"               quando linhasAdicionadas + linhasRemovidas > 200
 *   - "muitos arquivos"           quando arquivosAlterados tem mais de 10 itens
 *   - "sem descricao"             quando descricao, sem espacos nas pontas,
 *                                 tem menos de 10 caracteres
 *
 * Decisao:
 *   - "recusar"       se ha testes falhando, typecheck falhando, ou
 *                     qualquer alerta de gravidade alta
 *   - "pedir ajustes" se nao ha motivo de recusa mas ha algum outro motivo
 *   - "aprovar"       se nao ha motivo nenhum
 *
 * precisaLerComCuidado e true quando o diff passa de 200 linhas OU
 * quando ha mais de 10 arquivos alterados - independente da decisao.
 *
 * A funcao NAO lanca para nenhuma entrada valida pelo tipo.
 */
export function revisar(_entrega: EntregaDoAgente): RelatorioDeRevisao {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
