# Aula 10 — Manipulação de arquivos e dados

> **Módulo:** M3 — Programa real: bibliotecas, arquivos e depuração
> **Ementa oficial:** E7 — Manipulação de arquivos
> **Skills:** S3 (reforça), S7 (reforça)
> **Pré-requisitos:** Aulas 01 a 09

## Objetivos

- Ler, escrever e acrescentar em arquivos com `node:fs/promises`
- Montar caminhos com `node:path` e tratar erros de I/O
- Usar JSON como banco de dados, com o padrão **repositório**
- Escrever de forma **atômica**, sem corromper dados numa falha
- Testar código que tem efeito colateral, usando pasta temporária
- Skill de dev-com-IA: **código que mexe em arquivo precisa de rede dupla**

## Por que isso importa quando a IA escreve o código

Até aqui, o pior que um bug fazia era devolver um número errado. A partir desta
aula, ele **apaga dados**.

E há um padrão específico que aparece o tempo todo em código gerado:

```typescript
try {
  alunos = JSON.parse(readFileSync(ARQUIVO, "utf8"));
} catch {
  alunos = [];      // "se der erro, começa vazio"
}
```

Parece defensivo. É destrutivo. Um arquivo corrompido — ou meio escrito por uma
queda anterior — é tratado como "arquivo vazio", e a próxima gravação substitui a
coleção inteira pelo registro novo. Todos os cadastros anteriores somem, sem erro,
sem log, sem ninguém perceber até alguém procurar.

Além disso, esta é a aula em que soltar um agente fica de fato arriscado: ele pode
escrever e apagar arquivos de verdade. A regra vira literal: **commite antes de
soltar a IA**, porque `git restore .` só funciona se houver um commit para onde voltar.

## Antes de começar

```bash
npm test -- aula10     # exemplos desta aula: devem PASSAR
npm run ex -- aula10   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Ler e escrever

```typescript
// aula10-arquivos-e-dados/exemplos/01-ler-e-escrever.ts
import { readFile, writeFile, appendFile, mkdir } from "node:fs/promises";

export async function lerTexto(caminho: string): Promise<string> {
  return readFile(caminho, "utf8");
}

