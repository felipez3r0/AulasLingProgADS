# Aula 01 — Ambiente e os quatro modos de usar IA

> **Módulo:** M1 — Fundação: ambiente, versionamento e verificação
> **Ementa oficial:** transversal (instrumental)
> **Skills:** S3 (introduz), S8 (introduz), S10 (introduz)
> **Pré-requisitos:** nenhum

## Objetivos

- Deixar seu ambiente rodando: Node, VS Code, Git e o repositório do curso
- Executar seu primeiro teste automatizado — antes de escrever o primeiro `if`
- Conhecer as **quatro** formas de usar IA para programar e saber qual cabe em cada tarefa
- Fazer seu primeiro commit
- Skill de dev-com-IA: **nada entra no seu código sem que você saiba verificar**

## Por que isso importa quando a IA escreve o código

Você vai passar o semestre recebendo código que não escreveu. Sugestão de
autocomplete, resposta de chat, diff de agente — tudo chega com aparência de
pronto. A pergunta que decide se você é o programador ou o passageiro é sempre a
mesma: **como eu sei que isso está certo?**

Essa pergunta só tem resposta se você tiver como executar e verificar. Por isso a
primeira aula não é sobre sintaxe: é sobre montar a bancada onde tudo o mais vai
ser conferido. Um curso que começasse pelo `console.log` estaria ensinando você a
provar que o programa *rodou*. O que interessa é provar que ele fez a *coisa certa*.

## Antes de começar

```bash
npm install            # uma vez só, na raiz do repositório
npm test -- aula01     # exemplos desta aula: devem PASSAR
npm run ex -- aula01   # exercícios: devem FALHAR (é o esperado)
```

Se o primeiro comando falhar, resolva o ambiente antes de seguir:
[recursos/setup.md](../recursos/setup.md).

---

## 1. O ambiente

Quatro peças, e o que cada uma faz:

| Peça | Papel |
| --- | --- |
| **Node.js** | executa JavaScript fora do navegador — é o que roda seus programas |
| **VS Code** | editor; é onde o Copilot vive |
| **Git** | histórico do seu código; é a sua rede de segurança |
| **GitHub** | o Git na nuvem; é onde a colaboração e a revisão acontecem |

Confira que está tudo instalado:

```bash
node --version    # v20 ou superior
npm --version
git --version
```

> **Comparando com C:**
> ```c
> // Em C voce compila e depois executa:
> gcc programa.c -o programa
> ./programa
> ```
> Aqui não há etapa de compilação separada: `npx tsx arquivo.ts` verifica os tipos
> e executa de uma vez. O TypeScript é apagado antes de rodar — ele existe para o
> **compilador conferir o seu código**, não para o Node.

---

## 2. O primeiro programa não imprime nada

```typescript
// aula01-ambiente-e-modos-de-ia/exemplos/01-primeiro-programa.ts
export function saudacao(nome: string): string {
  return `Ola, ${nome}! Bem-vindo a disciplina.`;
}
```

Repare: nenhum `console.log`. A função **devolve** o texto em vez de imprimi-lo.
Isso não é preciosismo — é o que torna a função verificável:

```typescript
// aula01-ambiente-e-modos-de-ia/exemplos/01-primeiro-programa.spec.ts
it("inclui o nome recebido", () => {
  expect(saudacao("Ana")).toBe("Ola, Ana! Bem-vindo a disciplina.");
});
```

Um `console.log` prova que o código rodou. Um teste prova que ele fez a coisa certa.
Durante o semestre inteiro, é a segunda garantia que você vai precisar.

> **Quando a IA escreve isto:** modelos adoram enfiar `console.log` no meio de
> funções. Fica difícil de testar e polui a saída. Se você receber uma função que
> imprime em vez de retornar, esse é o primeiro ajuste a pedir.

**Verifique:** `npm test -- aula01/exemplos/01`

---

## 3. O que um teste prova — e o que ele não prova

Este é o exemplo mais importante da aula. Duas funções com a mesma assinatura:

```typescript
// aula01-ambiente-e-modos-de-ia/exemplos/02-o-que-um-teste-prova.ts
export function aplicarDescontoCerto(valor: number, percentual: number): number {
  return valor - valor * (percentual / 100);
}

export function aplicarDescontoErrado(valor: number, percentual: number): number {
  return valor - percentual / 100;
}
```

Agora um teste que parece razoável:

```typescript
it("as duas devolvem menos que o valor original", () => {
  expect(aplicarDescontoCerto(100, 10)).toBeLessThan(100);
  expect(aplicarDescontoErrado(100, 10)).toBeLessThan(100);   // passa também!
});
```

**As duas passam.** A versão errada devolve `99.9` em vez de `90`, e o teste aprova,
porque `99.9` de fato é menor que `100`.

O que separa as duas é afirmar o **valor esperado**, não uma propriedade vaga:

