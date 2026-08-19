# Aula 09 — Módulos, bibliotecas e segurança de dependências

> **Módulo:** M3 — Programa real: bibliotecas, arquivos e depuração
> **Ementa oficial:** E5 — Funções de biblioteca
> **Skills:** S10 (introduz), S9 (introduz)
> **Pré-requisitos:** Aulas 01 a 08

## Objetivos

- Organizar código em módulos com `export` / `import` (ESM)
- Usar a biblioteca padrão em vez de reimplementar o que já existe
- Entender `package.json`, semver e o papel do `package-lock.json`
- Reconhecer **dependência alucinada** e auditar um pacote antes de instalar
- Proteger segredos, e saber o que fazer quando um vaza
- Skill de dev-com-IA: **ceticismo calibrado com o que a IA manda instalar**

## Por que isso importa quando a IA escreve o código

Peça a um modelo uma funcionalidade qualquer e ele frequentemente responde com um
`npm install`. O nome do pacote soa perfeitamente razoável — `cpf-validador-br`,
`date-format-ptbr` — a sintaxe de importação está certa, e o exemplo de uso
funciona no texto. Só que o pacote não existe.

Isso tem nome: **alucinação de dependência**. E criou uma superfície de ataque nova
— atacantes registram no npm exatamente os nomes que os modelos costumam inventar,
esperando que alguém instale sem conferir. A prática ficou conhecida como
*slopsquatting*.

Um `npm install` é a operação mais perigosa que você executa rotineiramente: ele
baixa código de terceiros e roda scripts de instalação na sua máquina, com as suas
permissões. **É a única linha do dia que merece uma conferência antes de ser
executada.**

A outra metade da aula é o lado positivo: boa parte do que a IA se oferece para
implementar já existe na biblioteca padrão, testada por milhões de pessoas.

## Antes de começar

```bash
npm test -- aula09     # exemplos desta aula: devem PASSAR
npm run ex -- aula09   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Módulos

Um módulo é um arquivo. O que ele `export`a é público; o resto é interno.

```typescript
// aula09-modulos-e-bibliotecas/exemplos/loja/precos.ts
const CASAS_DECIMAIS = 2;                 // interno — ninguém de fora vê

export function arredondar(valor: number): number { /* ... */ }
export default function formatarReal(valor: number): string { /* ... */ }
```

```typescript
import { arredondar } from "./precos.js";           // nomeado
import formatarReal from "./precos.js";             // default
import * as precos from "./precos.js";              // tudo num objeto
```

> **A extensão `.js` no import não é erro de digitação.** Em ESM, o caminho aponta
> para o arquivo que vai existir **em tempo de execução**, e é assim que o Node
> resolve. Você escreve `.ts` e importa `.js`. Errar isso dá
> `ERR_MODULE_NOT_FOUND`, e é a primeira coisa a conferir quando um import quebra.

> **Comparando com C:**
> ```c
> #include "precos.h"    // o pré-processador COLA o conteúdo do arquivo
> ```
> `#include` é substituição de texto: tudo do header entra no seu arquivo. `import`
> é diferente — cada módulo tem seu próprio escopo, e você escolhe nome a nome o
> que traz. Não existe "vazamento" de definições, e não existe *include guard*.

### Barril (`index.ts`)

```typescript
// aula09-modulos-e-bibliotecas/exemplos/loja/index.ts
export { arredondar, aplicarPercentual } from "./precos.js";
export { calcularImposto } from "./impostos.js";
```

Quem usa importa de `./loja/index.js` sem precisar saber a organização interna. Se
você reorganizar os arquivos, só o barril muda.

**Verifique:** `npm test -- 01-modulos`

---

## 2. Funções de biblioteca

A ementa fala em "funções de biblioteca" — o que em C eram `stdio.h`, `string.h`,
`math.h`. Hoje há três camadas:

| Camada | Exemplos | Precisa instalar? |
| --- | --- | --- |
| Biblioteca padrão da linguagem | `Array`, `String`, `Math`, `JSON`, `Date` | não |
| Módulos embutidos do Node | `node:fs`, `node:path`, `node:crypto` | não |
| Terceiros, via npm | `express`, `zod` | sim |

**A regra da aula:** antes de escrever (ou aceitar) uma função, pergunte se a
biblioteca padrão já faz. Depois **confira a assinatura na documentação** — não na
memória, nem na do modelo.

