# Aula 10 - Persistência com SQLite (libSQL): padrão repository

**Modo de IA: Par** — você revisa o SQL/código gerado quanto a segurança (injeção) e tipagem.

## Objetivos da aula

- Configurar `@libsql/client` para rodar com `file:` em desenvolvimento e Turso em produção, via variável de ambiente, sem mudar código entre os dois ambientes.
- Aplicar o padrão **repository**: uma camada que isola o SQL do resto da aplicação.
- Revisar SQL gerado por IA quanto a **injeção de SQL** (parâmetros vs. concatenação de string) e correspondência de tipos com a interface TypeScript.

## Leitura prévia (antes da aula)

- Instale as dependências do projeto-base: `cd aula10-sqlite-repository/projeto-base && npm install`, rode `npm test` e confira que passa (1 real + 6 pendentes).
- Releia a seção "Passagem por valor vs por referência" da aula03. Não é o mesmo assunto, mas o cuidado de "o que exatamente está sendo compartilhado" volta aqui: uma `Client` de banco é compartilhada entre chamadas, não recriada a cada função.

---

## Conteúdo

### Por que `@libsql/client` (não `better-sqlite3`, não `node:sqlite`)

`better-sqlite3` e `node:sqlite` só falam com um arquivo `.db` local. `@libsql/client` usa o mesmo protocolo tanto para um arquivo local (`file:local.db`) quanto para um banco remoto no [Turso](https://turso.tech) (`libsql://seu-banco.turso.io`). O código de acesso a dados não muda entre ambientes, só a variável de ambiente:

```typescript
import { createClient } from "@libsql/client";

export function criarClienteDb(url: string = process.env.DATABASE_URL ?? "file:local.db") {
  return createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,   // undefined é ok para file: local
  });
}
```

```bash
# desenvolvimento (.env local ou nada, cai no default file:local.db)
DATABASE_URL=file:local.db

# produção (Render, ver aula14)
DATABASE_URL=libsql://seu-banco.turso.io
DATABASE_AUTH_TOKEN=eyJ...
```

### Executando queries

```typescript
// SELECT
const resultado = await db.execute("SELECT id, nome, email FROM alunos ORDER BY id");
const alunos = resultado.rows;   // array de linhas

// Com PARÂMETROS: sempre assim quando o valor vem de fora (nunca concatene string)
await db.execute({
  sql: "INSERT INTO alunos (nome, email, curso) VALUES (?, ?, ?)",
  args: [nome, email, curso],
});
```

> **Injeção de SQL:** `` `SELECT * FROM alunos WHERE email = '${email}'` `` (concatenando string) permite que um `email` malicioso tipo `' OR '1'='1` altere a query inteira. `db.execute({ sql: "... WHERE email = ?", args: [email] })` (parâmetro) é sempre seguro: o driver escapa o valor. Nunca aceite SQL gerado por IA que concatena valores vindos do usuário direto na string.

### Padrão repository

O repository isola o SQL do resto da aplicação: quem chama `listarTodos(db)` não sabe (nem precisa saber) que por trás tem uma query SQL.

```typescript
export interface Aluno { id: number; nome: string; email: string; curso: string; }

export async function listarTodos(db: Client): Promise<Aluno[]> {
  const resultado = await db.execute("SELECT id, nome, email, curso FROM alunos ORDER BY id");
  return resultado.rows as unknown as Aluno[];
}
```

Rotas Express (aula09) chamam o repository, nunca executam SQL diretamente. Assim, trocar SQLite por outro banco no futuro afeta só o repository, não as rotas.

### O que revisar em SQL gerado por IA

Ao pedir a um agente para implementar `criar`, `buscarPorId` ou `remover`, revise especificamente:

1. **Usa `?` com `args`, ou concatena string?** Concatenação é injeção de SQL: critério de reprovação automática.
2. **Os tipos batem?** `resultado.rows` vem tipado de forma genérica; confirme que o cast para `Aluno[]`/`Aluno | null` corresponde às colunas selecionadas.
3. **Trata "não encontrado"?** um `buscarPorId` que não verifica `resultado.rows.length === 0` antes de acessar `rows[0]` pode devolver `undefined` silenciosamente em vez de `null` explícito.
4. **`email UNIQUE`:** o schema define `email TEXT NOT NULL UNIQUE`. Um `criar()` mal implementado deixa a violação de unicidade estourar como erro 500 cru, em vez de virar um 400 tratado (assunto da aula11).

---

## Atividades em sala

1. **Revisão de SQL gerado, guiada:** o professor mostra duas implementações de `buscarPorId` (uma concatenando string, outra com parâmetro) e a turma identifica qual é insegura, escrevendo o payload de `email` que quebraria a primeira.
2. **Implementação assistida:** cada aluno completa `buscarPorId`, `criar` e `remover` em `aula10-sqlite-repository/projeto-base`, seguindo o fluxo: teste primeiro (troca `it.todo` por `it()`), pede a implementação, revisa os 4 pontos acima antes de aceitar.

## Exercícios para casa

- **Exercício 1 (Tutor):** antes de implementar, peça à IA para explicar, sem gerar código, *"por que `WHERE email = '${email}'` é perigoso e `WHERE email = ?` não é"*, e confira se a explicação menciona escaping/parâmetros corretamente.
- **Exercício 2 (Par):** complete as 6 pendências de `aula10-sqlite-repository/projeto-base/test/repository.test.ts` e as funções correspondentes em `src/repository.ts`.
- **Exercício 3 (Par):** adicione `atualizar(db: Client, id: number, dados: Partial<NovoAluno>): Promise<Aluno | null>`. Teste primeiro, incluindo o caso de atualizar só um campo.

## Critério de entrega

- `npm test` passa sem nenhum `it.todo` restante.
- Nenhuma query no repository concatena valor vindo de fora diretamente na string SQL.
- Commit com uma frase, por função implementada, apontando algo que você corrigiu na versão gerada (ou confirmando que já veio segura).
