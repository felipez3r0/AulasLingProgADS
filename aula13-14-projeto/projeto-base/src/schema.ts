// Renomeie "itens" para o recurso principal do seu tema (livros, produtos,
// tarefas, alunos...) e ajuste as colunas conforme o contrato do grupo.
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);
`;
