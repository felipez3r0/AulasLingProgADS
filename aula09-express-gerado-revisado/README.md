# Aula 12 - Express: Servidor e Rotas

## Objetivos da Aula

- Entender o que é o Express e por que utilizá-lo
- Criar um servidor HTTP com Express
- Definir rotas para diferentes endpoints
- Receber e enviar dados em JSON
- Usar parametros de rota e query strings

---

## 1. O que é o Express?

**Express** é o framework web mais popular do Node.js. Ele simplifica a criação de servidores HTTP e APIs.

Sem Express, criar um servidor HTTP em Node puro seria muito verboso. O Express abstrai a complexidade e oferece:

- Roteamento simples e poderoso
- Middlewares (veremos na próxima aula)
- Fácil integração com JSON
- Enorme ecossistema de plugins

---

## 2. Setup do Projeto

### 2.1 Criando o projeto

```bash
mkdir api-alunos
cd api-alunos
npm init -y

# Dependencias de producao
npm install express

# Dependencias de desenvolvimento
npm install -D typescript @types/node @types/express tsx
```

### 2.2 tsconfig.json

```bash
npx tsc --init
```

Ajuste:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### 2.3 Scripts no package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 2.4 Estrutura inicial

```
api-alunos/
  src/
    server.ts
  package.json
  tsconfig.json
```

---

## 3. Primeiro Servidor

```typescript
// src/server.ts
import express from "express";

const app = express();
const PORT = 3000;

// Middleware para ler JSON no body das requisições
app.use(express.json());

// Rota raiz
app.get("/", (req, res) => {
  res.json({ mensagem: "API funcionando!" });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

Execute:

```bash
npm run dev
```

Teste no navegador ou terminal:

```bash
curl http://localhost:3000
# {"mensagem":"API funcionando!"}
```

> O `tsx watch` reinicia automaticamente quando você salva alterações.

---

## 4. Rotas e Métodos HTTP

### 4.1 Rotas básicas

```typescript
// GET - Listar
app.get("/alunos", (req, res) => {
  res.json(alunos);
});

// GET - Buscar por ID
app.get("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);
  const aluno = alunos.find((a) => a.id === id);

  if (!aluno) {
    res.status(404).json({ erro: "Aluno não encontrado" });
    return;
  }

  res.json(aluno);
});

// POST - Criar
app.post("/alunos", (req, res) => {
  const { nome, email, nota } = req.body;
  const novoAluno = { id: proximoId++, nome, email, nota };
  alunos.push(novoAluno);
  res.status(201).json(novoAluno);
});

// PUT - Atualizar
app.put("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = alunos.findIndex((a) => a.id === id);

  if (indice === -1) {
    res.status(404).json({ erro: "Aluno não encontrado" });
    return;
  }

  alunos[indice] = { ...alunos[indice], ...req.body };
  res.json(alunos[indice]);
});

// DELETE - Remover
app.delete("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = alunos.findIndex((a) => a.id === id);

  if (indice === -1) {
    res.status(404).json({ erro: "Aluno não encontrado" });
    return;
  }

  alunos.splice(indice, 1);
  res.status(204).send();
});
```

### 4.2 Parametros de rota

```typescript
// :id é um parâmetro de rota
app.get("/alunos/:id", (req, res) => {
  const id = req.params.id;  // string! Precisa converter
  console.log(`Buscando aluno ${id}`);
});

// Múltiplos parâmetros
app.get("/turmas/:turmaId/alunos/:alunoId", (req, res) => {
  const { turmaId, alunoId } = req.params;
  // ...
});
```

### 4.3 Query strings

Query strings são parâmetros na URL após `?`:

```
GET /alunos?curso=ADS&aprovado=true
```

```typescript
app.get("/alunos", (req, res) => {
  let resultado = alunos;

  // Filtrar por curso (se informado)
  if (req.query.curso) {
    resultado = resultado.filter((a) => a.curso === req.query.curso);
  }

  // Filtrar por aprovação
  if (req.query.aprovado === "true") {
    resultado = resultado.filter((a) => a.nota >= 6);
  }

  res.json(resultado);
});
```

---

## 5. Exemplo Completo - API de Alunos

```typescript
// src/server.ts
import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Tipos ---
interface Aluno {
  id: number;
  nome: string;
  email: string;
  curso: string;
  nota: number;
}

// --- Dados em memoria ---
let proximoId = 4;
const alunos: Aluno[] = [
  { id: 1, nome: "Ana Silva", email: "ana@email.com", curso: "ADS", nota: 8.5 },
  { id: 2, nome: "Bruno Costa", email: "bruno@email.com", curso: "ADS", nota: 6.0 },
  { id: 3, nome: "Carlos Lima", email: "carlos@email.com", curso: "SI", nota: 9.2 },
];

// --- Rotas ---

// Listar todos (com filtro opcional por curso)
app.get("/alunos", (req: Request, res: Response) => {
  let resultado = alunos;

  if (req.query.curso) {
    resultado = resultado.filter(
      (a) => a.curso.toLowerCase() === String(req.query.curso).toLowerCase()
    );
  }

  res.json(resultado);
});

