# Aula 13 - Projeto: Contrato Alinhado com o Front → Testes → Implementação Assistida

**Modo de IA: Par**

## Objetivos da aula

- Alinhar o contrato da API do grupo com quem faz o front (Programação Web), antes de escrever qualquer rota.
- Aplicar, no projeto real, o fluxo praticado nas aulas 06-11: contrato → teste → implementação assistida → revisão.
- Deixar o backend do grupo rodando localmente, com pelo menos um recurso completo (CRUD) e persistência em SQLite.

## Leitura prévia (antes da aula)

- Releia [`recursos/template-contrato-api.md`](../recursos/template-contrato-api.md), [`recursos/rubrica-code-review.md`](../recursos/rubrica-code-review.md) e [`recursos/template-decisoes.md`](../recursos/template-decisoes.md) — os três são usados nesta aula e na 14.
- Se o grupo já tem o tema definido (via Engenharia de Software), traga-o pronto.

---

## Conteúdo

Descrito em detalhe no [README raiz](../README.md#projeto-final-integrador): backend REST em TypeScript + Express, avaliado nesta disciplina, mas que precisa ser o backend real que o front do grupo (Programação Web) consome. Entregáveis obrigatórios: contrato escrito antes do código, testes com Vitest, validação (Zod), tratamento de erros, persistência em SQLite via `@libsql/client`, API publicada, histórico Git com commits de todos os integrantes e ao menos um PR revisado, `DECISOES.md`, divisão de responsabilidades declarada.

### Passo a passo desta aula

1. **Copie o template**: `aula13-14-projeto/projeto-base/` para o repositório do próprio grupo (não desenvolvam dentro deste repositório de aulas — ver `projeto-base/README.md`).
2. **Escreva o contrato** do primeiro recurso do tema, alinhado com quem faz o front — use `recursos/template-contrato-api.md`. Se o front já tem uma tela que consome esse recurso, o contrato precisa bater com o que ela espera.
3. **Escreva os testes** do recurso a partir do contrato (mesmo padrão de `projeto-base/test/app.test.ts`).
4. **Peça a implementação** a um agente de IA, colando contrato + testes — não uma descrição solta.
5. **Revise antes de aceitar**: status codes batem com o contrato? SQL usa parâmetros? validação cobre os campos obrigatórios do contrato?
6. **Registre em `DECISOES.md`** o que foi pedido, aceito/rejeitado/ajustado e por quê (template em `recursos/template-decisoes.md`).

### Divisão de responsabilidades

O grupo **não deve** dividir "quem faz o quê" por pessoa fixa desde o início — todos passam pelo backend, em partes diferentes (ex.: uma pessoa no recurso A, outra no B, revezando). Declare a divisão real (quem fez o quê) no README do projeto do grupo; a defesa amostrada (P2) é individual e qualquer integrante pode ser sorteado para explicar qualquer parte.

---

## Atividades em sala

1. **Alinhamento com o front:** cada grupo confirma com quem faz o front os nomes de campos e formatos de erro do primeiro contrato, ajustando antes de codar.
2. **Implementação assistida guiada:** cada integrante implementa pelo menos um endpoint do recurso escolhido, seguindo o fluxo de 6 passos acima, com o professor circulando.

## Exercícios para casa

- **Exercício 1 (Par):** complete o CRUD do primeiro recurso (mínimo: GET lista, GET por id, POST, DELETE — PUT se o tema exigir atualização).
- **Exercício 2 (Par):** adicione pelo menos uma regra de negócio própria do tema (ex.: "livro indisponível não pode ser emprestado") na camada de repository/serviço, com teste cobrindo o caso que a regra bloqueia.
- **Exercício 3 (Sem IA):** escreva a seção "Como executar" e "Endpoints" do README do projeto do grupo, sozinho, a partir do contrato — é a documentação que quem faz o front vai usar.

## Critério de entrega (desta aula)

- Repositório do grupo criado, com o `projeto-base` copiado e adaptado ao tema.
- `DECISOES.md` com pelo menos uma entrada real (não vazio).
- Pelo menos um endpoint completo, testado, rodando localmente contra SQLite (`file:` local).
- Cada integrante com pelo menos um commit no backend até o fim desta aula.

---

Conteúdo da aula14 (revisão cruzada entre grupos + deploy): [aula14-revisao-deploy.md](aula14-revisao-deploy.md).
