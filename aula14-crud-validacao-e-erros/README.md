# Aula 14 — CRUD, validação e tratamento de erros

> **Módulo:** M4 — Agentes, API e projeto
> **Ementa oficial:** transversal (integra E1 a E7; reforça E6 e E7)
> **Skills:** S7 (reforça), S10 (reforça), S5 (reforça)
> **Pré-requisitos:** Aulas 01 a 13

## Objetivos

- Validar entrada com **Zod**, derivando o tipo do esquema
- Separar **rotas, serviço e repositório** — cada camada com uma responsabilidade
- Centralizar o tratamento de erro num middleware, com erros de domínio
- Persistir em arquivo com escrita atômica
- Proteger contra **vazamento de dados** e **mass assignment**
- Skill de dev-com-IA: **a fronteira do sistema é onde a IA erra com consequência**

## Por que isso importa quando a IA escreve o código

Nas aulas anteriores, um erro de código gerado dava resposta errada. Aqui ele
**expõe dados de outras pessoas**.

Três defeitos aparecem com regularidade quase mecânica em APIs geradas:

1. **`res.json(usuario)`** — devolve o objeto inteiro do banco, com hash de senha,
   CPF e o que mais estiver lá. Ninguém pediu; ninguém percebe, porque o teste só
   verifica se o nome está certo.
2. **`{ ...padroes, ...req.body }`** — o corpo da requisição sobrescreve tudo o que
   o servidor definiu, incluindo `admin: false`. Chama-se *mass assignment*, e é
   como um cadastro comum vira uma conta de administrador.
3. **`res.status(500).json({ erro: e.message, stack: e.stack })`** — devolve ao
   cliente a estrutura de pastas do servidor e a mensagem interna do erro.

Nenhum dos três quebra um teste de caminho feliz. Todos os três são **a mesma
falha de base**: tratar a fronteira do sistema como se fosse código interno. A
validação existe justamente para marcar onde termina o mundo confiável.

## Antes de começar

```bash
npm test -- aula14     # exemplos desta aula: devem PASSAR
npm run ex -- aula14   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Validação com Zod

```typescript
// aula14-crud-validacao-e-erros/exemplos/api/esquemas.ts
export const esquemaTarefaNova = z.object({
  titulo: z.string().trim().min(3, "titulo precisa de ao menos 3 caracteres").max(100),
  prioridade: z.enum(["baixa", "media", "alta"]),
  responsavel: z.string().trim().min(1),
  prazoEmDias: z.number().int().positive().max(365).optional(),
});

export type TarefaNova = z.infer<typeof esquemaTarefaNova>;
```

**O tipo é derivado do esquema, não escrito à parte.** Isso elimina a classe de bug
mais chata desse território: o tipo e a validação discordarem depois de uma
alteração — o tipo diz que `prioridade` aceita `"urgente"`, a validação recusa, e o
compilador não vê problema nenhum.

Uma fonte da verdade, não duas.

| Método | Efeito |
| --- | --- |
| `.parse(x)` | devolve os dados válidos ou **lança** `ZodError` |
| `.safeParse(x)` | devolve `{ success, data }` ou `{ success, error }` |
| `.trim()`, `.min()`, `.max()` | transformam e restringem |
| `.optional()` | campo pode faltar |
| `.partial()` | todos opcionais — útil para `PATCH` |
| `.superRefine()` | regras que envolvem mais de um campo |

> **Quando a IA escreve isto:** Zod é uma biblioteca que modelos conhecem bem, e
> mesmo assim inventam métodos com frequência (`z.string().email()` mudou entre
> versões; `.nonempty()` foi depreciado). **Confira cada método na documentação da
> versão que você está usando** — é o conselho da Aula 09 aplicado aqui.

**Verifique:** `npm test -- 01-crud-validado`

---

## 2. Camadas

```
requisicao
    │
    ▼
┌─────────────┐   traduz HTTP, valida com o esquema
│   rotas     │   NÃO tem regra de negócio
└──────┬──────┘
       ▼
┌─────────────┐   regras de negócio
│   serviço   │   NÃO sabe que HTTP existe
└──────┬──────┘
       ▼