```typescript
// aula09-modulos-e-bibliotecas/exemplos/02-biblioteca-padrao.ts
numeros.reduce((a, b) => a + b, 0)
Math.max(...numeros)
texto.trim().toLowerCase().split(/\s+/)
numeros.toSorted((a, b) => a - b)     // não muta, ao contrário de sort
```

> **Quando a IA escreve isto:** modelos confundem métodos parecidos com frequência
> — `slice` com `splice`, `sort` com `toSorted`, a ordem dos argumentos de
> `splice`, o que `reduce` faz sem valor inicial. O código sai plausível. Ao
> revisar, para cada método invocado, confirme na MDN: existe? a assinatura bate?
> muta ou copia?

**Verifique:** `npm test -- 02-biblioteca-padrao`

---

## 3. npm, semver e o lockfile

```json
{
  "dependencies":    { "express": "^5.0.0" },
  "devDependencies": { "vitest": "^3.0.0" }
}
```

- **`dependencies`** — o programa precisa disto para rodar.
- **`devDependencies`** — só para desenvolver e testar.

### Semver: `MAIOR.MENOR.CORREÇÃO`

| Mudou | Significa |
| --- | --- |
| CORREÇÃO (`1.2.3` → `1.2.4`) | correção de bug, compatível |
| MENOR (`1.2.3` → `1.3.0`) | funcionalidade nova, compatível |
| MAIOR (`1.2.3` → `2.0.0`) | **pode quebrar** seu código |

| Prefixo | Aceita |
| --- | --- |
| `^1.2.3` | `1.x.x` — não passa para `2.0.0` |
| `~1.2.3` | `1.2.x` — só correções |
| `1.2.3` | exatamente essa |
| `*` ou `>=1.0.0` | **qualquer** — evite |

### `package-lock.json`

Registra as versões **exatas** instaladas, inclusive das dependências das
dependências. **Commite sempre.** Sem ele, cada pessoa da equipe (e o CI) instala
versões ligeiramente diferentes, e "na minha máquina funciona" vira um fenômeno
real e reproduzível.

`npm ci` instala exatamente o que está no lockfile. É o que o CI deste repositório usa.

---

## 4. Segurança: o que conferir antes de instalar

Quando a IA sugerir um pacote, faça isto **antes** do `npm install`:

1. **O pacote existe?** Abra `https://www.npmjs.com/package/<nome>`. 404 já responde.
2. **Quantos downloads semanais?** Menos de mil para uma tarefa comum é bandeira vermelha.
3. **Tem repositório?** Pacote sem link para o código-fonte não dá para auditar.
4. **Quando foi a última publicação?** Anos parado significa sem correção de segurança.
5. **O nome está certo?** Confira caractere a caractere — *typosquatting* vive de
   `expres`, `lodahs`, `crossenv`.
6. **Precisa mesmo?** Uma função de dez linhas não justifica uma dependência.

> **Slopsquatting:** pesquisas mostraram que modelos inventam nomes de pacote de
> forma **consistente** — o mesmo nome falso reaparece em execuções diferentes.
> Atacantes registram esses nomes e esperam. O código malicioso costuma rodar no
> script `postinstall`, ou seja, **antes** de você chegar a importar qualquer coisa.

### Segredos

```gitignore
.env
.env.*
!.env.example
```

Nunca commite token, senha ou chave de API. Se acontecer:

1. **Revogue a credencial imediatamente.** Este é o passo que importa.
2. Só depois limpe o histórico. `git rm` não basta: o segredo continua nos commits
   anteriores, e o repositório pode já ter sido clonado.

E o mesmo vale para o chat: **o que você cola num chat de navegador sai da sua
máquina.** Não cole `.env`, dado de cliente, nem código sob acordo de confidencialidade.

---

## 5. Contexto para o agente

Você já tem um exemplo pronto neste repositório: o [`AGENTS.md`](../AGENTS.md) da
raiz. Leia-o agora com atenção — na Aula 12 você vai escrever um.

Repare que uma das regras dele é justamente o assunto desta aula:

> *"Não instale dependências novas sem pedir confirmação e justificar por que a
> biblioteca padrão não resolve."*

Contexto é algo que você **projeta**: você decide, antes da tarefa, o que o agente
pode e não pode fazer. Cada ferramenta lê um arquivo diferente — daí este
repositório ter `AGENTS.md`, `CLAUDE.md` e `.github/copilot-instructions.md`,
os dois últimos apontando para o primeiro.

---

## Leitura crítica: ache o bug

