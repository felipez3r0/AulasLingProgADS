# Aula 08 - HTTP, REST e Contrato de API

**Modo de IA: Tutor** — pode perguntar, pedir explicação, pedir dica. Não pode pedir a solução.

## Objetivos da aula

- Explicar o protocolo HTTP: métodos, status codes, headers.
- Escrever o **contrato** de uma API (endpoints, payloads, erros) antes de qualquer código de servidor.
- Testar uma API alheia com `curl` e `fetch`, lendo a documentação dela para entender o contrato de outra pessoa.

## Leitura prévia (antes da aula)

Leia este README. A partir de agora o backend é o caso de estudo do curso — mas esta aula ainda não escreve servidor nenhum: o objetivo é aprender a **especificar** uma API antes de gerar código para ela (aula09 em diante).

---

## Conteúdo

### HTTP em uma página

| Método | Ação | Exemplo |
|--------|------|---------|
| GET | Ler | Listar alunos |
| POST | Criar | Cadastrar aluno |
| PUT | Atualizar (completo) | Substituir dados do aluno |
| DELETE | Remover | Excluir aluno |

| Faixa | Significado | Mais comuns |
|-------|-------------|--------------|
| 2xx | Sucesso | 200 OK, 201 Created, 204 No Content |
| 4xx | Erro do cliente | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx | Erro do servidor | 500 Internal Server Error |

Headers carregam metadados: `Content-Type: application/json`, `Authorization: Bearer token123`.

### Convenções REST

```
GET    /alunos          -> lista todos
GET    /alunos/1        -> busca o aluno 1
POST   /alunos          -> cria
PUT    /alunos/1        -> atualiza o aluno 1
DELETE /alunos/1        -> remove o aluno 1
```

URLs usam substantivos no plural (`/alunos`), nunca verbos (~~`/criarAluno`~~) — o método HTTP já diz a ação.

### O contrato vem antes do código

Um **contrato de API** é a especificação por escrito de cada endpoint: rota, payload de entrada, formato de resposta e casos de erro. Ele serve para alinhar com quem faz o front antes de codar e para virar os testes de endpoint (aula09). E é o critério contra o qual você revisa código gerado por IA: se o gerado não bate com o contrato, tem algo errado, mesmo que pareça funcionar.

Use o template em [`recursos/template-contrato-api.md`](../recursos/template-contrato-api.md) para escrever o contrato de um recurso. Um exemplo preenchido:

```markdown
### GET /alunos/:id
Resposta 200: { "id": number, "nome": string, "email": string }
Resposta 404: { "erro": "Aluno não encontrado" }

### POST /alunos
Payload: { "nome": string (obrigatório), "email": string (obrigatório, formato email) }
Resposta 201: o aluno criado, com id gerado
Resposta 400: { "erro": "descrição do campo inválido" } se nome ou email faltar/for inválido
```

### Testando uma API alheia com curl e fetch

Antes de escrever sua própria API, pratique **ler o contrato de outra**:

```bash
curl https://jsonplaceholder.typicode.com/users
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "teste", "body": "conteúdo", "userId": 1}'
```

```typescript
interface Usuario {
  id: number;
  name: string;
  email: string;
}

async function buscarUsuario(id: number): Promise<Usuario | null> {
  const resposta = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!resposta.ok) return null;
  return resposta.json();
}
```

APIs públicas gratuitas para praticar: [JSONPlaceholder](https://jsonplaceholder.typicode.com) (fake CRUD), [ViaCEP](https://viacep.com.br) (CEP brasileiro), [PokeAPI](https://pokeapi.co).

---

## Atividades em sala

1. **Leitura de contrato alheio:** em dupla, explorem a documentação da ViaCEP ou JSONPlaceholder com `curl`, e escrevam — sem ver o código-fonte da API — o contrato dela no formato do template (rotas, payloads, erros que conseguirem provocar).
2. **Escrever um contrato próprio:** a partir do enunciado *"uma API de alunos: listar, buscar por id, criar, atualizar, remover"*, cada aluno preenche o template de contrato completo, incluindo pelo menos dois casos de erro.

## Exercícios para casa

- **Exercício 1 (Tutor):** `src/cep.ts` — consulte 3 CEPs na ViaCEP com `fetch`, tratando o caso de CEP inválido.
- **Exercício 2 (Sem IA):** escreva o contrato completo (template preenchido) de uma API de "produtos" (listar, buscar, filtrar por categoria, criar, remover) — sem IA, para praticar sozinho a decisão de quais erros faz sentido prever.
- **Exercício 3 (Tutor):** `src/pokedex.ts` — busque 5 Pokémons na PokeAPI e exiba nome, tipo(s) e peso em formato de tabela.

## Critério de entrega

- O contrato do Exercício 2 será o ponto de partida da aula09 — guarde-o, ele vai virar código.
- Todo contrato entregue tem pelo menos 2 endpoints com erro documentado.
- Commit por exercício.
