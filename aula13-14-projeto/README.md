# Aula 15 - Projeto Final: API Completa

## Objetivo

Aplicar todos os conhecimentos adquiridos ao longo da disciplina na construção de uma **API REST completa**, desde a estrutura de dados até a validação e tratamento de erros.

---

## Descrição do Projeto

Cada equipe (ou individualmente) deve construir uma **API REST** para um dos temas propostos abaixo, utilizando:

- **TypeScript** com tipagem rigorosa
- **Node.js** com **Express**
- **Persistência em arquivo JSON**
- **Validação com Zod**
- **Tratamento de erros padronizado**
- **Git** com commits organizados e descritivos

---

## Temas Sugeridos

Escolha **um** dos temas abaixo (ou proponha um tema ao professor):

### 1. Sistema de Biblioteca
- Livros (título, autor, isbn, gênero, disponível)
- Empréstimos (livroId, nomeAluno, dataEmpréstimo, dataDevolução, status)
- Regras: livro indisponível não pode ser emprestado; máximo 3 empréstimos por aluno

### 2. Sistema de Pedidos (Lanchonete)
- Produtos (nome, preço, categoria, disponível)
- Pedidos (produtos[], cliente, status, total, dataCriação)
- Regras: calcular total automaticamente; pedido não pode ter produto indisponível

### 3. Sistema de Tarefas (Kanban)
- Projetos (nome, descrição, dataCriação)
- Tarefas (projetoId, título, descrição, status: "todo"|"doing"|"done", prioridade, responsável)
- Regras: tarefa precisa de projeto válido; limitar 5 tarefas "doing" por responsável

### 4. Sistema de Notas (Boletim)
- Alunos (nome, ra, curso)
- Disciplinas (nome, cargaHorária, professor)
- Notas (alunoId, disciplinaId, nota, semestre)
- Regras: nota entre 0-10; calcular média ponderada por carga horária

---

## Requisitos Obrigatorios

### Estrutura do Projeto

```
projeto-final/
  data/                     # Arquivos JSON (banco de dados)
  src/
    server.ts               # Ponto de entrada
    routes/                 # Definição de rotas
    services/               # Lógica de negócio
    data/                   # Repositórios (leitura/escrita JSON)
    schemas/                # Schemas Zod
    middlewares/             # Middlewares customizados
    errors/                 # Classes de erro
    models/                 # Interfaces/Types
  package.json
  tsconfig.json
  .gitignore
  README.md                 # Documentação da API
```

### Funcionalidades

| Requisito | Descrição |
|-----------|-----------|
| CRUD completo | Pelo menos 2 recursos com todas as operações (GET, POST, PUT, DELETE) |
| Validação | Todos os inputs validados com Zod |
| Tratamento de erros | Middleware centralizado com erros customizados |
| Persistência | Dados salvos em arquivo JSON |
| Filtros | Pelo menos 2 query params para filtragem |
| Relacionamento | Os recursos devem se relacionar (ex: pedido tem produtos) |
| Regras de negócio | Pelo menos 2 regras na camada de serviços |
| Middlewares | Logger + pelo menos 1 middleware customizado |

### Git

| Requisito | Descrição |
|-----------|-----------|
| Mínimo 10 commits | Commits descritivos e atômicos |
| Branches | Pelo menos 1 feature branch mergeada na main |
| .gitignore | node_modules, dist, .env ignorados |
| README.md | Documentação completa do projeto |

---

## Checklist de Conceitos da Disciplina

Seu projeto deve demonstrar dominio de:

- [ ] Variáveis e constantes com tipagem (Aula 03)
- [ ] Operadores e expressões (Aula 03)
- [ ] Condicionais - if/else, switch (Aula 04)
- [ ] Laços de repetição - for, while (Aula 04)
- [ ] Funções com parâmetros tipados e retorno (Aula 05)
- [ ] Arrays e métodos (map, filter, find, reduce) (Aula 06)
- [ ] Objetos e interfaces (Aula 07)
- [ ] Union types ou generics (Aula 08)
- [ ] Módulos - import/export (Aula 09)
- [ ] Manipulação de arquivos - fs (Aula 10)
- [ ] Conceitos REST e HTTP (Aula 11)
- [ ] Express - rotas e parametros (Aula 12)
- [ ] Middlewares (Aula 13)
- [ ] Validação e tratamento de erros (Aula 14)

---

## Documentação da API (README.md do projeto)

O README deve conter:

```markdown
# Nome do Projeto

Descrição breve do que a API faz.

## Como executar

1. Clone o repositório
2. `npm install`
3. `npm run dev`
4. Acesse http://localhost:3000

## Endpoints

### Recurso 1

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /recurso | Listar todos |
| GET | /recurso/:id | Buscar por ID |
| POST | /recurso | Criar novo |
| PUT | /recurso/:id | Atualizar |
| DELETE | /recurso/:id | Remover |

### Exemplos de requisição

(Incluir exemplos com curl ou JSON para cada endpoint)

## Tecnologias

- TypeScript
- Node.js
- Express
- Zod
```

---

## Criterios de Avaliacao

| Critério | Peso |
|----------|------|
| Funcionalidade (CRUD funciona corretamente) | 25% |
| Qualidade do código (tipagem, organização, legibilidade) | 25% |
| Validação e tratamento de erros | 20% |
| Uso do Git (commits, branches, .gitignore) | 15% |
| Documentação (README com endpoints e exemplos) | 15% |

---

## Cronograma Sugerido

### Em sala (Aula 15)
1. Definir tema e escopo
2. Criar repositório e estrutura do projeto
3. Definir interfaces e schemas
4. Implementar repositório de dados (persistência JSON)
5. Implementar rotas e serviços
6. Testar todos os endpoints

### Em casa (entrega)
7. Refinar validações e regras de negócio
8. Adicionar middleware customizado
9. Escrever documentação
10. Revisar commits e fazer merge das branches

---

## Dica Final: IA como Parceira de Projeto

Ao longo desta disciplina, vocês aprenderam a usar a IA como ferramenta de apoio. No projeto final, usem de forma estratégica:

### Quando usar a IA
- Para gerar **schemas Zod** a partir das interfaces
- Para gerar **dados de teste** no JSON
- Para **debugar erros** que você não consegue resolver
- Para **revisar código** e sugerir melhorias
- Para gerar **comandos curl** de teste

### Quando NÃO usar a IA
- Para gerar o projeto inteiro sem entender o que está acontecendo
- Para copiar código sem adaptar ao seu contexto
- Para pular etapas de aprendizado

### Reflexão para carreira
A IA não substitui o programador - ela **amplifica** suas capacidades. Um dev que entende os fundamentos e usa IA é produtivo e mais eficaz do que:
- Um dev que não usa IA (mais lento em tarefas repetitivas)
- Alguém que só usa IA sem entender o código (não sabe debugar, não sabe adaptar)

O diferencial é **entender o que você está fazendo** e usar a IA para ir mais rápido.

---

## Entrega

- **Repositório no GitHub** (público ou privado com acesso ao professor)
- **Prazo:** (definido pelo professor)
- **Apresentação:** breve demonstração da API funcionando (5-10 min por equipe)
