import type { Client } from "@libsql/client";
import type { Item, NovoItem } from "./types.js";

export async function listarTodos(db: Client): Promise<Item[]> {
  const resultado = await db.execute("SELECT id, nome, criado_em as criadoEm FROM itens ORDER BY id");
  return resultado.rows as unknown as Item[];
}

export async function buscarPorId(db: Client, id: number): Promise<Item | null> {
  const resultado = await db.execute({
    sql: "SELECT id, nome, criado_em as criadoEm FROM itens WHERE id = ?",
    args: [id],
  });
  return (resultado.rows[0] as unknown as Item) ?? null;
}

export async function criar(db: Client, dados: NovoItem): Promise<Item> {
  const resultado = await db.execute({
    sql: "INSERT INTO itens (nome) VALUES (?) RETURNING id, nome, criado_em as criadoEm",
    args: [dados.nome],
  });
  return resultado.rows[0] as unknown as Item;
}

export async function remover(db: Client, id: number): Promise<boolean> {
  const resultado = await db.execute({ sql: "DELETE FROM itens WHERE id = ?", args: [id] });
  return resultado.rowsAffected > 0;
}
