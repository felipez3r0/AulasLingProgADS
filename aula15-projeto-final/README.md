# Aula 15 — Projeto final: da issue ao PR revisado

> **Módulo:** M4 — Agentes, API e projeto
> **Ementa oficial:** consolidação de E1 a E7
> **Skills:** S1 a S11 (todas, avaliadas)
> **Pré-requisitos:** Aulas 01 a 14

## Objetivo

Construir uma **API REST completa** operando o fluxo de trabalho real: escrever
issues com critério de aceite, delegar parte do trabalho a um agente, revisar o PR
que ele abre, e entregar com CI verde.

O projeto avalia as duas coisas que o curso ensinou: **o que você sabe fazer** e
**o que você sabe verificar**.

---

## O que muda em relação a um projeto tradicional

| Projeto tradicional | Este projeto |
| --- | --- |
| "faça sozinho, sem IA" | use IA — e registre como |
| avalia o código entregue | avalia o código **e** o seu domínio sobre ele |
| entrega no último dia | histórico de commits mostra o processo |
| ninguém revisa | pelo menos um PR de agente revisado por você |

Usar IA não tira ponto. **Não saber explicar o que está no seu repositório, sim.**

---

## Temas

Escolha **um**, ou proponha ao professor. Todos exigem dois recursos que se
relacionam e pelo menos duas regras de negócio.

### 1. Biblioteca
- **Livros** (título, autor, isbn, gênero, disponível)
- **Empréstimos** (livroId, aluno, dataEmpréstimo, dataDevolução, status)
- Regras: livro indisponível não pode ser emprestado; máximo 3 empréstimos ativos por aluno

### 2. Lanchonete
- **Produtos** (nome, preço, categoria, disponível)
- **Pedidos** (itens[], cliente, status, total)
- Regras: total calculado pelo servidor, nunca pelo cliente; pedido não aceita produto indisponível

### 3. Kanban
- **Projetos** (nome, descrição)
- **Tarefas** (projetoId, título, status, prioridade, responsável)
- Regras: tarefa exige projeto existente; máximo 5 tarefas "em andamento" por responsável

### 4. Boletim
- **Alunos** (nome, ra, curso)
- **Notas** (alunoId, disciplina, valor, semestre)
- Regras: nota entre 0 e 10; não pode haver duas notas do mesmo aluno na mesma disciplina e semestre

### 5. Oficina mecânica
- **Veículos** (placa, modelo, ano, cliente)
- **Ordens de serviço** (veículoId, descrição, valor, status)
- Regras: veículo não pode ter duas ordens abertas; ordem finalizada não pode ser alterada

---

## Requisitos

### Funcionalidade

| Requisito | Detalhe |
| --- | --- |
| CRUD completo | 2+ recursos, com GET, POST, PUT/PATCH e DELETE |
| Relacionamento | os recursos se referenciam de verdade |
| Filtros | 2+ query params, com validação do valor recebido |
| Regras de negócio | 2+, na camada de **serviço**, não nas rotas |
| Validação | Zod em toda entrada; tipo derivado do esquema |
| Erros | middleware centralizado; status corretos; sem vazar stack |
| Persistência | JSON com escrita atômica; arquivo corrompido não vira lista vazia |

### Qualidade

- Tipagem estrita, **sem `any`**
- Camadas separadas: rotas · serviço · repositório
- Nenhuma resposta devolve o objeto do banco cru
- Nenhum campo definido pelo servidor pode ser sobrescrito pelo cliente

### Verificação

- Testes de endpoint com supertest, cobrindo **casos de borda**, não só o caminho feliz
- `npm run typecheck` limpo
- CI configurado e verde

### Git e processo

- Mínimo **15 commits** distribuídos ao longo do desenvolvimento
- Pelo menos 1 feature branch com PR
- Pelo menos **1 PR aberto por agente**, revisado por você com comentários linha a linha
- `.gitignore` com `node_modules`, `dist`, `.env` e os dados gerados

---

## Estrutura sugerida

```
projeto-final/
  dados/                  # JSON gerado (ignorado pelo git)
  src/
    server.ts             # só chama listen
    app.ts                # criarApp() - sem listen, para os testes
    rotas/
    servicos/             # regras de negócio
    repositorios/         # leitura e escrita
    esquemas/             # Zod
    erros/
  testes/
  .github/workflows/ci.yml
  .gitignore
  package.json
  tsconfig.json
  README.md
  DIARIO-IA.md
```

> `app.ts` separado de `server.ts` é a decisão da Aula 13 que torna o projeto
> testável. Sem ela, você não consegue escrever testes de endpoint.

---

## O fluxo de trabalho exigido

### 1. Escreva issues antes de codar

Use o template [`tarefa-para-agente`](../.github/ISSUE_TEMPLATE/tarefa-para-agente.md).
Cada issue precisa de: objetivo, critério de aceite executável, arquivos permitidos
e restrições.

**A qualidade do PR é a qualidade da issue.** Uma issue de uma linha produz um PR
que você não consegue avaliar.

### 2. Trabalhe em branches

Uma branch por funcionalidade. Commits pequenos, mensagens semânticas.

### 3. Delegue pelo menos uma issue a um agente

Copilot Agent no GitHub, ou um agente local abrindo o PR. **Você revisa**:

- leia o diff inteiro;
- aplique o [checklist](../recursos/checklist-revisao-de-codigo-ia.md);
- comente linha a linha o que precisa mudar;
- só faça merge depois de resolvido.

Um PR de agente aprovado sem comentário nenhum é sinal de que a revisão não
aconteceu — e vale menos que um PR com três ajustes pedidos.