export async function escreverTexto(caminho: string, conteudo: string): Promise<void> {
  await mkdir(dirname(caminho), { recursive: true });
  await writeFile(caminho, conteudo, "utf8");
}
```

Três decisões que percorrem o arquivo inteiro:

1. **Toda função recebe o caminho como parâmetro.** Sem isso, não dá para testar
   sem sujar o projeto — e você fica preso a onde o processo foi iniciado.
2. **Versão de promises** (`node:fs/promises`) com `async`/`await`, não a síncrona.
3. **`writeFile` sobrescreve**; `appendFile` acrescenta. Confundir os dois apaga arquivo.

> **Comparando com C:**
> ```c
> FILE *f = fopen("dados.txt", "r");
> if (f == NULL) { /* trata erro */ }
> fgets(linha, 100, f);
> fclose(f);
> ```
> Em C você abre, opera e **fecha** — esquecer o `fclose` vaza descritor. Aqui
> `readFile` faz tudo de uma vez e fecha sozinho. E o erro não vem por retorno
> `NULL`: vem por exceção, que você captura com `try/catch`.

### Caminhos

```typescript
import { join, dirname, extname, basename } from "node:path";
join("dados", "alunos.json")     // "dados/alunos.json" ou "dados\alunos.json"
```

**Nunca concatene com `"/"` na mão.** `join` usa o separador do sistema e normaliza
o caminho.

### Erros de I/O

```typescript
try {
  await readFile(caminho, "utf8");
} catch (erro) {
  if (erro instanceof Error && "code" in erro && erro.code === "ENOENT") {
    // arquivo não existe
  }
  throw erro;    // qualquer outra coisa: repassa
}
```

| Código | Significa |
| --- | --- |
| `ENOENT` | arquivo ou pasta não existe |
| `EACCES` | sem permissão |
| `EISDIR` | é uma pasta, não um arquivo |
| `ENOSPC` | disco cheio |

**Verifique:** `npm test -- 01-ler-e-escrever`

---

## 2. JSON como banco de dados

O padrão **repositório**: um módulo que esconde "como os dados são guardados" atrás
de funções com nomes de domínio.

```typescript
// aula10-arquivos-e-dados/exemplos/02-json-como-banco.ts
export async function lerColecao(caminho: string): Promise<Aluno[]>
export async function inserir(caminho: string, aluno: Aluno): Promise<Aluno>
export async function buscarPorId(caminho: string, id: string): Promise<Aluno | null>
export async function remover(caminho: string, id: string): Promise<boolean>
```

Quem usa não sabe que é JSON. Trocar por um banco de verdade depois muda só este módulo.

### Arquivo inexistente não é erro

```typescript
if (erro.code === "ENOENT") return [];   // banco que ainda não recebeu nada
```

Isso é diferente de engolir erro: só o **caso específico** de arquivo ausente vira
lista vazia. JSON corrompido continua explodindo, como deve.

### Escrita atômica

```typescript
export async function salvarColecao(caminho: string, alunos: Aluno[]): Promise<void> {
  const temporario = `${caminho}.tmp`;
  await writeFile(temporario, JSON.stringify(alunos, null, 2), "utf8");
  await rename(temporario, caminho);    // atômico no mesmo disco
}
```

Escrever direto no arquivo final significa que, se o processo cair no meio, o JSON
fica pela metade — e o arquivo inteiro, com **todos** os registros, vira lixo
ilegível. Com temporário + `rename`, ou a operação aconteceu por completo, ou não
aconteceu. Nunca um estado intermediário.

> **Quando a IA escreve isto:** escrita atômica quase nunca aparece em código
> gerado, porque o exemplo simples de `writeFile` é o que domina o texto de
> treinamento. Peça explicitamente: *"escreva de forma atômica: arquivo temporário
> e depois rename"*.

**Verifique:** `npm test -- 02-json-como-banco`

---

## 3. Testar código que mexe em arquivo

Este é o padrão que você vai repetir no projeto final:

```typescript
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";

let pasta: string;

beforeEach(async () => {
  pasta = await mkdtemp(join(tmpdir(), "aula10-"));   // pasta nova a cada teste
});

afterEach(async () => {
  await rm(pasta, { recursive: true, force: true });  // limpa
});
```

Três propriedades que isso garante:

- **Isolamento** — um teste não vê o que o anterior deixou.
- **Não suja o projeto** — nada é escrito dentro do repositório.
- **Ordem irrelevante** — os testes podem rodar em qualquer sequência.

> Lembra da Aula 06? Um teste que precisa de limpeza costuma indicar estado global.
> **Aqui é a exceção legítima:** o "estado global" é o disco, e ele existe mesmo.
> A resposta não é fingir que não existe — é dar a cada teste o seu próprio pedaço.

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"salva o cadastro do aluno num arquivo JSON"*

```typescript
// aula10-arquivos-e-dados/exemplos/leitura-critica/gerado-pela-ia.ts
const ARQUIVO = "dados/alunos.json";