O pedido foi:

> *"preciso validar CPF e formatar datas no meu projeto"*

E a IA respondeu:

> *"Instale as bibliotecas:*
> *`npm install cpf-validador-br date-format-ptbr`*
> *E use: `import { validarCPF } from 'cpf-validador-br';`"*

**Nenhum desses dois pacotes existe.** Os nomes são plausíveis, a sintaxe está
correta, o exemplo parece pronto para colar. Essa é a primeira metade da lição:
o defeito não estava no código, estava na instrução de instalar.

A segunda metade está no arquivo, que traz as mesmas funções escritas **sem
dependência** — e com defeitos:

```typescript
// aula09-modulos-e-bibliotecas/exemplos/leitura-critica/gerado-pela-ia.ts
export function formatarData(iso: string): string {
  const data = new Date(iso);
  const dia = String(data.getDate()).padStart(2, "0");
  // ...
}
```

**Antes de rodar**, responda:

| Pergunta | Resposta |
| --- | --- |
| `new Date("2026-03-01")` é meia-noite de qual fuso? | |
| `getDate()` devolve o dia em qual fuso? | |
| O Brasil está a leste ou a oeste de Greenwich? | |
| `validarCPF("111.111.111-11")` — os dígitos verificadores batem? | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta — dois defeitos.**
>
> **Fuso.** `new Date("2026-03-01")` interpreta a string como **UTC**, mas
> `getDate()` devolve o dia no fuso **local**. Em UTC−3, meia-noite UTC é 21h do dia
> anterior — a função devolve `28/02/2026`. O bug é invisível na máquina de quem
> desenvolve em UTC e aparece para todo usuário brasileiro. (Este repositório fixa
> `TZ: "America/Sao_Paulo"` na configuração do Vitest justamente para que o teste
> reproduza a realidade do aluno, e não a do servidor.)
>
> **CPF.** `111.111.111-11` **passa** na conta dos dígitos verificadores — a
> matemática está certa. Sequências repetidas precisam de uma verificação separada,
> que quase toda implementação gerada esquece, porque a fórmula é o que aparece no
> texto de treinamento e a exceção não.
>
> Documentado e provado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`.
> Corrigir é o exercício 🚫 1.
>
> Sobre a pergunta 3: faltava **"sem instalar dependências"** e **"o resultado não
> pode depender do fuso horário da máquina"**. As duas linhas cabem em qualquer
> prompt e teriam evitado os dois problemas.

---

## Verificação: como provar que funciona

- **Invariantes desta aula:**
  - nenhuma dependência nova entrou sem conferência no npm;
  - nada que dependa de data usa o fuso da máquina implicitamente;
  - nenhum segredo aparece no diff.
- **Casos de borda obrigatórios:** vazio · formato inválido · limite exato de faixa · fuso

```bash
npm run typecheck
npm test -- aula09
git diff --staged                       # nenhum segredo antes de commitar
npm ls <pacote>                          # de onde essa dependência veio?
```

Antes de aceitar um `npm install` sugerido por IA:

```bash
npm view <pacote>            # existe? última publicação? repositório?
npm view <pacote> versions   # histórico de versões
```

Se `npm view` der erro, o pacote não existe. Fim da conversa.

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Resolver uma tarefa | "como valido CPF?" | "Implemente validação de CPF **sem instalar dependências**, usando só a biblioteca padrão." | Elimina a alucinação na origem |
| Avaliar sugestão | "esse pacote é bom?" | "Este pacote existe no npm? Me dê o link, downloads semanais e data da última publicação." | Pede evidência verificável |
| Datas | "formata a data" | "Formate sem usar `new Date(string)`; o resultado não pode depender do fuso da máquina." | Nomeia a armadilha |
| Escolher biblioteca | "que biblioteca uso pra isso?" | "Isso dá para resolver com a biblioteca padrão? Se não, quais são as opções e o que cada uma custa em tamanho e manutenção?" | Trata dependência como custo |

> **Cuidado com a resposta confiante.** Um modelo não sabe que não sabe. Ele não
> tem como distinguir um pacote que existe de um que soa como se existisse — e vai
> descrever os dois com a mesma segurança.

**Ferramenta por ferramenta**

- *Copilot inline:* pode completar um `import` de pacote inexistente. Confira todo import novo.
- *Copilot Chat:* bom para explicar semver e o que uma flag do npm faz.
- *Chat de navegador:* peça o link do npm junto com a sugestão — assim você confere em um clique.
- *Agente:* exercício 3. E note que o `AGENTS.md` já o proíbe de instalar sem confirmar.

---

## Git desta aula: lockfile e segredos

```bash
# o lockfile É versionado
git add package-lock.json
git commit -m "chore: atualiza dependencias"