// Buscar por ID
app.get("/alunos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const aluno = alunos.find((a) => a.id === id);

  if (!aluno) {
    res.status(404).json({ erro: "Aluno não encontrado" });
    return;
  }

  res.json(aluno);
});

// Criar novo aluno
app.post("/alunos", (req: Request, res: Response) => {
  const { nome, email, curso, nota } = req.body;

  if (!nome || !email || !curso || nota === undefined) {
    res.status(400).json({ erro: "Campos obrigatórios: nome, email, curso, nota" });
    return;
  }

  const novoAluno: Aluno = {
    id: proximoId++,
    nome,
    email,
    curso,
    nota,
  };

  alunos.push(novoAluno);
  res.status(201).json(novoAluno);
});

// Atualizar aluno
app.put("/alunos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const indice = alunos.findIndex((a) => a.id === id);

  if (indice === -1) {
    res.status(404).json({ erro: "Aluno não encontrado" });
    return;
  }

  const { nome, email, curso, nota } = req.body;
  alunos[indice] = { id, nome, email, curso, nota };
  res.json(alunos[indice]);
});

// Remover aluno
app.delete("/alunos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const indice = alunos.findIndex((a) => a.id === id);

  if (indice === -1) {
    res.status(404).json({ erro: "Aluno não encontrado" });
    return;
  }

  alunos.splice(indice, 1);
  res.status(204).send();
});

// --- Iniciar servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET    /alunos`);
  console.log(`  GET    /alunos/:id`);
  console.log(`  POST   /alunos`);
  console.log(`  PUT    /alunos/:id`);
  console.log(`  DELETE /alunos/:id`);
});
```

---

## 6. Testando a API

### 6.1 Com curl no terminal

```bash
# Listar todos
curl http://localhost:3000/alunos

# Buscar por ID
curl http://localhost:3000/alunos/1

# Filtrar por curso
curl "http://localhost:3000/alunos?curso=ADS"

# Criar aluno
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -d '{"nome": "Diana", "email": "diana@email.com", "curso": "ADS", "nota": 7.5}'

# Atualizar aluno
curl -X PUT http://localhost:3000/alunos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana Silva", "email": "ana@email.com", "curso": "ADS", "nota": 9.0}'

# Remover aluno
curl -X DELETE http://localhost:3000/alunos/2
```

### 6.2 Com Thunder Client (VS Code)

1. Instale a extensao **Thunder Client**
2. Crie requisicoes visuais para cada endpoint
3. Salve como colecao para reutilizar

---

## 7. Organizando Melhor - Router

Para APIs maiores, separe as rotas em arquivos:

```typescript
// src/routes/alunos.ts
import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  // listar alunos
});

router.get("/:id", (req: Request, res: Response) => {
  // buscar por id
});

// ... demais rotas

export default router;
```

```typescript
// src/server.ts
import express from "express";
import alunosRouter from "./routes/alunos";

const app = express();
app.use(express.json());

// Todas as rotas de /alunos
app.use("/alunos", alunosRouter);

app.listen(3000);
```

---

## 8. Git - Commits semânticos para APIs

Ao construir uma API, use commits descritivos:

```bash
git commit -m "Configura projeto Express com TypeScript"
git commit -m "Adiciona rota GET /alunos para listar todos"
git commit -m "Adiciona rota GET /alunos/:id com tratamento 404"
git commit -m "Adiciona rota POST /alunos com validação básica"
git commit -m "Adiciona rotas PUT e DELETE para alunos"
git commit -m "Adiciona filtro por curso via query string"
```

---

## Exercícios Práticos

### Exercício 1 - API básica
Siga o tutorial completo da seção 5 e crie a API de alunos. Teste todos os endpoints com curl ou Thunder Client.

### Exercício 2 - API de produtos
Crie uma API de produtos com:
1. `GET /produtos` - listar (com filtro por categoria via query)
2. `GET /produtos/:id` - buscar por ID
3. `POST /produtos` - criar (valide campos obrigatórios)
4. `PUT /produtos/:id` - atualizar
5. `DELETE /produtos/:id` - remover

### Exercício 3 - Estatísticas
Adicione a rota `GET /alunos/stats` que retorne:
```json
{
  "total": 10,
  "mediaGeral": 7.5,
  "aprovados": 8,
  "reprovados": 2,
  "melhorNota": { "nome": "Carlos", "nota": 9.2 },
  "piorNota": { "nome": "Diana", "nota": 4.5 }
}
```

### Exercício 4 - Organizar com Router
Refatore o Exercício 2 separando as rotas em arquivo próprio usando `Router`.

---

## Dica: IA e Express

1. **Gerar rotas rapidamente:**
   Escreva a interface e o Copilot gera as rotas CRUD:
   ```typescript
   // CRUD completo para a interface Produto
   ```

2. **Testar com curl:**
   Peça ao Copilot: *"Gere comandos curl para testar todas as rotas dessa API"*

3. **Debugar erros HTTP:**
   *"Minha rota POST retorna 404, o que pode estar errado?"*

> **Cuidado:** O Copilot pode gerar código que não valida inputs. Sempre adicione validações básicas (campos obrigatórios, tipos corretos).

---

## Leitura Complementar

- [Express - Documentação](https://expressjs.com/)
- [Express - Routing Guide](https://expressjs.com/en/guide/routing.html)