```typescript
it("10% de desconto sobre 100 deve dar 90", () => {
  expect(aplicarDescontoCerto(100, 10)).toBe(90);
});
```

> **Quando a IA escreve isto:** peça testes à IA e você frequentemente recebe
> asserções frouxas — `toBeDefined()`, `toBeTruthy()`, `not.toBeNull()`. Elas
> deixam a suíte verde sem provar nada. Ao revisar um teste gerado, pergunte:
> *que implementação errada passaria neste teste?* Se você conseguir imaginar uma,
> o teste é fraco.

**Verifique:** `npm test -- aula01/exemplos/02`

---

## 4. Os quatro modos de usar IA

Não são intercambiáveis. Usar o modo errado é a causa mais comum de "a IA não
ajudou" e de "a IA fez demais e eu não entendo mais meu código".

| Modo | Ferramenta | Tamanho da tarefa | Onde roda |
| --- | --- | --- | --- |
| **1. Autocomplete** | Copilot inline | linha, função curta | no editor, enquanto você digita |
| **2. Chat** | Copilot Chat, Claude, ChatGPT, Gemini | um conceito, um bug, um trecho | painel lateral ou navegador |
| **3. Agente** | Claude Code, Codex CLI, Cursor | vários arquivos, tarefa inteira | terminal — **mexe nos seus arquivos** |
| **4. Agente no GitHub** | Copilot Agent | uma issue fechada | na nuvem — abre um Pull Request |

### A pergunta que decide

```
Eu sei exatamente o que quero?
├── NÃO → Modo 2 (chat), até você saber
└── SIM → é só uma linha ou função curta?
          ├── SIM → Modo 1 (autocomplete)
          └── NÃO → eu tenho um comando que prova que ficou pronto?
                    ├── NÃO → volte: escreva o teste primeiro
                    └── SIM → Modo 3 (local) ou Modo 4 (com revisão de outra pessoa)
```

O caminho que este curso pede que você **não** tome: "não sei o que quero, então
vou mandar o agente fazer". Produz código que funciona por acaso e que você não
consegue consertar quando parar de funcionar.

Detalhamento completo, com técnicas para cada modo:
[recursos/guia-ferramentas-ia.md](../recursos/guia-ferramentas-ia.md).

> **Quando a IA escreve isto:** a partir da Aula 12 você vai usar o Modo 3 de
> verdade. Até lá, os modos 1 e 2 são suficientes — e a trilha de exercícios diz
> em cada caso qual usar.

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"faz uma função que calcula a média de um array de notas"*

```typescript
// aula01-ambiente-e-modos-de-ia/exemplos/leitura-critica/gerado-pela-ia.ts
export function calcularMedia(notas: number[]): number {
  let soma = 0;
  for (let i = 0; i < notas.length; i++) {
    soma += notas[i]!;
  }
  return soma / notas.length;
}
```

**Antes de rodar**, preencha a tabela para a entrada `[]` (array vazio):

| Passo | Estado | Valor |
| --- | --- | --- |
| início | `soma` | |
| condição do `for` | `0 < 0` | |
| quantas voltas o laço dá | | |
| retorno | `soma / notas.length` | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta:** com array vazio, o laço não executa nenhuma vez, e o retorno vira
> `0 / 0` — que em JavaScript **não lança erro**: devolve `NaN`, em silêncio. A
> função não quebra; ela contamina tudo o que depender dela. `NaN + 10` é `NaN`,
> `NaN > 5` é `false`, e o aluno some do boletim sem nenhuma mensagem de erro.
>
> Isso está documentado e **provado por um teste** em
> `exemplos/leitura-critica/gerado-pela-ia.spec.ts` — esse teste passa, porque ele
> afirma o comportamento defeituoso. Corrigir é o exercício 🚫 1.
>
> Sobre a pergunta 3: o prompt dizia o caminho feliz e nada sobre o caso vazio.
> A IA implementou exatamente o que foi pedido. **O caso de borda que você não
> menciona é o caso de borda que você não recebe.**

---

## Verificação: como provar que funciona

- **Invariante desta aula:** toda função que você aceitar precisa ter um resultado
  definido para entrada vazia, zero e negativa.
- **Casos de borda obrigatórios:** vazio · zero · negativo · limite · ausente
- **O teste que pegaria o bug acima:**

```typescript
it("array vazio devolve 0", () => {
  expect(calcularMedia([])).toBe(0);
});
```

Comandos:

```bash
npm test -- aula01     # exemplos: devem passar
npm run ex -- aula01   # exercícios: falham até você resolver
npm run typecheck      # o compilador confere seus tipos sem rodar nada
```

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Instalar algo | "como instalo node" | "Estou no Windows 11 e `node --version` dá 'command not found' depois de instalar. O que verificar?" | Descreve o estado real, não a intenção |
| Entender erro | "deu erro" | "Rodei `npm test` e recebi: [stack trace completo]. O que isso significa?" | Erro completo, não resumo |
| Gerar função | "faz uma função de média" | "Implemente `media(notas: number[]): number`. Array vazio retorna 0. Não modifique o array recebido." | Assinatura + caso de borda + restrição |

