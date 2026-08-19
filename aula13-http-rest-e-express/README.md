# Aula 13 — HTTP, REST e Express

> **Módulo:** M4 — Agentes, API e projeto
> **Ementa oficial:** transversal (integra E1 a E7 num programa real)
> **Skills:** S6 (reforça), S3 (reforça)
> **Pré-requisitos:** Aulas 01 a 12

## Objetivos

- Entender HTTP: métodos, **status**, cabeçalhos e corpo
- Consumir APIs com `fetch` e `async`/`await`, tratando falhas de verdade
- Construir uma API REST com Express: rotas, parâmetros, query e middlewares
- **Testar endpoints** com supertest, sem abrir porta
- Skill de dev-com-IA: **status HTTP é contrato, e é onde a IA mais erra**

## Por que isso importa quando a IA escreve o código

Uma API gerada por IA quase sempre **responde**. As rotas existem, o JSON sai
formatado, o caminho feliz funciona. E quase sempre os **status estão errados**.

Isso não é detalhe cosmético. O status é a parte da resposta que as máquinas leem:

- **4xx** significa "você errou" — o cliente não deve tentar de novo com os mesmos dados.
- **5xx** significa "eu errei" — o cliente **deve** tentar de novo mais tarde.

Devolver `500` para um CPF mal digitado faz todo cliente bem escrito repetir para
sempre uma requisição que nunca vai funcionar. Devolver `200` com corpo `null` para
um recurso inexistente torna impossível distinguir "não existe" de "existe e está
vazio". Nada disso quebra nos seus testes de caminho feliz.

A segunda metade é o `fetch`: ele **não lança** para 404 nem para 500. Código gerado
esquece de checar `response.ok` com muita frequência, e então trata uma página de
erro como se fossem os dados.

## Antes de começar

```bash
npm test -- aula13     # exemplos desta aula: devem PASSAR
npm run ex -- aula13   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. HTTP em cinco minutos

```
REQUISIÇÃO                              RESPOSTA
POST /alunos HTTP/1.1                   HTTP/1.1 201 Created
Host: api.fatec.br                      Content-Type: application/json
Content-Type: application/json          Location: /alunos/3

{"nome":"Ana","ra":"111"}               {"id":"3","nome":"Ana","ra":"111"}
```

### Métodos

| Método | Uso | Repetir tem o mesmo efeito? |
| --- | --- | --- |
| `GET` | ler | sim |
| `POST` | criar | **não** — cria de novo |
| `PUT` | substituir | sim |
| `PATCH` | alterar parte | depende |
| `DELETE` | remover | sim |

### Status — a tabela que resolve 95% dos casos

| Código | Nome | Quando |
| --- | --- | --- |
| **200** | OK | deu certo, e há corpo |
| **201** | Created | criou; mande `Location` |
| **204** | No Content | deu certo, e **não** há corpo |
| **400** | Bad Request | o cliente mandou dado inválido |
| **401** | Unauthorized | não sei quem é você |
| **403** | Forbidden | sei quem é, e não pode |
| **404** | Not Found | não existe |
| **409** | Conflict | conflito de estado (RA duplicado, livro emprestado) |
| **422** | Unprocessable | sintaxe ok, semântica inválida |
| **500** | Server Error | **eu** falhei |

> **A regra que resolve a maior parte das dúvidas:** 4xx é culpa do cliente,
> 5xx é culpa sua. Se você consegue explicar ao usuário o que ele deve corrigir,
> é 4xx.

---

## 2. Consumir API com `fetch`

```typescript
// aula13-http-rest-e-express/exemplos/02-consumir-api.ts
const resposta = await buscar(url);

if (!resposta.ok) {                       // OBRIGATÓRIO
  throw new Error(`falha ao buscar: HTTP ${resposta.status}`);
}

