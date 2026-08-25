// Tipos do contrato — mantenha alinhado com o contrato combinado com o
// front do grupo (recursos/template-contrato-api.md).
export interface Item {
  id: number;
  nome: string;
  criadoEm: string;
}

export type NovoItem = Omit<Item, "id" | "criadoEm">;

export interface ErroApi {
  erro: string;
  detalhes?: unknown;
}