export function salvarAluno(aluno: Aluno): void {
  let alunos: Aluno[] = [];
  if (existsSync(ARQUIVO)) {
    try {
      alunos = JSON.parse(readFileSync(ARQUIVO, "utf8")) as Aluno[];
    } catch {
      alunos = [];              // "arquivo corrompido: começa do zero"
    }
  }
  alunos.push(aluno);
  writeFileSync(ARQUIVO, JSON.stringify(alunos));
}
```

**Antes de rodar**, responda:

| Pergunta | Resposta |
| --- | --- |
| Onde exatamente é `"dados/alunos.json"` se eu rodar de outra pasta? | |
| O arquivo tem 500 alunos e um caractere corrompido. O que sobra depois de salvar? | |
| O processo cai durante o `writeFileSync`. Como fica o arquivo? | |
| Como eu escrevo um teste para esta função? | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta — três defeitos, em ordem crescente de gravidade.**
>
> **1. Caminho fixo.** `"dados/alunos.json"` é relativo ao diretório de onde o
> processo foi iniciado, não ao arquivo. A função grava em lugares diferentes
> dependendo de onde você roda — e **não há como testá-la** sem deixá-la escrever
> dentro do repositório. Repare no arquivo de teste desta seção: não existe um
> único teste que execute `salvarAluno`. Essa ausência é o sintoma.
>
> **2. O `catch` que apaga tudo.** Um arquivo com 500 alunos e um byte corrompido
> entra no `catch`, vira `[]`, recebe o aluno novo e é regravado com **um** registro.
> Os 499 anteriores desapareceram, sem erro, sem log. "Começar do zero" é uma
> decisão de negócio grave sendo tomada por um `catch` de duas linhas.
>
> **3. Escrita não atômica.** `writeFileSync` direto no arquivo final: uma queda no
> meio deixa JSON pela metade, e na próxima execução o defeito 2 termina o serviço.
>
> Documentado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`. Corrigir os
> três é o exercício 🚫 1.
>
> Sobre a pergunta 3: faltava **"receba o caminho como parâmetro"**, **"falhe alto
> se o arquivo estiver corrompido — nunca sobrescreva dados que você não conseguiu
> ler"** e **"escreva de forma atômica"**. Nenhuma dessas três aparece por padrão
> em código gerado; as três precisam ser pedidas.

---

## Verificação: como provar que funciona

- **Invariantes desta aula:**
  - nenhuma função de arquivo tem caminho fixo no corpo;
  - nenhum `catch` transforma "não consegui ler" em "estava vazio";
  - toda escrita de coleção é atômica;
  - nenhum teste escreve dentro do repositório.
- **Casos de borda obrigatórios:** arquivo inexistente · JSON corrompido · JSON que
  não é lista · pasta inexistente · coleção vazia · disco/permissão

```typescript
it("JSON corrompido REJEITA em vez de devolver vazio", async () => {
  await writeFile(banco, "{ isto nao e json", "utf8");
  await expect(lerAlunos(banco)).rejects.toThrow("arquivo corrompido");
});

it("nao deixa arquivo temporario para tras", async () => {
  await salvarAlunos(banco, [ana]);
  expect(await readdir(pastaDados)).toEqual(["alunos.json"]);
});
```

Depois de rodar qualquer coisa que mexa em arquivo:

```bash
git status     # apareceu arquivo que você não esperava?
```

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Persistir dados | "salva num arquivo JSON" | "Receba o caminho como parâmetro. Escreva de forma atômica (temporário + rename). Arquivo corrompido deve lançar erro, nunca ser tratado como vazio." | As três coisas que não vêm de graça |
| Tratar ausência | "trata o erro de arquivo" | "Só `ENOENT` deve virar coleção vazia. Qualquer outro erro é repassado." | Distingue ausente de ilegível |
| Testar | "escreve testes pra isso" | "Use `mkdtemp` numa pasta temporária, com limpeza em `afterEach`. Nenhum teste pode escrever dentro do repositório." | Impede teste que suja o projeto |
| Revisar | "tá certo?" | "Este código pode perder dados em alguma situação? Liste os cenários." | Pergunta pelo dano, não pela corretude |

O último é **o** prompt de revisão desta aula. Perguntar "pode perder dados?" leva
a IA a examinar exatamente os caminhos que ela mesma tende a escrever mal.

**Ferramenta por ferramenta**

- *Copilot inline:* vai sugerir `writeFileSync` direto e caminho fixo. Corrija os dois.
- *Copilot Chat:* selecione o repositório e pergunte pelos cenários de perda de dados.
- *Chat de navegador:* bom para entender códigos de erro (`ENOENT`, `EACCES`).
- *Agente:* exercício 3 — **e aqui a advertência é literal**: ele escreve e apaga
  arquivos de verdade. Commite antes.

---

## Git desta aula: ignorar dados gerados

```gitignore
dados/*.json
!dados/exemplo.json
tmp/
*.log
```

Versione a **estrutura** e um exemplo; não versione os dados de execução.