### 4. Escreva o `DIARIO-IA.md`

Uma página, honesta:

```markdown
# Diário de uso de IA

## Ferramentas usadas
Copilot inline, Claude Code, Copilot Agent (issue #7)

## O que a IA fez
- gerou os esquemas Zod a partir das interfaces
- implementou o CRUD de empréstimos (PR #12)
- sugeriu os casos de borda dos testes de nota

## O que eu fiz
- modelei os tipos e as regras de negócio
- escrevi todos os testes de borda
- revisei e corrigi o PR #12

## Onde ela errou, e como eu percebi
- O PR #12 usava `.sort()` direto no array do repositório, reordenando
  os dados em memória. Percebi no `git diff`, antes de rodar: é o defeito
  da Aula 07 e eu procuro por ele por reflexo agora.
- Sugeriu instalar `date-fns-ptbr`, que não existe no npm. Conferi com
  `npm view` antes de instalar (Aula 09).
- Insistiu duas vezes numa correção de paginação que só mudava o bug de
  lugar. Parei, escrevi a especificação, e resolvi de uma vez (Aula 11).

## O que eu faria diferente
...
```

**O diário é avaliado, e a honestidade conta a favor.** "A IA errou aqui e eu
percebi assim" demonstra exatamente a competência que a disciplina ensina.

---

## Autoverificação antes de entregar

Esta aula traz uma ferramenta para você conferir o que dá para conferir sozinho:

```typescript
// aula15-projeto-final/exemplos/verificar-entrega.ts
import { verificarEntrega } from "./verificar-entrega.js";

const resultado = verificarEntrega({
  recursosComCrudCompleto: 2,
  quantidadeDeCommits: 22,
  arquivosComSegredo: [],
  // ... preencha honestamente
});

console.log(resultado.percentualAtendido, resultado.bloqueios);
```

Rode `npm test -- verificar-entrega` para ver os critérios em ação.

Quatro coisas são **bloqueio**, independentemente do resto: segredo commitado,
suíte vermelha, typecheck com erro, `DIARIO-IA.md` ausente.

E o checklist manual, que nenhuma ferramenta pega:

```bash
npm run typecheck                       # limpo
npm test                                # verde
git log --oneline | wc -l               # 15 ou mais
git diff main..sua-branch               # você leu tudo?
grep -rn "any" src/                     # nenhum
git log --all --oneline -- .env         # vazio
```

---

## Avaliação

Detalhamento completo em [recursos/rubrica-projeto-final.md](../recursos/rubrica-projeto-final.md).

| Critério | Peso |
| --- | --- |
| Verificação (testes, bordas, CI, typecheck) | **25%** |
| Funcionalidade (CRUD, relacionamento, filtros, regras) | 20% |
| Qualidade do código (tipagem, camadas, nomes) | 20% |
| Domínio e uso de IA (arguição + diário + PR revisado) | **20%** |
| Uso de Git (commits, branches, PRs) | 15% |

Os dois critérios de maior peso — verificação e domínio — são exatamente o que
distingue quem trabalha com IA de quem é carregado por ela.

### Arguição individual

Cada integrante responde sobre **qualquer parte** do projeto. Não é pegadinha: é a
única forma de avaliar o que a disciplina realmente ensinou.

> **Não saber explicar código que está no seu repositório é o resultado que esta
> disciplina existe para evitar.**

---

## Cronograma sugerido

### Em sala (Aula 15)
1. Escolher tema e definir os dois recursos
2. Criar repositório, estrutura e CI
3. Modelar tipos e esquemas Zod
4. Escrever as issues das funcionalidades

### Em casa
5. Implementar repositório e serviço, com testes
6. Implementar rotas e validação
7. Delegar uma issue ao agente e revisar o PR
8. Cobrir casos de borda nos testes
9. Escrever `README.md` e `DIARIO-IA.md`
10. Rodar a autoverificação e corrigir o que faltar

---

## Entrega

- [ ] Repositório no GitHub com acesso ao professor
- [ ] CI verde
- [ ] `README.md` com endpoints e exemplos de requisição
- [ ] `DIARIO-IA.md` preenchido
- [ ] Pelo menos 1 PR de agente revisado, com comentários
- [ ] Apresentação de 5–10 minutos com a API funcionando
- [ ] Arguição individual

---

## Encerramento: o que você leva daqui

Você aprendeu TypeScript, Express, Zod e testes. Nada disso é o ponto — em três
anos parte já terá mudado.

O que fica é outra coisa: **você sabe verificar**. Sabe ler um diff e encontrar a
mudança que não foi anunciada. Sabe rastrear um laço e achar o off-by-one antes de
rodar. Sabe que `sort` muta, que `catch { return [] }` apaga dados, que 500 para
erro do cliente causa retentativa infinita, e que o pacote que a IA mandou instalar
pode não existir.

Sabe, principalmente, transformar um pedido vago numa especificação com critério de
aceite — e é isso que torna uma tarefa delegável, seja para um agente, seja para um
colega.

A IA vai continuar melhorando. O que ela não vai fazer é decidir se o problema
certo está sendo resolvido, saber o que é correto no seu contexto, ou assinar o
commit. Isso continua sendo seu.

**O commit tem o seu nome.**

---

## Leitura complementar

- [Rubrica completa](../recursos/rubrica-projeto-final.md)
- [Checklist de revisão de código gerado](../recursos/checklist-revisao-de-codigo-ia.md)
- [Guia das ferramentas de IA](../recursos/guia-ferramentas-ia.md)
- [Como entregar](../recursos/como-entregar.md)