const dados = await resposta.json();
```

**`fetch` não lança para 404 nem para 500.** Ele só rejeita quando a requisição nem
aconteceu — rede fora, DNS. Sem `if (!resposta.ok)`, um 500 vira `.json()` sobre uma
página de erro, e o programa segue com dados que não são dados.

### Paralelo

```typescript
await Promise.all(moedas.map((m) => buscarCotacao(m)));       // todas juntas
await Promise.allSettled(moedas.map((m) => buscarCotacao(m))); // tolera falhas
```

Um `for` com `await` dentro faz uma requisição de cada vez. Para dez chamadas
independentes, é dez vezes mais lento sem motivo.

### Injete o `fetch`

Repare que as funções do exemplo recebem `buscar: FuncaoBuscar = fetch`. Isso
permite ao teste substituí-lo por um falso — **código que chama a rede direto é
código que só dá para testar com a rede no ar**.

> **Quando a IA escreve isto:** três esquecimentos recorrentes — não checar
> `response.ok`, usar `for` com `await` onde cabia `Promise.all`, e chamar `fetch`
> direto em vez de recebê-lo, tornando a função impossível de testar.

**Verifique:** `npm test -- 02-consumir-api`

---

## 3. Express

```typescript
// aula13-http-rest-e-express/exemplos/api/app.ts
export function criarApp(alunosIniciais: Aluno[] = []) {
  const app = express();
  app.use(express.json());          // interpreta corpo JSON

  app.get("/alunos", (req, res) => res.json(alunos));

  app.get("/alunos/:id", (req, res) => {
    const aluno = alunos.find((a) => a.id === req.params.id);
    if (!aluno) return res.status(404).json({ erro: "aluno nao encontrado" });
    return res.json(aluno);
  });

  app.post("/alunos", (req, res) => {
    // ... validação ...
    return res.status(201).location(`/alunos/${aluno.id}`).json(aluno);
  });

  return app;                       // NÃO chama listen
}
```

### `criarApp` não abre porta — e isso é o ponto

Se `app.listen(3000)` estivesse dentro, cada teste precisaria subir um servidor
real, escolher porta livre e derrubá-lo depois. Separando, o teste importa a app e
faz requisições direto na memória.

**Esta é a decisão de arquitetura mais importante da aula**, e é a que código
gerado por IA quase nunca traz: o exemplo canônico de "API com Express" no texto de
treinamento tem `app.listen` no mesmo arquivo.

### De onde vêm os dados da requisição

| Origem | Como | Exemplo |
| --- | --- | --- |
| caminho | `req.params.id` | `/alunos/3` |
| query | `req.query.curso` | `/alunos?curso=ADS` |
| corpo | `req.body` | JSON do POST |
| cabeçalho | `req.headers` | `Authorization` |

`req.params` e `req.query` são **sempre string** — é a coerção da Aula 04
reaparecendo, agora na fronteira do sistema.

### Middlewares

```typescript
app.use((req, res, proximo) => {
  // roda antes das rotas
  proximo();                      // esquecer isto trava a requisição
});
```

Registro, autenticação, tratamento de erro. A ordem de registro é a ordem de
execução — e o `404` genérico tem que vir **depois** de todas as rotas.

**Verifique:** `npm test -- 01-api-rest`

---

## 4. Testar endpoints

```typescript
import request from "supertest";

const r = await request(criarApp(dados)).get("/alunos?curso=ADS");
expect(r.status).toBe(200);
expect(r.body).toHaveLength(1);
```

O que testar em cada rota:

1. **Status** — o número certo para cada situação.
2. **Corpo** — a forma dos dados.
3. **Cabeçalhos** — `Location` no 201, `Content-Type`.
4. **Efeito** — depois do POST, o recurso aparece no GET?
5. **Erros** — 400, 404, 409 com a mensagem certa.

> O item 4 é o que separa teste de rota de teste de verdade. Um POST pode devolver
> 201 e não ter guardado nada.

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"cria uma API REST de produtos com Express"*

```typescript
// aula13-http-rest-e-express/exemplos/leitura-critica/gerado-pela-ia.ts
app.get("/produtos/:id", (req, res) => {
  const produto = produtos.find((p) => p.id === req.params.id);
  return res.json(produto ?? null);                       // sempre 200
});

