import { createApp } from "./app.js";
import { criarClienteDb } from "./db.js";
import { SCHEMA_SQL } from "./schema.js";

const db = criarClienteDb();
await db.execute(SCHEMA_SQL);

const PORT = Number(process.env.PORT ?? 3000);   // process.env.PORT é obrigatório em produção (Render)
createApp(db).listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
