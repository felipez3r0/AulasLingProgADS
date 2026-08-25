# Aula 01 - Git/GitHub, Ambiente e Diagnóstico

**Modo de IA: Sem IA** — editor sem assistente, sem chat, durante toda a aula (inclui a prova diagnóstica). Os exercícios para casa indicam o próprio modo.

## Objetivos da aula

- Configurar Git, Node.js e VS Code para o restante do curso.
- Executar sozinho o fluxo básico do Git: `init`, `add`, `commit`, `push`, `clone`.
- Resolver a prova diagnóstica: ler código C e prever a saída, sem executar.
- Conhecer o [contrato de uso de IA](../README.md#contrato-de-uso-de-ia) da disciplina e identificar em qual modo cada atividade futura se encaixa.

## Leitura prévia (antes da aula)

- Instale Git, Node.js LTS e VS Code seguindo a seção "Instalação" abaixo.
- Crie uma conta no GitHub, se ainda não tiver.
- Leia a seção "Contrato de uso de IA" no [README raiz](../README.md) do repositório.

---

## Conteúdo

### Controle de versão e Git

O **Git** registra cada alteração feita no código, permitindo voltar a qualquer versão anterior, trabalhar em equipe sem sobrescrever o trabalho dos outros, e saber quem fez cada alteração e quando.

| Git | GitHub |
| --- | --- |
| Ferramenta local instalada no seu computador | Plataforma online que hospeda repositórios Git |
| Funciona offline | Requer internet |
| Controla versões dos arquivos | Facilita colaboração, code review e issues |

### Instalação

**Git — macOS:** `brew install git` (ou `xcode-select --install`)
**Git — Linux:** `sudo apt install git`
**Git — Windows:** baixe em https://git-scm.com/downloads

**Node.js:** baixe a versão **LTS** em https://nodejs.org, ou `brew install node` no macOS.

```bash
git --version
node --version   # v20.x ou superior
npm --version    # 10.x ou superior
```

**VS Code:** instale as extensões GitHub Copilot (ou assistente equivalente), ESLint e Prettier.

### Configuração inicial do Git (uma única vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

### Os três estados do Git

```
 Diretório de Trabalho  -->  Staging Area  -->  Repositório Local
   (Working Directory)       (git add)          (git commit)
```

Um **commit** é um snapshot do estado dos arquivos em um momento específico: hash único, mensagem, autor, data e referência ao commit anterior.

### Fluxo básico

```bash
git init                              # inicializa um repositório
git status                            # mostra o que mudou
git add .                             # move para a staging area
git commit -m "mensagem descritiva"   # cria o snapshot
git log --oneline                     # histórico resumido
```

### GitHub — repositório remoto

```bash
git remote add origin https://github.com/seu-usuario/meu-repo.git
git push -u origin main

git clone https://github.com/usuario/nome-do-repo.git   # baixar um repo existente
```

### Mensagens de commit

**Ruim:** `"alteracoes"`, `"fix"`, `"atualizacao"`
**Bom:** `"Adiciona validação de email no formulário de cadastro"`, `"Corrige cálculo de desconto para valores acima de 100"`

Use o imperativo ("Adiciona", "Corrige", "Remove"), seja específico, prefira commits pequenos e frequentes.

### .gitignore

```gitignore
node_modules/
.env
dist/
.DS_Store
```

Crie este arquivo **antes** de adicionar os arquivos ao Git.

### Comandos essenciais — resumo

| Comando | O que faz |
| --- | --- |
| `git init` | Inicializa um repositório |
| `git status` | Mostra o estado atual dos arquivos |
| `git add <arquivo>` / `git add .` | Adiciona ao staging |
| `git commit -m "msg"` | Cria um commit |
| `git log --oneline` | Histórico resumido |
| `git remote add origin <url>` | Conecta a um repositório remoto |
| `git push` / `git pull` | Envia/baixa commits do remoto |
| `git clone <url>` | Clona um repositório existente |
| `git diff` | Mostra alterações não commitadas |

---

## Atividades em sala

1. **[Prova diagnóstica](diagnostico/) (leitura/previsão, ~30 min, sem IA e sem compilar):** o professor distribui trechos de código C. Para cada um, preveja a saída e justifique em uma frase. Objetivo: medir a base de C antes do Bloco 1 acelerar para TypeScript — se a turma for mal, a aula 15 vira um encontro extra do Bloco 1 (ver [README raiz](../README.md)).
2. Configuração do ambiente em sala, com o professor circulando para destravar quem tiver problema de instalação.
3. **Verificação em dupla:** cada aluno cria um repositório local, conecta ao GitHub e faz o primeiro commit; depois troca de tela com o colega e confere, pelo `git log --oneline` do outro, se as mensagens de commit seguem a convenção da seção "Mensagens de commit".

## Exercícios para casa

- **Exercício 1 (Sem IA) — Repositório pessoal:** crie uma pasta `exercicios-git`, inicialize um repositório, crie `sobre-mim.txt` com seu nome e curso, commit, crie o repositório no GitHub e faça o push.
- **Exercício 2 (Sem IA) — Múltiplos commits:** no mesmo repositório, crie `linguagens.txt` e adicione 3 linguagens que você conhece, **um commit por linguagem**. Confira o histórico com `git log --oneline`.
- **Exercício 3 (Tutor — pode perguntar o que um comando faz, não pedir a solução pronta):** crie `segredo.txt` com uma senha fictícia, crie um `.gitignore` que o ignore, confirme com `git status` que ele não aparece, e faça commit + push do restante.

## Critério de entrega

- Prova diagnóstica resolvida (entregue conforme instrução do professor).
- Repositório no GitHub com pelo menos 4 commits (um por exercício + o inicial), mensagens seguindo a convenção do imperativo.
- `.gitignore` funcionando (o Exercício 3 é verificado checando que `segredo.txt` não está no histórico).
