# Aula 09 - Express: Gerado e Revisado

**Modo de IA: Par** — você guia o agente a partir do contrato e dos testes; a aula é revisar o que foi gerado.

## Objetivos da aula

- Configurar um servidor Express mínimo.
- Guiar um agente de IA a implementar rotas **a partir de um contrato e de testes já escritos**, não de uma descrição solta.
- Revisar código Express gerado: os status codes batem com o contrato? o formato de erro é consistente? algo foi esquecido?

## Leitura prévia (antes da aula)

- Tenha em mãos o contrato da API de "produtos" que você escreveu no Exercício 2 da aula08 — ele é matéria-prima da aula.
- Instale as dependências do projeto-base: `cd aula09-express-gerado-revisado/projeto-base && npm install`, rode `npm test` e confira que passa (1 real + 8 pendentes) antes de vir para a aula.

---

## Conteúdo

### Um servidor Express mínimo

```typescript
import express from "express";

const app = express();
app.use(express.json());   // necessário para ler req.body em JSON

app.get("/alunos", (req, res) => {
  res.json([{ id: 1, nome: "Ana" }]);
});

app.listen(3000, () => console.log("Servidor em http://localhost:3000"));
```

Rota com parâmetro e verificação de existência:

```typescript
app.get("/alunos/:id", (req, res) => {
  const aluno = alunos.find((a) => a.id === Number(req.params.id));
  if (!aluno) {
    res.status(404).json({ erro: "Aluno não encontrado" });
    return;
  }
  res.json(aluno);
});
```

### Testando um endpoint sem lib extra

`projeto-base/test/server.test.ts` sobe o servidor numa porta efêmera (`listen(0)`) e usa `fetch` nativo — sem `supertest` nem outra dependência de teste HTTP:

```typescript
beforeAll(() => new Promise<void>((resolve) => {
  server = createApp().listen(0, () => {
    const { port } = server.address() as { port: number };
    baseUrl = `http://localhost:${port}`;
    resolve();
  });
}));

it("retorna a lista de alunos", async () => {
  const resposta = await fetch(`${baseUrl}/alunos`);
  expect(resposta.status).toBe(200);
});
```

### O fluxo desta aula

1. **Releia o contrato** que você escreveu na aula08 (endpoints, payloads, erros).
2. **Escreva o teste do endpoint** antes de pedir a implementação — troque o `it.todo` correspondente por um `it()` real, cobrindo o caminho feliz **e** pelo menos um erro (404 ou 400).
3. **Peça ao agente de IA para implementar a rota** em `src/server.ts`, colando o trecho do contrato e o teste — não uma frase solta tipo "faz um CRUD de alunos".
4. **Rode `npm test`.** Se passou, **revise antes de aceitar**:
   - Os status codes batem com o contrato (201 na criação, não 200; 204 no delete, não 200)?
   - O formato do corpo de erro é `{ erro: "..." }` consistente com as outras rotas, ou o agente inventou outro formato?
   - Existe validação de payload, ou a rota assume que `req.body` sempre vem certo?

---

## Atividades em sala

1. **Contrato → teste → geração, guiado:** cada aluno completa **uma** rota (`GET /alunos/:id` ou `POST /alunos`) seguindo o fluxo de 4 passos acima, com o professor circulando.
2. **Revisão cruzada rápida:** troque a rota implementada com um colega; ele tenta, só lendo o código (sem rodar), apontar se o status code e o formato de erro batem com o contrato original.

## Exercícios para casa

- **Exercício 1 (Par):** complete as 8 rotas pendentes de `aula09-express-gerado-revisado/projeto-base` seguindo o fluxo desta aula.
- **Exercício 2 (Par):** a partir do contrato de "produtos" da aula08, crie um novo `projeto-base`-like (pode copiar a estrutura desta pasta) e gere as rotas de produtos do zero, contrato → teste → geração.
- **Exercício 3 (Tutor):** depois de aceitar uma rota gerada, pergunte à IA (sem pedir para reescrever) *"que validação essa rota está deixando de fazer?"* e confira a resposta contra o próprio contrato — o agente pode ter esquecido algo que o contrato pedia.

## Critério de entrega

- `npm test` passa sem nenhum `it.todo` restante.
- Cada rota tem pelo menos um teste de erro, não só o caminho feliz.
- Commit com uma frase, por rota, dizendo o que você teve que corrigir na implementação gerada (ou "aceitei como veio" — e por quê isso era seguro).
