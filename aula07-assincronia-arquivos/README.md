# Aula 10 - Manipulação de Arquivos

## Objetivos da Aula

- Ler e escrever arquivos de texto com o módulo `fs` do Node.js
- Trabalhar com arquivos JSON como "banco de dados" simples
- Entender operações síncronas vs assíncronas
- Manipular caminhos com o módulo `path`
- Implementar persistência de dados em arquivo

---

## 1. O Módulo fs (File System)

O Node.js tem um módulo nativo para manipulação de arquivos:

```typescript
import fs from "fs";
import path from "path";
```

> **Comparando com C:** Em C você usa `fopen()`, `fread()`, `fwrite()`, `fclose()`. Em Node.js, o módulo `fs` oferece funcionalidades equivalentes, mas com APIs mais modernas.

---

## 2. Leitura de Arquivos

### 2.1 Leitura síncrona

```typescript
import fs from "fs";

// Ler arquivo de texto
const conteudo: string = fs.readFileSync("dados.txt", "utf-8");
console.log(conteudo);
```

### 2.2 Leitura assíncrona com Promises

```typescript
import fs from "fs/promises";

async function lerArquivo(): Promise<void> {
  const conteudo = await fs.readFile("dados.txt", "utf-8");
  console.log(conteudo);
}

lerArquivo();
```

> **Síncrono vs Assíncrono:**
> - **Síncrono** (`readFileSync`): bloqueia a execução até terminar. Simples, bom para scripts pequenos.
> - **Assíncrono** (`readFile` com `await`): não bloqueia. Essencial para servidores e aplicações que precisam atender múltiplas requisições.

### 2.3 Verificar se arquivo existe

```typescript
import fs from "fs";

if (fs.existsSync("dados.txt")) {
  const conteudo = fs.readFileSync("dados.txt", "utf-8");
  console.log(conteudo);
} else {
  console.log("Arquivo não encontrado!");
}
```

---

## 3. Escrita de Arquivos

### 3.1 Escrever (sobrescreve o conteúdo)

```typescript
import fs from "fs";

fs.writeFileSync("saida.txt", "Olá, mundo!\nSegunda linha.");
console.log("Arquivo criado com sucesso!");
```

### 3.2 Adicionar ao final (append)

```typescript
fs.appendFileSync("log.txt", `[${new Date().toISOString()}] Evento registrado\n`);
```

### 3.3 Versão assíncrona

```typescript
import fs from "fs/promises";

async function escrever(): Promise<void> {
  await fs.writeFile("saida.txt", "Conteúdo assíncrono");
  console.log("Arquivo salvo!");
}
```

---

## 4. Trabalhando com JSON

A forma mais prática de persistir dados estruturados em arquivo:

### 4.1 Salvando dados em JSON

```typescript
import fs from "fs";

interface Aluno {
  id: number;
  nome: string;
  nota: number;
}

const alunos: Aluno[] = [
  { id: 1, nome: "Ana", nota: 8.5 },
  { id: 2, nome: "Bruno", nota: 7.0 },
  { id: 3, nome: "Carlos", nota: 9.2 },
];

// Converter para JSON e salvar
const json: string = JSON.stringify(alunos, null, 2);
fs.writeFileSync("alunos.json", json, "utf-8");
```

O segundo parâmetro `null` é o replacer, e `2` são os espaços de indentação.

### 4.2 Lendo dados do JSON

```typescript
// Ler o JSON e converter para objeto
const dados: string = fs.readFileSync("alunos.json", "utf-8");
const alunos: Aluno[] = JSON.parse(dados);

console.log(alunos[0].nome);  // "Ana"
```

### 4.3 CRUD completo com JSON

