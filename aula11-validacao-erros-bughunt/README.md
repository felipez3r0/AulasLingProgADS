# Aula 11 - Validação, Erros e Middleware: Bug Hunt

**Modo de IA: Par** — nesta aula em particular, o "par" é encontrar e corrigir os defeitos; pode usar IA para explicar um trecho ou confirmar uma hipótese, mas o diagnóstico é seu.

## Objetivos da aula

- Validar payloads com Zod e devolver erros padronizados.
- Centralizar tratamento de erros num middleware, na ordem correta.
- **Encontrar, em código Express já escrito**, quatro classes de defeito comuns em código gerado por IA: validação ausente, erro engolido, middleware fora de ordem, referência compartilhada indevida.

## Leitura prévia (antes da aula)

- Instale as dependências compartilhadas desta aula: `cd aula11-validacao-erros-bughunt && npm install`.
- Rode `npm test` **antes** de olhar qualquer código-fonte e leia as mensagens de falha — cada uma delas é a pista do bug correspondente.

---

## Conteúdo

### Validação com Zod

```typescript
import { z } from "zod";

const ProdutoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  preco: z.number().positive("Preço deve ser positivo"),
});

const resultado = ProdutoSchema.safeParse(req.body);   // nunca lança exceção
if (!resultado.success) {
  res.status(400).json({ erro: "Dados inválidos", detalhes: resultado.error.issues });
  return;
}
// resultado.data já vem tipado e validado
```

### Erros customizados e middleware centralizado

```typescript
class ApiError extends Error {
  constructor(public statusCode: number, message: string) { super(message); }
}
class NotFoundError extends ApiError {
  constructor(recurso: string) { super(404, `${recurso} não encontrado`); }
}
```

```typescript
// Middleware de erro: 4 parâmetros, e DEVE ser registrado DEPOIS de todas as rotas.
app.use((erro: Error, req: Request, res: Response, next: NextFunction) => {
  if (erro instanceof ApiError) {
    res.status(erro.statusCode).json({ erro: erro.message });
    return;
  }
  res.status(500).json({ erro: "Erro interno do servidor" });
});
```

Rotas assíncronas repassam o erro com `next(erro)`, nunca engolindo:

```typescript
app.get("/produtos/:id", (req, res, next) => {
  const produto = produtos.find((p) => p.id === Number(req.params.id));
  if (!produto) { next(new NotFoundError("Produto")); return; }
  res.json(produto);
});
```

### As quatro classes de defeito desta aula

Todo código gerado por IA para uma API Express tende a repetir os mesmos erros. Esta aula planta um exemplo de cada um, isolado, para você reconhecer o padrão:

| Bug | Sintoma típico | O que procurar |
|---|---|---|
| `01-validacao-ausente` | Payload inválido é aceito (retorna 201 em vez de 400) | Rota `POST`/`PUT` que usa `req.body` direto, sem `schema.safeParse` |
| `02-erro-engolido` | Erro real vira um `200` genérico ou a requisição nunca responde | `catch` que só faz `console.log`/loga, sem `next(erro)` nem resposta correta |
| `03-middleware-fora-de-ordem` | Erro tratado errado (HTML em vez de JSON, ou status genérico) | Middleware de erro (4 parâmetros) registrado **antes** das rotas |
| `04-referencia-compartilhada` | Uma operação de "preview"/leitura corrompe o estado interno | Função que retorna/recebe um array ou objeto sem copiar (`[...x]` só copia um nível — objetos dentro continuam compartilhados) |

---

## Atividades em sala

1. **Bug hunt individual:** para cada pasta em `bugs/`, rode `npm test`, leia a falha, **antes de abrir o `src/`** escreva uma frase com a hipótese do que está errado, depois abra o código e confirme (ou corrija a hipótese).
2. **Correção e verificação:** corrija cada bug até `npm test` passar 100% (16 testes) e explique para o professor, em uma frase por bug, qual era a causa raiz — não só "eu adicionei uma validação", mas por que faltava.

## Exercícios para casa

- **Exercício 1 (Par):** corrija os 4 bugs desta pasta até `npm test` passar por completo.
- **Exercício 2 (Par):** peça a um agente de IA para gerar uma rota nova (`PUT /produtos/:id`) para `referencia/src/app.ts` — antes de aceitar, verifique deliberadamente se o código gerado comete algum dos 4 defeitos desta aula.
- **Exercício 3 (Tutor):** para o `04-referencia-compartilhada`, explique por que `return [...produtos]` sozinho **não** era suficiente — ligue a resposta com a aula03 (passagem por valor/referência).

## Critério de entrega

- `npm test` na raiz de `aula11-validacao-erros-bughunt` passa com 0 falhas (16/16).
- Commit por bug corrigido, mensagem descrevendo a causa raiz (não só "corrige bug 2").
- Resposta escrita do Exercício 3, ligando o bug 04 ao conteúdo da aula03.
