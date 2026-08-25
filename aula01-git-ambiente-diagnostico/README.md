# Aula 01 - Git e GitHub

## Objetivos da Aula

- Entender o que é controle de versão e por que é essencial no desenvolvimento de software
- Instalar e configurar o Git
- Aprender os comandos fundamentais do Git
- Criar uma conta no GitHub e conectar com o repositório local
- Fazer o primeiro commit e push

---

## 1. O que é Controle de Versão?

Imagine que você está escrevendo um TCC. Você salva versões como:

```
tcc-final.docx
tcc-final-v2.docx
tcc-final-v2-corrigido.docx
tcc-final-AGORA-VAI.docx
```

O controle de versão resolve esse problema. O **Git** registra cada alteração feita no código, permitindo:

- Voltar a qualquer versão anterior
- Trabalhar em equipe sem sobrescrever o trabalho dos outros
- Saber quem fez cada alteração e quando

### Git vs GitHub

| Git                                          | GitHub                                         |
| -------------------------------------------- | ---------------------------------------------- |
| Ferramenta local instalada no seu computador | Plataforma online que hospeda repositórios Git |
| Funciona offline                             | Requer internet                                |
| Controla versões dos arquivos                | Facilita colaboração, code review e issues     |

---

## 2. Instalação e Configuração

### 2.1 Instalando o Git

**Windows:**

- Acesse https://git-scm.com/downloads e baixe o instalador
- Durante a instalação, mantenha as opções padrão
- Marque a opção "Git Bash Here" (útil para terminal)

**macOS:**

```bash
# Se tiver Homebrew:
brew install git

# Ou instale as Command Line Tools:
xcode-select --install
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install git
```

### 2.2 Verificando a instalação

```bash
git --version
# Deve exibir algo como: git version 2.43.0
```

### 2.3 Configuração inicial

Essas configurações são feitas **uma única vez** e identificam você nos commits:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

Para verificar as configurações:

```bash
git config --list
```

---

## 3. Conceitos Fundamentais

### 3.1 Repositório (repo)

Um repositório é uma pasta cujos arquivos são rastreados pelo Git. Ao inicializar um repositório, o Git cria uma pasta oculta `.git/` que armazena todo o histórico.

### 3.2 Os três estados do Git

```
 Diretório de Trabalho  -->  Staging Area  -->  Repositório Local
   (Working Directory)       (git add)          (git commit)
```

1. **Working Directory:** onde você edita os arquivos normalmente
2. **Staging Area (Index):** área de preparação - você escolhe quais alterações vão entrar no próximo commit
3. **Repositório (.git):** onde os commits ficam salvos permanentemente

### 3.3 O que é um commit?

Um commit é um "snapshot" (foto) do estado dos seus arquivos em um momento específico. Cada commit tem:

- Um identificador único (hash SHA)
- Uma mensagem descritiva
- Autor e data
- Referência ao commit anterior

---

## 4. Passo a passo - Primeiros Comandos

### 4.1 Criando um repositório local

```bash
# Crie uma pasta para o projeto
mkdir meu-primeiro-repo
cd meu-primeiro-repo

# Inicialize o repositório Git
git init
```

Você verá a mensagem: `Initialized empty Git repository in .../meu-primeiro-repo/.git/`

### 4.2 Criando e rastreando arquivos

```bash
# Crie um arquivo
echo "# Meu Primeiro Repositório" > README.md

# Verifique o status
git status
```

O `git status` mostrará o arquivo como **Untracked** (não rastreado). Isso significa que o Git sabe que o arquivo existe, mas ainda não está monitorando esse arquivo.

### 4.3 Adicionando ao staging

```bash
# Adicionar um arquivo específico
git add README.md

# Ou adicionar todos os arquivos modificados
git add .
```

Agora o arquivo está na **Staging Area**, pronto para ser commitado.

### 4.4 Fazendo o primeiro commit

```bash
git commit -m "Primeiro commit: adiciona README"
```

A flag `-m` permite escrever a mensagem diretamente no comando.

### 4.5 Verificando o histórico

```bash
git log
```

Você verá algo como:

```
commit a1b2c3d4e5f6... (HEAD -> main)
Author: Seu Nome <seu.email@exemplo.com>
Date:   Mon Mar 10 2026

    Primeiro commit: adiciona README
```

### 4.6 Fluxo completo resumido

```bash
# Editar arquivos...
git status          # Ver o que mudou
git add .           # Preparar alterações
git commit -m "mensagem descritiva"  # Salvar snapshot
git log --oneline   # Ver histórico resumido
```

---

## 5. GitHub - Repositório Remoto

### 5.1 Criando uma conta

1. Acesse https://github.com
2. Crie uma conta com seu email institucional (se possível)
3. Confirme o email

### 5.2 Criando um repositório no GitHub

1. Clique em **"New repository"** (botão verde)
2. Dê um nome ao repositório (ex: `meu-primeiro-repo`)
3. **Não** marque "Initialize this repository with a README" (já temos um local)
4. Clique em **"Create repository"**

### 5.3 Conectando o local ao remoto

O GitHub mostrará os comandos. Copie e execute:

```bash
# Adicionar o endereço do repositório remoto
git remote add origin https://github.com/seu-usuario/meu-primeiro-repo.git

# Enviar os commits locais para o GitHub
git push -u origin main
```

> **Nota:** Na primeira vez, o Git pedirá autenticação. Recomenda-se configurar um **Personal Access Token** ou **SSH Key**.

### 5.4 Clonando um repositório existente

Para baixar um repositório que já existe no GitHub:

```bash
git clone https://github.com/usuario/nome-do-repo.git
```

---

## 6. Boas Práticas de Commit

### Mensagens de commit

**Ruim:**

```
git commit -m "alteracoes"
git commit -m "fix"
git commit -m "atualizacao"
```

**Bom:**

```
git commit -m "Adiciona validacao de email no formulario de cadastro"
git commit -m "Corrige calculo de desconto para valores acima de 100"
git commit -m "Remove funcao duplicada de formatacao de data"
```

### Regras práticas

1. Use o imperativo: "Adiciona", "Corrige", "Remove" (não "Adicionei", "Corrigido")
2. Seja específico: diga **o que** e **onde**
3. Commits pequenos e frequentes > commits gigantes e raros

---

## 7. Comandos Essenciais - Resumo

| Comando                       | O que faz                                 |
| ----------------------------- | ----------------------------------------- |
| `git init`                    | Inicializa um repositório                 |
| `git status`                  | Mostra o estado atual dos arquivos        |
| `git add <arquivo>`           | Adiciona arquivo ao staging               |
| `git add .`                   | Adiciona todos os arquivos modificados    |
| `git commit -m "msg"`         | Cria um commit com mensagem               |
| `git log`                     | Mostra histórico de commits               |
| `git log --oneline`           | Histórico resumido (uma linha por commit) |
| `git remote add origin <url>` | Conecta a um repositório remoto           |
| `git push`                    | Envia commits para o remoto               |
| `git pull`                    | Baixa atualizações do remoto              |
| `git clone <url>`             | Clona um repositório existente            |
| `git diff`                    | Mostra alterações não commitadas          |

---

## 8. .gitignore

O arquivo `.gitignore` diz ao Git quais arquivos **não** devem ser rastreados:

```gitignore
# Dependências do Node
node_modules/

# Variáveis de ambiente
.env

# Arquivos de build
dist/

# Arquivos do sistema
.DS_Store
Thumbs.db
```

Crie este arquivo na raiz do projeto **antes** de adicionar os arquivos ao Git.

---

## Exercícios Práticos

### Exercício 1 - Repositório pessoal

1. Crie uma pasta chamada `exercicios-git`
2. Inicialize um repositório Git
3. Crie um arquivo `sobre-mim.txt` com seu nome e curso
4. Faça o commit
5. Crie um repositório no GitHub e faça o push

### Exercício 2 - Múltiplos commits

1. No mesmo repositório, crie um arquivo `linguagens.txt`
2. Adicione 3 linguagens que você conhece, fazendo **um commit por linguagem**
3. Use `git log --oneline` para ver o histórico

### Exercício 3 - .gitignore

1. Crie um arquivo `segredo.txt` com uma senha fictícia
2. Crie um `.gitignore` que ignore esse arquivo
3. Faça `git status` e confirme que o arquivo não aparece
4. Commit e push

---

## Dica: Usando IA para aprender Git

O **GitHub Copilot Chat** no VS Code pode te ajudar com Git. Experimente perguntar:

- _"Como desfaço o último commit sem perder as alterações?"_
- _"Qual a diferença entre git merge e git rebase?"_
- _"Me explique o que esse comando faz: git reset --soft HEAD~1"_

> **Importante:** Use a IA como ferramenta de aprendizado. Entenda o que cada comando faz antes de executar, especialmente comandos destrutivos como `reset` e `force push`.

---

## Leitura Complementar

- [Git - Documentação Oficial](https://git-scm.com/doc)
- [GitHub Docs - Quickstart](https://docs.github.com/en/get-started/quickstart)

---

<!-- MIGRAR: origem aula02-intro-js-node (Instalação do Node.js e Configuração do VS Code) -->

## Instalação do Node.js

### Instalando

**Recomendado:** Baixe a versão **LTS** (Long Term Support) em https://nodejs.org

**macOS (com Homebrew):**

```bash
brew install node
```

**Linux (Ubuntu/Debian):**

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

### Verificando a instalação

```bash
node --version
# v20.x.x (ou superior)

npm --version
# 10.x.x (ou superior)
```

O `npm` (Node Package Manager) é instalado automaticamente junto com o Node.

## VS Code - Configuração Recomendada

### Extensões úteis

1. **GitHub Copilot** (ou assistente equivalente) - assistente de IA para código
2. **ESLint** - detecta erros e problemas no código
3. **Prettier** - formatação automática

### Atalhos essenciais

| Atalho             | Ação                             |
| ------------------ | -------------------------------- |
| `Ctrl + '`         | Abrir/fechar terminal integrado  |
| `Ctrl + S`         | Salvar arquivo                   |
| `Ctrl + Shift + P` | Paleta de comandos               |
| `Ctrl + P`         | Buscar arquivo por nome          |

<!-- FIM MIGRAR -->