┌─────────────┐   lê e grava
│ repositório │   NÃO sabe o que é uma tarefa
└─────────────┘
```

O serviço lança `NaoEncontrado`; **quem traduz para 404 é o middleware de erro**.
Assim a regra de negócio pode ser testada sem HTTP, e a mesma regra serviria a uma
interface de linha de comando.

```typescript
// aula14-crud-validacao-e-erros/exemplos/api/servico.ts
criar(dados: TarefaNova): Tarefa {
  const ativas = tarefas.filter((t) => t.responsavel === dados.responsavel && !t.concluida).length;
  if (ativas >= LIMITE_ATIVAS_POR_RESPONSAVEL) {
    throw new Conflito("limite de tarefas ativas atingido");
  }
  // ...
}
```

Repare que a rota correspondente tem quatro linhas: valida, chama o serviço,
responde. **Rota gorda é sinal de que a regra ficou no lugar errado.**

---

## 3. Erros de domínio e middleware centralizado

```typescript
// aula14-crud-validacao-e-erros/exemplos/api/erros.ts
export class ErroDaApi extends Error {
  constructor(mensagem: string, readonly status: number, readonly detalhes?: unknown) { /* ... */ }
}
export class NaoEncontrado extends ErroDaApi { /* 404 */ }
export class Conflito extends ErroDaApi { /* 409 */ }
```

```typescript
// O ÚNICO lugar que decide status a partir de erro:
app.use((erro: unknown, _req, res, _proximo) => {
  if (erro instanceof ZodError) {
    return res.status(400).json({ erro: "dados invalidos", problemas: formatarErros(erro) });
  }
  if (erro instanceof ErroDaApi) {
    return res.status(erro.status).json({ erro: erro.message, detalhes: erro.detalhes });
  }
  return res.status(500).json({ erro: "erro interno" });   // NÃO vaza a mensagem
});
```

Três coisas a notar:

- O middleware de erro tem **quatro** parâmetros. É assim que o Express o reconhece;
  com três, ele vira um middleware comum e nunca recebe erro.
- Erro **não previsto** vira `500` com mensagem genérica. A mensagem real vai para o
  log do servidor, não para o cliente.
- As rotas capturam e chamam `proximo(erro)`. Nenhuma delas decide status sozinha.

> **Uma nota de português que vale código.** Em `NaoEncontrado`, a mensagem é
> recebida pronta em vez de montada como `` `${recurso} nao encontrado` `` — porque
> concordância de gênero não sai de concatenação: "tarefa não encontrad**o**" está
> errado. É um erro que aparece muito em código gerado, já que o padrão em inglês
> (`not found` para tudo) funciona e o equivalente em português não.

---

## 4. Persistência

```typescript
// aula14-crud-validacao-e-erros/exemplos/02-persistencia.ts
export async function salvar(caminho: string, tarefas: Tarefa[]): Promise<void> {
  await mkdir(dirname(caminho), { recursive: true });
  const temporario = `${caminho}.tmp`;
  await writeFile(temporario, JSON.stringify(tarefas, null, 2), "utf8");
  await rename(temporario, caminho);          // atômico
}
```

É a Aula 10 aplicada: arquivo ausente é estado inicial; arquivo **corrompido**
lança, nunca vira lista vazia; escrita é atômica. O repositório esconde tudo isso —
trocar por um banco de verdade muda só este módulo.

**Verifique:** `npm test -- 02-persistencia`

---

## 5. Segredos e configuração

```typescript
const porta = Number(process.env["PORT"] ?? 3000);
const chave = process.env["API_KEY"];
if (!chave) throw new Error("API_KEY nao configurada");
```

```gitignore
.env
.env.*
!.env.example
```

Versione um `.env.example` com os **nomes** das variáveis e valores falsos. Nunca o
`.env` real. E se vazar: **revogue a credencial primeiro**, limpe o histórico depois.

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"adiciona validação e tratamento de erros na minha API"*

```typescript
// aula14-crud-validacao-e-erros/exemplos/leitura-critica/gerado-pela-ia.ts
app.get("/usuarios/:id", (req, res, proximo) => {
  const usuario = usuarios.find((u) => u.id === req.params.id);
  if (!usuario) throw new Error("usuario nao encontrado");
  res.json(usuario);                                  // objeto INTEIRO
});

app.post("/usuarios", (req, res) => {
  const usuario = { id: ..., senhaHash: "", cpf: "", admin: false, ...req.body };
  //                                                                ^^^^^^^^^^^
});