app.post("/produtos", (req, res) => {
  // ... sem validação ...
  return res.json(produto);                                // 200, sem Location
});

app.put("/produtos/:id", (req, res) => {
  if (!produto) return res.status(500).json({ erro: "produto nao encontrado" });
  if (typeof preco !== "number") return res.status(500).json({ erro: "preco invalido" });
});
```

**Antes de rodar**, preencha:

| Situação | Status devolvido | Status correto | Consequência para o cliente |
| --- | --- | --- | --- |
| `GET /produtos/999` | | | |
| `POST` com sucesso | | | |
| `PUT` com preço `"caro"` | | | |
| `PUT` em id inexistente | | | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta — todas as rotas respondem, e todos os status estão errados.**
>
> `GET` de id inexistente devolve **200 com `null`**. O cliente não consegue
> distinguir "não existe" de "existe e é nulo" sem inspecionar o corpo — que é
> exatamente o trabalho que o status existe para evitar.
>
> `POST` devolve **200 sem `Location`**, e aceita corpo vazio criando um produto de
> nome `""` e preço `0`. A validação simplesmente não existe.
>
> `PUT` devolve **500 para erro do cliente**. Este é o mais grave dos três: um
> cliente bem escrito interpreta 5xx como "problema temporário do servidor" e
> **tenta de novo**. Com preço inválido devolvendo 500, ele vai repetir para sempre
> uma requisição que nunca vai funcionar — e você vai ver o tráfego subir sem
> entender por quê.
>
> Documentado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`. Corrigir é o
> exercício 🚫 1.
>
> Sobre a pergunta 3: faltava a **tabela de status como parte da especificação**.
> "Cria uma API REST" não diz que 404 é para inexistente e 409 para conflito. Um
> pedido bom lista, rota por rota, qual status para qual situação — exatamente como
> está escrito no arquivo do exercício 1.

---

## Verificação: como provar que funciona

- **Invariantes desta aula:**
  - nenhuma rota devolve 200 para recurso inexistente;
  - nenhum erro do cliente devolve 5xx;
  - todo 201 traz `Location`;
  - todo `fetch` checa `response.ok`.
- **Casos de borda obrigatórios:** id inexistente · corpo vazio · tipo errado no
  corpo · query param inválido · rota inexistente

```typescript
it("preco invalido da 400, nao 500", async () => {
  expect((await api().put("/produtos/1").send({ preco: "caro" })).status).toBe(400);
});

it("o criado aparece na listagem", async () => {
  await request(app).post("/produtos").send({ nome: "Regua", preco: 4 });
  expect((await request(app).get("/produtos")).body).toHaveLength(3);
});
```

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Criar API | "cria uma API REST de produtos" | "Rotas e status: GET lista 200; GET id 200 ou 404; POST 201 com Location, 400 inválido, 409 duplicado; DELETE 204 ou 404." | A tabela de status **é** a especificação |
| Estruturar | "faz o servidor Express" | "Exporte `criarApp()` sem chamar `listen`, para que os testes usem supertest." | A decisão que torna testável |
| Consumir API | "busca os dados da API" | "Cheque `response.ok`; 404 é caso previsto, não erro. Receba `fetch` como parâmetro." | Os dois esquecimentos clássicos |
| Revisar | "tá certo?" | "Para cada rota, liste a situação e o status devolvido. Algum erro do cliente devolve 5xx?" | Pergunta pelo defeito específico |

**Ferramenta por ferramenta**

- *Copilot inline:* bom nos handlers depois que o padrão está estabelecido; vai sugerir `listen` no mesmo arquivo.
- *Copilot Chat:* peça a tabela situação → status da sua API e confira contra o código.
- *Chat de navegador:* bom para entender qual status usar num caso duvidoso.
- *Agente:* exercício 3 — uma API inteira com dois recursos relacionados.

---

## Git desta aula: commits semânticos