# segredo commitado por engano
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "chore: remove .env do versionamento"
# ATENCAO: o segredo continua no historico. REVOGUE a credencial.
```

> **Rede de segurança:** ative o *secret scanning* nas configurações do repositório
> no GitHub. Ele avisa quando um token conhecido aparece num push — às vezes antes
> de você perceber.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Validadores sem dependência**
Arquivo: `exercicios/01-validadores.ts` · Teste: `npm run ex -- 01-validadores`

- Corrija os dois defeitos: sequências repetidas no CPF e o fuso na data.
- Para a data: **não use `new Date(texto)`**. Trabalhe com a própria string.
- **Aceite:** os 15 testes verdes, sem instalar nada.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Organizar em módulos**
Arquivos: `exercicios/relatorio/formatacao.ts`, `exercicios/relatorio/calculo.ts`
Teste: `npm run ex -- 02-organizar`

- Implemente os dois módulos; o barril `index.ts` já está pronto.
- A pergunta que decide a divisão: **o que muda junto?** Formatação muda quando o
  layout muda; cálculo muda quando a regra muda. São motivos diferentes.
- **Aceite:** os 14 testes verdes **e** você consegue justificar a divisão.

### 🤖 Com agente — você especifica e revisa

**3. Auditoria de dependências**
Arquivo: `exercicios/03-auditoria-dependencias.ts` · Spec: `exercicios/03-auditoria-dependencias.spec.md`

- O tema é o próprio assunto da aula. Fique atento se o agente sugerir instalar
  `date-fns`, `semver` ou `dayjs` — e confira cada uma no npm antes de aceitar.
- Cuidado com a comparação de datas: `new Date(texto)` traz o problema de fuso de volta.
- **Aceite:** os 15 testes verdes, sem dependência nova **e** as 4 perguntas
  de revisão respondidas.

---

## Autoavaliação

- [ ] Sei por que o import ESM leva `.js` mesmo apontando para um `.ts`.
- [ ] Sei explicar semver e por que `^` não passa para a versão MAIOR seguinte.
- [ ] Confiro um pacote no npm antes de instalar o que a IA sugeriu.
- [ ] Sei o que fazer, na ordem certa, quando um segredo vaza.
- [ ] Achei os dois defeitos da leitura crítica sem rodar o código.
- [ ] Li o `AGENTS.md` deste repositório.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| Import sem `.js` | `ERR_MODULE_NOT_FOUND` | Sempre `./arquivo.js` |
| Pacote alucinado | `404 Not Found` no install — ou pior, instala algo malicioso | `npm view <pacote>` antes |
| `new Date("aaaa-mm-dd")` | dia volta um em UTC−3 | Trabalhe com a string, ou use `getUTC*` |
| Lockfile não commitado | "na minha máquina funciona" | Versione o `package-lock.json` |
| `.env` commitado | credencial exposta para sempre | `.gitignore` antes do primeiro commit; revogue se vazar |
| Dependência para 10 linhas | superfície de ataque e manutenção | Escreva as 10 linhas |

---

## Resumo

Módulos organizam código por **motivo de mudança**, e o import ESM sempre aponta
para `.js`, mesmo quando o arquivo é `.ts`. Boa parte do que a IA se oferece para
implementar já existe na biblioteca padrão — e boa parte do que ela manda instalar
**não existe em lugar nenhum**: alucinação de dependência é comum, os nomes
inventados se repetem entre execuções, e há quem registre esses nomes esperando o
`npm install` desatento. Por isso `npm install` é a operação rotineira mais
perigosa que você executa: confira que o pacote existe, quantos downloads tem,
se tem repositório e quando foi publicado pela última vez. Versione o lockfile,
nunca versione segredo — e se vazar, revogue antes de limpar o histórico.

---

## Leitura complementar

- [Node.js — Modules: ECMAScript modules](https://nodejs.org/api/esm.html)
- [npm — About semantic versioning](https://docs.npmjs.com/about-semantic-versioning)
- [MDN — JavaScript Standard built-in objects](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects)
- [GitHub Docs — Secret scanning](https://docs.github.com/pt/code-security/secret-scanning)