app.use((erro, _req, res, _proximo) => {
  res.status(500).json({ erro: erro.message, stack: erro.stack });
});
```

**Antes de rodar**, responda:

| Requisição | O que o cliente recebe | Deveria receber |
| --- | --- | --- |
| `GET /usuarios/1` | | |
| `POST` com `{ email, admin: true }` | | |
| `POST` com `{ email, id: "999" }` | | |
| `GET /usuarios/999` | | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta — três falhas, todas de fronteira.**
>
> **Vazamento.** `res.json(usuario)` devolve `senhaHash` e `cpf` para qualquer um
> que chame a rota. O objeto do banco não é o objeto da resposta, e tratar os dois
> como o mesmo é o defeito mais comum de API gerada.
>
> **Mass assignment.** `{ ...padroes, ...req.body }` espalha o corpo **depois** dos
> valores padrão, então qualquer campo enviado sobrescreve o que o servidor
> definiu. `{ email: "x@f.br", admin: true }` cria um administrador. Também dá para
> escolher o próprio `id` e injetar campos que nem existem no modelo. A ordem do
> spread é literalmente a vulnerabilidade.
>
> **Erro exposto.** `500` para recurso inexistente (deveria ser 404) **e** o stack
> trace devolvido ao cliente, entregando caminhos de arquivo do servidor.
>
> Documentado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`. Corrigir é o
> exercício 🚫 1.
>
> Sobre a pergunta 3: faltava **"nunca devolva o objeto do banco; monte a resposta
> com os campos permitidos"**, **"aceite apenas os campos do esquema e ignore o
> resto"** e **"erro não previsto responde 500 com mensagem genérica"**. Nenhuma
> dessas três vem de graça, e nenhuma quebra um teste de caminho feliz.

---

## Verificação: como provar que funciona

- **Invariantes desta aula:**
  - nenhuma resposta contém campo que o cliente não deveria ver;
  - nenhum campo do corpo da requisição chega ao modelo sem passar pelo esquema;
  - nenhuma resposta de erro traz `stack` ou mensagem interna;
  - toda escrita é atômica; arquivo corrompido nunca vira lista vazia.
- **Casos de borda obrigatórios:** corpo vazio · campo extra · tipo errado ·
  duplicado · arquivo ausente · arquivo corrompido

```typescript
it("GET lista sem senhaHash nem cpf", async () => {
  for (const u of (await api().get("/usuarios")).body) {
    expect(u.senhaHash).toBeUndefined();
    expect(u.cpf).toBeUndefined();
  }
});

it("admin enviado pelo cliente e ignorado", async () => {
  const r = await api().post("/usuarios").send({ email: "x@f.br", senha: "senhaforte1", admin: true });
  expect(r.body.admin).toBe(false);
});
```

> **Escreva o teste do campo que não deve aparecer.** É o único jeito de pegar
> vazamento: nenhum teste de caminho feliz repara em campo a mais.

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Responder um recurso | "devolve o usuário" | "Monte a resposta com apenas `{ id, email, admin }`. Nunca devolva o objeto do banco." | Impede vazamento na origem |
| Criar recurso | "cria o usuário com os dados do corpo" | "Aceite apenas os campos do esquema; ignore os demais. `id` e `admin` são definidos pelo servidor." | Fecha o mass assignment |
| Tratar erro | "adiciona tratamento de erros" | "Middleware com 4 parâmetros. Erro de domínio vira seu status; erro não previsto vira 500 com mensagem genérica, sem stack." | Nomeia o que não pode vazar |
| Validar | "valida o corpo" | "Use Zod; derive o tipo com `z.infer`. Liste as regras por campo e as mensagens." | Uma fonte da verdade |
| Revisar | "tá seguro?" | "Que campo desta resposta o cliente não deveria ver? Que campo do corpo o cliente não deveria poder definir?" | As duas perguntas de segurança |

**Ferramenta por ferramenta**

- *Copilot inline:* bom para esquemas Zod repetitivos; confira os métodos que ele inventa.
- *Copilot Chat:* peça as duas perguntas de revisão acima sobre o seu próprio código.
- *Chat de navegador:* bom para desenhar as camadas antes de escrever.
- *Agente:* exercício 3 — API completa com persistência, o ensaio do projeto final.

---

## Git desta aula: Pull Request de verdade

```bash
git checkout -b feature/validacao-zod
git commit -m "feat: valida corpo do POST /tarefas com Zod"
git commit -m "feat: middleware de erro centralizado"
git commit -m "test: cobre vazamento de campos sensiveis"
git push -u origin feature/validacao-zod
```