```bash
git commit -m "feat: adiciona rota GET /produtos com filtro por preco"
git commit -m "fix: devolve 404 em vez de 200 para produto inexistente"
git commit -m "test: cobre status de erro do POST /produtos"
git commit -m "refactor: extrai validacao de preco"
```

| Prefixo | Uso |
| --- | --- |
| `feat` | funcionalidade nova |
| `fix` | correção |
| `test` | só testes |
| `refactor` | muda estrutura, não comportamento |
| `chore` | infra, dependências |

> **Rede de segurança:** com commits semânticos, `git log --oneline` vira o
> changelog da sua API — e é o que você lê antes de abrir o PR.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Status corretos**
Arquivo: `exercicios/01-status-corretos.ts` · Teste: `npm run ex -- 01-status-corretos`

- Implemente a API de produtos com o contrato de status escrito no arquivo.
- Atenção: preço `0` é válido; preço negativo não. Nome duplicado é **409**, não 400.
- **Aceite:** os 20 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Cliente HTTP tolerante**
Arquivo: `exercicios/02-cliente-http.ts` · Teste: `npm run ex -- 02-cliente-http`

- O Copilot vai direto de `await fetch(...)` para `.json()`. **Ele esquece
  `response.ok`.** Aqui isso é o exercício inteiro: 404 é caso previsto, 500 é falha.
- Requisições em paralelo, e a função nunca rejeita — toda falha vira dado.
- **Aceite:** os 12 testes verdes **e** você consegue explicar cada classificação.

### 🤖 Com agente — você especifica e revisa

**3. API de biblioteca**
Arquivo: `exercicios/03-api-biblioteca.ts` · Spec: `exercicios/03-api-biblioteca.spec.md`

- Dois recursos **relacionados**: emprestar um livro muda o livro. É onde a
  consistência escapa.
- A ordem das validações importa: livro inexistente é 404, indisponível é 409.
  Inverter muda a resposta.
- **Aceite:** os 21 testes verdes **e** as 5 perguntas de revisão respondidas.

---

## Autoavaliação

- [ ] Sei escolher entre 200, 201, 204, 400, 404, 409 e 500.
- [ ] Sei explicar por que 5xx para erro do cliente causa retentativa infinita.
- [ ] Sempre checo `response.ok` depois de um `fetch`.
- [ ] Sei por que `criarApp` não deve chamar `listen`.
- [ ] Testo o efeito da rota, não só o status.
- [ ] Achei os três defeitos da leitura crítica sem rodar o código.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| 200 para inexistente | cliente não distingue vazio de ausente | 404 |
| 500 para erro do cliente | retentativa infinita | 4xx |
| 201 sem `Location` | cliente não sabe onde está o recurso | `.location(...)` |
| `fetch` sem `response.ok` | página de erro tratada como dado | Cheque sempre |
| `listen` dentro de `criarApp` | impossível testar | Separe app de servidor |
| `express.json()` esquecido | `req.body` vem `undefined` | Registre o middleware |
| Middleware sem `proximo()` | requisição trava sem resposta | Chame `proximo()` |
| 404 genérico antes das rotas | tudo vira 404 | Registre por último |

---

## Resumo

Uma API gerada por IA quase sempre responde e quase sempre erra os status — e status
é a parte da resposta que as máquinas leem. 4xx diz "você errou"; 5xx diz "eu errei,
tente de novo", então devolver 500 para um dado inválido faz clientes bem escritos
repetirem para sempre uma requisição que nunca vai funcionar. Do lado do cliente,
o esquecimento equivalente é `response.ok`: `fetch` não lança para 404 nem para 500,
e sem essa checagem uma página de erro vira dado. E a decisão de arquitetura que
código gerado quase nunca traz é separar `criarApp` de `listen` — é ela que permite
testar a API inteira sem abrir porta, e sem ela seus testes de endpoint não existem.

---

## Leitura complementar

- [MDN — Status HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status)
- [MDN — Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [Express — Guia de rotas](https://expressjs.com/pt-br/guide/routing.html)
- [supertest](https://github.com/ladjs/supertest)
