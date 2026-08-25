# Aula 07 - Assincronia e Manipulação de Arquivos

**Modo de IA: Tutor** — pode perguntar, pedir explicação, pedir dica. Não pode pedir a solução.

## Objetivos da aula

- Explicar por que operações de I/O (arquivo, rede) são assíncronas em Node.js, e o que isso significa na prática.
- Usar `Promise`/`async`/`await` para lidar com operações assíncronas.
- Ler e escrever arquivos com `fs/promises`, incluindo JSON como formato de dados. Aqui o JSON é exercício, não a persistência final do curso (o projeto usa SQLite, ver aula10).

## Leitura prévia (antes da aula)

Leia este README. A assincronia introduzida aqui será reaproveitada em `fetch` (aula08) e em toda a stack do backend a partir da aula09.

---

## Conteúdo

### Por que assincronia existe

Em C, `fread()`/`fwrite()` bloqueiam o programa até a operação terminar: o processo simplesmente espera. Node.js é de thread única, então uma operação de I/O bloqueante travaria tudo, inclusive requisições de outros usuários num servidor. A solução é rodar as operações de I/O (arquivo, rede, timer) de forma assíncrona: o programa continua executando enquanto a operação acontece em segundo plano, e é avisado quando ela termina.

### Promises e async/await

Uma `Promise` representa um valor que vai existir no futuro (ou vai falhar):

```typescript
function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function exemplo(): Promise<void> {
  console.log("início");
  await esperar(1000);        // "pausa" esta função (não o programa todo) por 1s
  console.log("depois de 1 segundo");
}

exemplo();
console.log("isso aparece ANTES de 'depois de 1 segundo'");
```

Regras práticas:

- `await` só funciona dentro de uma função marcada `async`.
- `await` "espera" a Promise resolver, mas não bloqueia o resto do programa: outras tarefas continuam rodando enquanto isso.
- Erros de uma Promise são capturados com `try`/`catch`, igual código síncrono:

```typescript
async function buscarComSeguranca(): Promise<string | null> {
  try {
    const resultado = await operacaoQuePodeFalhar();
    return resultado;
  } catch (erro) {
    console.log(`Falhou: ${erro instanceof Error ? erro.message : erro}`);
    return null;
  }
}
```

> **Comparando com C:** não há equivalente direto, porque C não tem um modelo de concorrência embutido na linguagem (você usaria threads/`fork` manualmente). `async`/`await` é sintaxe para escrever código assíncrono parecendo síncrono, sem travar o programa.

### Lendo e escrevendo arquivos com fs/promises

```typescript
import fs from "fs/promises";

async function lerArquivo(): Promise<void> {
  const conteudo = await fs.readFile("dados.txt", "utf-8");
  console.log(conteudo);
}

async function escreverArquivo(): Promise<void> {
  await fs.writeFile("saida.txt", "Olá, mundo!");
}
```

> **Comparando com C:** `fs.readFile`/`fs.writeFile` fazem o papel de `fopen`+`fread`/`fwrite`+`fclose`, mas de forma assíncrona e sem gerenciar o ponteiro de arquivo manualmente. Existe também a versão síncrona (`fs.readFileSync`), útil em scripts pequenos; evite em qualquer coisa que vá virar servidor, porque ela bloqueia todo o processo.

### path: manipulando caminhos

```typescript
import path from "path";

path.join("src", "models", "aluno.ts");   // "src/models/aluno.ts" (resolve separador do SO)
path.extname("aluno.ts");                  // ".ts"
path.dirname("src/models/aluno.ts");       // "src/models"
```

### JSON como exercício de manipulação de arquivos

Ler e escrever um array de objetos como JSON é um bom exercício de `fs/promises` + `JSON.parse`/`JSON.stringify`, mas não é a arquitetura de persistência usada no restante do curso. A partir da aula10, o projeto passa a usar SQLite via `@libsql/client`; o padrão abaixo fica só nesta aula, como treino de arquivos.

```typescript
import fs from "fs/promises";

interface Tarefa { id: number; titulo: string; concluida: boolean; }

async function lerTarefas(caminho: string): Promise<Tarefa[]> {
  try {
    const dados = await fs.readFile(caminho, "utf-8");
    return JSON.parse(dados);
  } catch {
    return [];   // arquivo ainda não existe
  }
}

async function salvarTarefas(caminho: string, tarefas: Tarefa[]): Promise<void> {
  await fs.writeFile(caminho, JSON.stringify(tarefas, null, 2), "utf-8");
}

async function adicionar(caminho: string, titulo: string): Promise<Tarefa> {
  const tarefas = await lerTarefas(caminho);
  const nova: Tarefa = { id: tarefas.length + 1, titulo, concluida: false };
  tarefas.push(nova);
  await salvarTarefas(caminho, tarefas);
  return nova;
}
```

---

## Atividades em sala

1. **Previsão:** o professor mostra um trecho com duas chamadas assíncronas sem `await` correto (ex.: `console.log` antes de uma Promise resolver); preveja a ordem real de saída antes de rodar.
2. **Implementação guiada:** implemente `lerTarefas`/`salvarTarefas`/`adicionar` acima e teste manualmente rodando o script duas vezes seguidas, confirmando que os dados persistem entre execuções.

## Exercícios para casa

- **Exercício 1 (Tutor):** `src/logger.ts` com a função `log(mensagem: string): Promise<void>`, que adiciona uma linha com timestamp a `app.log`, e `lerLogs(): Promise<string[]>`, que retorna todas as linhas.
- **Exercício 2 (Tutor):** evolua o exemplo de tarefas acima: adicione `concluir(id)` e `remover(id)`, sempre lendo e salvando do arquivo JSON (sem manter estado em memória entre chamadas).
- **Exercício 3 (Sem IA):** escreva `buscarComSeguranca(caminho: string): Promise<string | null>`, que tenta ler um arquivo e retorna `null` (em vez de lançar) se ele não existir. Sem consultar IA, para fixar sozinho `try`/`catch` assíncrono.

## Critério de entrega

- Todas as funções de arquivo são `async` e usam `fs/promises` (não a versão `Sync`).
- Exercício 2 testado com o programa rodando duas vezes seguidas, confirmando persistência real em disco.
- Commit por exercício.
