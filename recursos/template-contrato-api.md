# Template de contrato de API

Preencha isto **antes** de escrever qualquer código de servidor (aula09) ou pedir a um agente de IA para gerar rotas. O contrato é o que você (ou o grupo) usa para: alinhar com quem faz o front, escrever os testes de endpoint (aula09), e revisar se o que foi gerado bate com o que foi combinado.

---

## Recurso: `<nome do recurso, ex.: alunos>`

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/alunos` | Lista todos |
| GET | `/alunos/:id` | Busca um pelo id |
| POST | `/alunos` | Cria um novo |
| PUT | `/alunos/:id` | Atualiza um existente |
| DELETE | `/alunos/:id` | Remove um |

### Payloads

**Request — POST /alunos**
```json
{
  "nome": "string, obrigatório, min 2 caracteres",
  "email": "string, obrigatório, formato de email",
  "curso": "string, obrigatório"
}
```

**Response — 201 Created**
```json
{
  "id": "number",
  "nome": "string",
  "email": "string",
  "curso": "string"
}
```

**Response — GET /alunos** (200 OK): array do formato acima.

### Erros esperados

| Código | Quando acontece | Formato do corpo |
|--------|------------------|-------------------|
| 400 | Payload inválido (campo faltando, tipo errado) | `{ "erro": "mensagem descrevendo o campo" }` |
| 404 | `:id` não existe | `{ "erro": "Aluno não encontrado" }` |
| 500 | Erro inesperado do servidor | `{ "erro": "Erro interno do servidor" }` |

### Regras de negócio relevantes ao contrato

- (ex.: "email deve ser único — POST com email já cadastrado retorna 400, não 500")
- (ex.: "DELETE em recurso já removido retorna 404, não 204")

---

## Checklist antes de considerar o contrato pronto

- [ ] Todo endpoint tem método + rota + descrição de uma linha.
- [ ] Todo payload de request tem, por campo, se é obrigatório e qual a validação esperada (isso vira o schema Zod na aula11).
- [ ] Todo endpoint tem pelo menos um caso de erro documentado (não só o caminho feliz).
- [ ] Quem faz o front do grupo revisou e concorda com nomes de campos e formato de erro (evita retrabalho na integração).