Abra o PR e preencha o [template](../.github/pull_request_template.md) —
especialmente a seção **Riscos típicos de código gerado**, que existe exatamente
para os três defeitos desta aula.

> **Rede de segurança:** o CI deste repositório roda typecheck, testes e o
> verificador de estrutura a cada push. Um PR vermelho não vai para a `main`.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. API que não vaza**
Arquivo: `exercicios/01-api-segura.ts` · Teste: `npm run ex -- 01-api-segura`

- Corrija os três defeitos: vazamento, mass assignment, erro exposto.
- A chave é a função que converte `Usuario` em `UsuarioPublico` — **monte** a
  resposta em vez de devolver o objeto.
- **Aceite:** os 17 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Esquemas Zod**
Arquivo: `exercicios/02-esquemas-zod.ts` · Teste: `npm run ex -- 02-esquemas-zod`

- Inclui uma **regra cruzada**: modalidade presencial exige `local`. Precisa de
  `.superRefine`, e o erro tem que apontar para o campo `local`.
- Zod é onde a IA mais inventa método. **Confira cada um na documentação** antes de
  aceitar — se não existir, o erro só aparece em execução.
- **Aceite:** os 21 testes verdes **e** você consegue explicar cada refinamento.

### 🤖 Com agente — você especifica e revisa

**3. API com persistência**
Arquivo: `exercicios/03-api-persistida.ts` · Spec: `exercicios/03-api-persistida.spec.md`

- **`git status` limpo antes de soltar o agente** — esta tarefa escreve arquivos.
- É o ensaio do projeto final: rotas, validação, erros, persistência atômica.
- Uma pegadinha de rota: `/notas/media` precisa ser registrada **antes** de
  `/notas/:id`, ou `media` é capturado como se fosse um id.
- **Aceite:** os 26 testes verdes **e** as 6 perguntas de revisão respondidas.

---

## Autoavaliação

- [ ] Derivo o tipo do esquema Zod, em vez de escrever os dois.
- [ ] Sei separar rota, serviço e repositório, e sei dizer o que vai em cada um.
- [ ] Sei escrever um middleware de erro e por que ele precisa de 4 parâmetros.
- [ ] Monto a resposta com campos permitidos, em vez de devolver o objeto do banco.
- [ ] Sei o que é mass assignment e como a ordem do spread o causa.
- [ ] Achei os três defeitos da leitura crítica sem rodar o código.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| `res.json(objetoDoBanco)` | senha e CPF na resposta | Monte um objeto público |
| `{ ...padroes, ...req.body }` | cliente vira admin | Extraia só os campos do esquema |
| `stack` na resposta de erro | caminhos do servidor expostos | 500 genérico; detalhe vai para o log |
| Middleware de erro com 3 parâmetros | nunca recebe erro | São 4, sempre |
| Tipo escrito à parte do esquema | validação e tipo discordam | `z.infer` |
| Rota `/x/:id` antes de `/x/media` | `media` vira id | Rotas específicas primeiro |
| Regra de negócio na rota | impossível testar sem HTTP | Camada de serviço |
| `.env` commitado | credencial exposta | `.gitignore`; revogue se vazar |

---

## Resumo

Nesta aula um erro de código gerado deixa de dar resposta errada e passa a expor
dados de outras pessoas. Três defeitos aparecem com regularidade quase mecânica em
APIs geradas por IA — devolver o objeto do banco inteiro, espalhar `req.body` por
cima dos valores que o servidor definiu, e mandar o stack trace para o cliente — e
os três são a mesma falha: tratar a fronteira do sistema como código interno. A
defesa tem quatro partes: esquema Zod com o tipo derivado dele (uma fonte da
verdade), camadas separadas (o serviço lança erro de domínio e não sabe o que é
HTTP), um único middleware traduzindo erro em status, e resposta **montada** com os
campos permitidos. Nenhum desses defeitos quebra um teste de caminho feliz — por
isso o teste que importa é o do campo que **não** deve aparecer.

---

## Leitura complementar

- [Zod — documentação](https://zod.dev/)
- [Express — tratamento de erros](https://expressjs.com/pt-br/guide/error-handling.html)
- [OWASP — Mass Assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [Checklist de revisão do curso](../recursos/checklist-revisao-de-codigo-ia.md)