```typescript
import fs from "fs";
import path from "path";

interface Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
}

const ARQUIVO = path.join(__dirname, "tarefas.json");

// Ler todas as tarefas
function lerTarefas(): Tarefa[] {
  if (!fs.existsSync(ARQUIVO)) {
    return [];
  }
  const dados = fs.readFileSync(ARQUIVO, "utf-8");
  return JSON.parse(dados);
}

// Salvar tarefas
function salvarTarefas(tarefas: Tarefa[]): void {
  fs.writeFileSync(ARQUIVO, JSON.stringify(tarefas, null, 2), "utf-8");
}

// Adicionar tarefa
function adicionar(titulo: string): Tarefa {
  const tarefas = lerTarefas();
  const novaTarefa: Tarefa = {
    id: tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1,
    titulo,
    concluida: false,
  };
  tarefas.push(novaTarefa);
  salvarTarefas(tarefas);
  return novaTarefa;
}

// Listar tarefas
function listar(): void {
  const tarefas = lerTarefas();
  tarefas.forEach((t) => {
    const status = t.concluida ? "[x]" : "[ ]";
    console.log(`${status} ${t.id}. ${t.titulo}`);
  });
}

// Concluir tarefa
function concluir(id: number): void {
  const tarefas = lerTarefas();
  const tarefa = tarefas.find((t) => t.id === id);
  if (tarefa) {
    tarefa.concluida = true;
    salvarTarefas(tarefas);
    console.log(`Tarefa "${tarefa.titulo}" concluída!`);
  } else {
    console.log("Tarefa não encontrada.");
  }
}

// Remover tarefa
function remover(id: number): void {
  let tarefas = lerTarefas();
  tarefas = tarefas.filter((t) => t.id !== id);
  salvarTarefas(tarefas);
  console.log(`Tarefa ${id} removida.`);
}

// Uso
adicionar("Estudar TypeScript");
adicionar("Fazer exercicios");
adicionar("Commitar no GitHub");
listar();
concluir(1);
listar();
```

---

## 5. Manipulando Caminhos com path

```typescript
import path from "path";

// Juntar partes de um caminho (resolve separadores do SO)
const arquivo = path.join("src", "models", "aluno.ts");
// Linux/Mac: "src/models/aluno.ts"
// Windows:   "src\\models\\aluno.ts"

// Caminho absoluto
const absoluto = path.resolve("src", "index.ts");
// "/Users/felipe/.../src/index.ts"

// Extrair partes
console.log(path.basename("src/models/aluno.ts"));   // "aluno.ts"
console.log(path.extname("aluno.ts"));                // ".ts"
console.log(path.dirname("src/models/aluno.ts"));     // "src/models"

// __dirname - diretório do arquivo atual
console.log(__dirname);
```

---

## 6. Manipulando Diretórios

```typescript
import fs from "fs";

// Criar diretório
if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

// Criar diretórios aninhados
fs.mkdirSync("output/relatórios/2026", { recursive: true });

// Listar conteúdo de um diretório
const arquivos: string[] = fs.readdirSync("src");
console.log(arquivos);  // ["index.ts", "models", "services"]

// Remover arquivo
fs.unlinkSync("arquivo-temporario.txt");
```

---

## 7. Tratamento de Erros

```typescript
import fs from "fs";

try {
  const dados = fs.readFileSync("não-existe.txt", "utf-8");
  console.log(dados);
} catch (erro) {
  if (erro instanceof Error) {
    console.log(`Erro ao ler arquivo: ${erro.message}`);
  }
}
```

Versão assíncrona:

```typescript
import fs from "fs/promises";

async function lerComSeguranca(caminho: string): Promise<string | null> {
  try {
    return await fs.readFile(caminho, "utf-8");
  } catch {
    console.log(`Arquivo "${caminho}" não encontrado.`);
    return null;
  }
}
```

---

## 8. Exemplo Completo - Gerador de Relatório

```typescript
import fs from "fs";
import path from "path";

interface Venda {
  produto: string;
  quantidade: number;
  precoUnitario: number;
}

// Ler vendas do JSON
const vendas: Venda[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "vendas.json"), "utf-8")
);

// Gerar relatório em texto
let relatorio = "=== RELATÓRIO DE VENDAS ===\n\n";

let totalGeral = 0;
vendas.forEach((venda, i) => {
  const subtotal = venda.quantidade * venda.precoUnitario;
  totalGeral += subtotal;
  relatorio += `${i + 1}. ${venda.produto}\n`;
  relatorio += `   Qtd: ${venda.quantidade} x R$ ${venda.precoUnitario.toFixed(2)}\n`;
  relatorio += `   Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
});

