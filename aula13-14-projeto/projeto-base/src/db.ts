import { createClient, type Client } from "@libsql/client";

// file: em dev, Turso (libsql://...) em produção — via variável de
// ambiente, sem mudar código entre os dois ambientes (ver aula10 e o
// roteiro de deploy em recursos/roteiro-deploy-render-turso.md).
export function criarClienteDb(
  url: string = process.env.DATABASE_URL ?? "file:local.db",
): Client {
  return createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
}
