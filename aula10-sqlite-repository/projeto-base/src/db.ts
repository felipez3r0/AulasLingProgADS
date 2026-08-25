import { createClient, type Client } from "@libsql/client";

// file: em desenvolvimento, URL do Turso (libsql://...) em produção — via
// variável de ambiente, o MESMO código roda nos dois ambientes. Sem
// DATABASE_AUTH_TOKEN definido (caso local), o client simplesmente ignora.
export function criarClienteDb(
  url: string = process.env.DATABASE_URL ?? "file:local.db",
): Client {
  return createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
}