relatorio += `TOTAL GERAL: R$ ${totalGeral.toFixed(2)}\n`;

// Salvar relatório
const outputDir = path.join(__dirname, "relatórios");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const nomeArquivo = `relatorio-${new Date().toISOString().split("T")[0]}.txt`;
fs.writeFileSync(path.join(outputDir, nomeArquivo), relatorio, "utf-8");

console.log(`Relatório salvo em: relatórios/${nomeArquivo}`);
```

---

## 9. Git - Ignorando arquivos gerados

Adicione ao `.gitignore` arquivos que são **gerados** pelo programa:

```gitignore
# Dados gerados
*.log
relatorios/
output/

# Mas COMMITE os dados de exemplo:
# !vendas.json  (se quiser forcar a inclusao)
```

```bash
git add src/ vendas.json
git commit -m "Implementa gerador de relatório de vendas"
```

---

## Exercícios Práticos

### Exercício 1 - Logger simples
Crie `src/logger.ts`:
1. Função `log(mensagem: string): void` que adiciona ao arquivo `app.log`
2. Cada linha deve ter timestamp: `[2026-03-10 14:30:00] Mensagem aqui`
3. Função `lerLogs(): string[]` que retorna todas as linhas do log
4. Função `limparLogs(): void` que apaga o conteúdo

### Exercício 2 - Agenda persistente
Evolua a agenda da Aula 07 para persistir em `contatos.json`:
1. Funções: adicionar, remover, buscar, listar
2. Todas as operações devem ler e salvar no JSON
3. Os dados devem sobreviver ao reiniciar o programa

### Exercício 3 - Conversor CSV para JSON
Crie `src/csv-to-json.ts` que:
1. Lê um arquivo CSV (ex: `alunos.csv` com nome, nota, faltas)
2. Converte para array de objetos tipados
3. Salva como JSON
4. Bônus: crie também o conversor inverso (JSON para CSV)

### Exercício 4 - Sistema de configuração
Crie `src/config.ts`:
1. Interface `Config` com propriedades da aplicação
2. Função `carregarConfig()` que lê de `config.json` (ou cria com valores padrão)
3. Função `salvarConfig(config: Config)` que persiste as alterações
4. Função `resetarConfig()` que restaura os valores padrão

---

## Dica: IA e Manipulação de Arquivos

1. **Gerar dados de teste:** Peça ao Copilot: *"Gere um JSON com 20 produtos de uma loja virtual com nome, preço, categoria e estoque"*

2. **Converter formatos:** *"Como leio um arquivo CSV e converto para JSON em Node.js?"*

3. **Tratar erros:** Selecione seu código de leitura e peça: *"Adicione tratamento de erros robusto para esse código"*

> **Importante:** Ao manipular arquivos, sempre trate erros. Um arquivo pode não existir, estar corrompido, ou você pode não ter permissão de escrita.

---

## Leitura Complementar

- [Node.js - File System](https://nodejs.org/docs/latest/api/fs.html)
- [Node.js - Path](https://nodejs.org/docs/latest/api/path.html)

---

<!-- MIGRAR: origem aula11-intro-apis-rest (seção 6, Async/Await) -->

## Assincronia: Promises e async/await

```typescript
// Função assíncrona - retorna uma Promise
async function buscarDados(): Promise<string> {
  // await "espera" a Promise resolver
  const resposta = await fetch("https://api.exemplo.com/dados");
  const dados = await resposta.json();
  return dados;
}

// Chamando função assíncrona
async function main(): Promise<void> {
  const resultado = await buscarDados();
  console.log(resultado);
}

main();
```

> **Regra:** Sempre que usar `await`, a função precisa ser `async`. E o ponto de entrada (`main`) também precisa ser `async`.

> Esta aula trata assincronia como conteúdo próprio, antes de qualquer código de servidor — `fs/promises` reaproveita a mesma sintaxe `async/await` que será usada com `fetch` (aula08) e Express (aula09) mais adiante.

<!-- FIM MIGRAR -->