**Ferramenta por ferramenta**

- *Copilot inline:* ainda não. Nesta aula você vai desligá-lo no exercício 1.
- *Copilot Chat:* use `/explain` sobre o exemplo 2 e pergunte "que implementação
  errada passaria neste teste?".
- *Chat de navegador:* bom para problemas de instalação, que são específicos do seu sistema.
- *Agente:* só a partir da Aula 12. O exercício 3 é uma prévia opcional.

---

## Git desta aula: primeiro commit

```bash
git status                        # o que mudou
git add aula01-ambiente-e-modos-de-ia/exercicios/01-media-corrigida.ts
git commit -m "aula01: corrige media para array vazio"
git log --oneline                 # seu histórico
```

Configure sua identidade, se ainda não fez — ela vai em todo commit:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

> **Rede de segurança:** commitar não é "salvar backup". É criar um ponto ao qual
> você pode voltar. A partir da Aula 12, quando um agente alterar dez arquivos de
> uma vez, esse ponto de retorno é a diferença entre "desfiz" e "perdi".

---

## Exercícios

Faça **nesta ordem**. O nível 🚫 constrói o modelo mental que torna 🤝 e 🤖 seguros.

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Corrija a média**
Arquivo: `exercicios/01-media-corrigida.ts` · Teste: `npm run ex -- aula01/01`

- Implemente `calcularMedia` corrigindo o defeito da leitura crítica.
- Array vazio deve devolver `0`, nunca `NaN`.
- **Aceite:** os 6 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Conversor de notas em conceitos**
Arquivo: `exercicios/02-conversor-notas.ts` · Teste: `npm run ex -- aula01/02`

- O contrato já está escrito em comentário no arquivo. Ligue o Copilot e observe:
  a sugestão nasce restrita pelo que está escrito acima do cursor.
- Preste atenção nos **limites das faixas** (`>= 9` vs `> 9`). É onde o
  autocomplete mais erra: ele acerta a forma do `if` e troca o operador.
- **Aceite:** testes verdes **e** você consegue explicar cada linha aceita.

### 🤖 Com agente — você especifica e revisa

**3. Boletim da turma** *(opcional nesta aula; obrigatório a partir da 12)*
Arquivo: `exercicios/03-boletim.ts` · Spec: `exercicios/03-boletim.spec.md`

- Preencha a especificação **antes** de chamar o agente.
- Depois que ele terminar: `git diff` e revise linha a linha.
- Atenção à restrição "não modifica o array recebido" — é a que agentes violam
  com mais frequência, usando `.sort()` direto no array que receberam.
- **Aceite:** teste verde **e** a seção "sua revisão" do `.spec.md` preenchida.

---

## Autoavaliação

- [ ] `npm test` passa na minha máquina.
- [ ] Sei explicar por que o primeiro programa não usa `console.log`.
- [ ] Sei dizer que implementação errada passaria num teste com `toBeTruthy()`.
- [ ] Achei o bug da leitura crítica **antes** de rodar o código.
- [ ] Sei escolher entre os quatro modos de IA para uma tarefa nova.
- [ ] Fiz pelo menos um commit.

Caixa desmarcada indica exatamente o que revisar.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| `0 / 0` em JavaScript | `NaN` silencioso, sem erro | Trate o caso vazio antes de dividir |
| Teste com asserção frouxa | Suíte verde, bug em produção | Pergunte: que implementação errada passaria aqui? |
| `npm install` na pasta errada | `Cannot find module` | Instale sempre na **raiz** do repositório |
| Import sem `.js` | `ERR_MODULE_NOT_FOUND` | Em ESM, importe `./arquivo.js` mesmo sendo `.ts` |
| Aceitar sugestão que você não entende | Dívida que aparece na próxima aula | Só aceite o que você conseguiria ter escrito |

---

## Resumo

O curso começa pela bancada de verificação, não pela sintaxe, porque o problema
de quem programa hoje não é produzir código — é decidir se o código produzido
presta. Um `console.log` prova que rodou; um teste prova que fez a coisa certa. E
um teste só vale o que suas asserções afirmam: `toBeLessThan(100)` aprovou uma
função de desconto errada. Existem quatro modos de usar IA, com tamanhos de tarefa
diferentes, e escolher o modo errado é o erro mais comum de quem está começando. O
caso de borda que você não menciona no prompt é o caso de borda que você não recebe.

---

## Leitura complementar

- [Node.js — Introdução](https://nodejs.org/pt-br/learn/getting-started/introduction-to-nodejs)
- [Vitest — Getting Started](https://vitest.dev/guide/)
- [GitHub Copilot — Documentação](https://docs.github.com/pt/copilot)
- [Git — Documentação oficial](https://git-scm.com/doc)