```bash
git status                  # o agente criou algo inesperado?
git clean -n                # lista arquivos não rastreados (simulação)
git restore .               # desfaz o que não foi commitado
```

> **Rede de segurança — agora é literal.** Nas aulas anteriores, um agente
> desastrado estragava código. Aqui ele pode apagar arquivos. `git restore .` só
> te devolve o que estava commitado. **Commite antes de soltá-lo.**

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Repositório de alunos**
Arquivo: `exercicios/01-repositorio.ts` · Teste: `npm run ex -- 01-repositorio`

- Corrija os três defeitos: caminho por parâmetro, falha alta em JSON corrompido,
  escrita atômica.
- Atenção: arquivo **inexistente** devolve `[]`; arquivo **corrompido** lança.
  A diferença entre os dois é a aula inteira.
- **Aceite:** os 13 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Leitor e gerador de CSV**
Arquivo: `exercicios/02-csv.ts` · Teste: `npm run ex -- 02-csv`

- O Copilot vai sugerir `linha.split(",")` imediatamente. **Isso quebra** em campo
  com vírgula entre aspas — o caso mais comum de CSV vindo de planilha.
- É um bom exemplo de sugestão que passa nos seus primeiros testes e falha com
  dado real.
- **Aceite:** os 15 testes verdes **e** você consegue explicar o tratamento de aspas.

### 🤖 Com agente — você especifica e revisa

**3. Importador de pasta**
Arquivo: `exercicios/03-importador.ts` · Spec: `exercicios/03-importador.spec.md`

- **`git status` limpo e trabalho commitado antes de soltar o agente.**
- Procure no diff por `catch` que descarta erro sem registrar em `problemas`.
- Confira se ele leu os arquivos em ordem alfabética — a ordem decide qual RA
  duplicado vence.
- **Aceite:** os 13 testes verdes **e** as 5 perguntas de revisão respondidas.

---

## Autoavaliação

- [ ] Passo o caminho por parâmetro em toda função que mexe em arquivo.
- [ ] Sei distinguir "arquivo não existe" de "arquivo ilegível" no tratamento de erro.
- [ ] Sei explicar por que escrita atômica evita perda de dados.
- [ ] Sei testar código com efeito colateral usando pasta temporária.
- [ ] Achei os três defeitos da leitura crítica sem rodar o código.
- [ ] Commitei antes de deixar um agente mexer em arquivos.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| `catch { dados = [] }` | perda silenciosa da coleção inteira | Falhe alto; só `ENOENT` vira vazio |
| Caminho fixo na função | grava em lugar diferente conforme onde roda | Caminho por parâmetro |
| `writeFile` direto no destino | JSON pela metade após queda | Temporário + `rename` |
| `writeFile` onde queria `appendFile` | arquivo sobrescrito | Confira qual das duas |
| Concatenar caminho com `"/"` | quebra no Windows | `join` |
| Teste que escreve no projeto | resultados dependem da execução anterior | `mkdtemp` + `afterEach` |
| Esquecer `await` | escrita não terminou quando o teste checou | `await` em toda operação de I/O |

---

## Resumo

A partir desta aula, um bug apaga dados. O padrão mais perigoso em código gerado é
o `catch` que trata "não consegui ler o arquivo" como "o arquivo estava vazio" — e
regrava a coleção inteira com um registro só, em silêncio. As três coisas que
código gerado quase nunca traz de graça, e que você precisa pedir: **caminho por
parâmetro** (senão não dá nem para testar), **falha alta em arquivo corrompido**
(nunca sobrescreva o que você não conseguiu ler) e **escrita atômica** (temporário
+ `rename`, para que uma queda no meio não deixe estado intermediário). Testar isso
exige pasta temporária por teste. E a regra de commitar antes de soltar a IA, que
até aqui era prudência, aqui é literal: o agente escreve e apaga arquivos de verdade.

---

## Leitura complementar

- [Node.js — File system (fs/promises)](https://nodejs.org/api/fs.html#promises-api)
- [Node.js — Path](https://nodejs.org/api/path.html)
- [MDN — JSON](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON)
