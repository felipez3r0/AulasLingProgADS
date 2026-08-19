# Aula 06 — Funções, escopo e decomposição

> **Módulo:** M2 — Fundamentos da linguagem sob verificação
> **Ementa oficial:** E5 — Funções de biblioteca (parte 1: o que é uma função)
> **Skills:** S6 (reforça), S1 (reforça)
> **Pré-requisitos:** Aulas 01 a 05

## Objetivos

- Declarar funções com parâmetros tipados, opcionais, padrão e *rest*
- Entender escopo, funções como valores e tipos de função
- Reconhecer **efeito colateral** e escrever funções puras quando cabe
- **Decompor** um problema em funções pequenas, cada uma com critério de pronto
- Skill de dev-com-IA: **decompor é exatamente como se dirige um agente**

## Por que isso importa quando a IA escreve o código

Duas coisas mudam de valor quando a máquina escreve o corpo das funções.

**A primeira é a decomposição.** Peça "faça o sistema de pedidos" e você recebe
250 linhas que você não vai revisar de verdade. Peça quatro funções de dez linhas,
cada uma com um teste, e você revisa as quatro. A decomposição deixou de ser
higiene de código e virou a unidade de trabalho: **um pedaço pequeno o bastante
para você conferir é um pedaço pequeno o bastante para delegar.**

**A segunda é a pureza.** Uma função que só devolve um valor é trivial de testar.
Uma função que também altera o objeto que recebeu, ou mexe numa variável global,
espalha consequências que não aparecem na assinatura. Código gerado por IA tende
ao segundo tipo — porque é assim que a maior parte do código do mundo é escrita, e
é disso que os modelos aprenderam.

## Antes de começar

```bash
npm test -- aula06     # exemplos desta aula: devem PASSAR
npm run ex -- aula06   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Anatomia e formas de declarar

```typescript
// aula06-funcoes-e-decomposicao/exemplos/01-funcoes-e-contrato.ts
export function somar(a: number, b: number): number {
  return a + b;
}

export const multiplicar = (a: number, b: number): number => a * b;
```

| Forma | Quando usar |
| --- | --- |
| `function nome() {}` | funções principais do módulo |
| `const nome = () => {}` | callbacks e funções curtas |

A assinatura é o contrato: nome, o que entra, o que sai.

> **Comparando com C:**
> ```c
> int somar(int a, int b) { return a + b; }
> ```
> Estrutura idêntica. A diferença que importa: em TypeScript funções são
> **valores** — dá para guardar numa variável, passar como argumento e retornar de
> outra função. Em C você faria isso com ponteiro para função, com sintaxe bem
> mais hostil.

### Parâmetros

```typescript
function saudar(nome: string, titulo?: string): string        // opcional
function aplicarJuros(valor: number, taxa: number = 0.01)     // valor padrão
function somarTodos(...numeros: number[]): number             // rest
```

Opcionais e com padrão vêm **depois** dos obrigatórios.

> **Comparando com C:** o *rest parameter* corresponde ao `va_list` do
> `<stdarg.h>`, muito mais verboso e sem verificação de tipo. Aqui você recebe um
> `number[]` tipado.

### Funções como valores

```typescript
export type Operacao = (a: number, b: number) => number;

export function calcular(a: number, b: number, operacao: Operacao): number {
  return operacao(a, b);
}

calcular(6, 3, somar);        // 9
calcular(6, 3, (a, b) => a - b); // 3
```

Esse conceito sustenta `map`, `filter` e `reduce`, que chegam na Aula 07.

**Verifique:** `npm test -- 01-funcoes`

---

## 2. Escopo

| Escopo | Onde o nome existe |
| --- | --- |
| global (módulo) | no arquivo inteiro |
| de função | dentro da função |
| de bloco | dentro das `{}` — `let` e `const` respeitam |

```typescript
for (let i = 0; i < 5; i++) { /* i só existe aqui */ }
// console.log(i);  // erro
```

**Shadowing:** um nome interno "sombreia" o externo de mesmo nome. Compila, roda,
e é fonte de confusão — evite.

> **Comparando com C:** o comportamento de bloco é o mesmo desde o C99. A diferença
> é o `var`, que **não** respeita bloco e por isso não deve ser usado.

---

## 3. Efeito colateral e pureza

Uma função **pura** tem duas propriedades:

1. Dada a mesma entrada, devolve sempre a mesma saída.
2. Não faz mais nada — não altera argumentos, não mexe em variáveis externas, não
   escreve arquivo.

```typescript
// PURA: só calcula e devolve
function calcularTotal(itens: Item[]): number {
  return itens.reduce((s, i) => s + i.preco, 0);
}

// IMPURA: altera o objeto do chamador
function darBaixa(produto: Produto, qtd: number): number {
  produto.estoque -= qtd;   // efeito colateral
  return qtd * produto.preco;
}
```

O problema da segunda não é filosófico. É que **a assinatura mente**: ela diz que
devolve um número, e não diz que o seu produto vai mudar. Quem chama não tem como
saber sem ler o corpo.

Nem toda função pode ser pura — gravar arquivo e responder requisição são efeitos
por definição. A regra prática: **concentre os efeitos em poucos lugares e mantenha
o cálculo puro**, porque é o cálculo que você vai querer testar.

> **Quando a IA escreve isto:** mutação de argumento é o defeito mais frequente em
> código gerado, e o mais fácil de não notar na revisão — a linha `produto.estoque
> -= qtd` parece inofensiva. Coloque nas suas instruções: *"não modifique os
> argumentos recebidos; devolva um novo objeto"*. Este repositório já traz essa
> regra no [`AGENTS.md`](../AGENTS.md).

---

## 4. Decomposição

Compare as duas versões da mesma avaliação de aluno:

```typescript
// aula06-funcoes-e-decomposicao/exemplos/02-decomposicao.ts

// Monolítica: se o resultado sair errado, onde está o defeito?
export function avaliarMonolitico(aluno: Aluno): string { /* 12 linhas */ }

// Decomposta: cada peça testável sozinha
export function calcularMedia(notas: number[]): number
export function calcularPresenca(faltas: number, aulasTotais: number): number
export function classificarPorNota(media: number): string

export function avaliar(aluno: Aluno): string {
  const presenca = calcularPresenca(aluno.faltas, aluno.aulasTotais);
  if (presenca < 0.75) return "reprovado por falta";
  return classificarPorNota(calcularMedia(aluno.notas));
}
```

As duas produzem o mesmo resultado. A diferença aparece quando o resultado está
errado: na versão decomposta, você roda os testes das peças e **o próprio teste te
diz qual delas falhou**. Na monolítica, você só sabe que a saída final está errada.

### Como decompor

1. Escreva o que a função faz numa frase.
2. Se a frase tiver "e" ou "depois", provavelmente são duas funções.
3. Cada peça recebe dados e devolve dados — sem depender de estado externo.
4. Cada peça ganha um teste antes de você compor.

### Por que isso é a habilidade central para dirigir agentes

Uma tarefa que você consegue enunciar como *"implemente `acrescimoPorPeso(peso:
number): number`, com estas três faixas, até este teste ficar verde"* é uma tarefa
que um agente executa bem e que você revisa em trinta segundos.

Uma tarefa enunciada como *"faz o cálculo de frete"* produz um diff que você aprova
por cansaço.

**A decomposição é o que transforma um pedido em algo delegável.** Você já usa isso
desde a Aula 03 sem o nome: as quatro partes de uma boa especificação — objetivo,
restrições, fronteira, critério de aceite — só cabem em pedaços pequenos.

**Verifique:** `npm test -- 02-decomposicao`

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"faz uma função que registra a venda e atualiza o estoque"*

```typescript
// aula06-funcoes-e-decomposicao/exemplos/leitura-critica/gerado-pela-ia.ts
let totalVendido = 0;

export function registrarVenda(produto: Produto, quantidade: number): number {
  produto.estoque -= quantidade;
  totalVendido += quantidade * produto.preco;
  return quantidade * produto.preco;
}
```

**Antes de rodar**, responda:

| Pergunta | Resposta |
| --- | --- |
| A assinatura diz que a função devolve um número. O que mais ela faz? | |
| Se eu chamar duas vezes com o mesmo produto, o resultado é o mesmo? | |
| O que acontece se `quantidade` for maior que o estoque? | |
| Como eu testo essa função duas vezes seguidas de forma independente? | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta:** o cálculo está certo. São os **efeitos** que estão errados, e há três:
>
> 1. `produto.estoque -= quantidade` altera o objeto do chamador. A assinatura não
>    anuncia isso.
> 2. `totalVendido` é estado global: cada chamada depende de todas as anteriores.
>    Os testes precisam de um `zerarTotalVendido()` entre eles — sintoma clássico.
> 3. Nada impede `quantidade` maior que o estoque. Vender 999 de um estoque de 10
>    deixa `-989` e ninguém reclama.
>
> Repare que o pedido dizia "registra a venda **e** atualiza o estoque". O "e"
> era o aviso de que ali havia duas responsabilidades — e a IA juntou as duas numa
> função só, exatamente como foi pedido.
>
> Documentado e provado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`.
> Corrigir é o exercício 🚫 1.
>
> Sobre a pergunta 3: faltava **"a função não pode modificar o produto recebido;
> devolva o produto atualizado"** e **"recuse venda maior que o estoque"**.

---

## Verificação: como provar que funciona

- **Invariantes desta aula:**
  - nenhuma função altera o objeto ou array que recebeu;
  - chamar a mesma função duas vezes com a mesma entrada dá o mesmo resultado;
  - nenhum teste precisa de "limpeza" entre casos.
- **Casos de borda obrigatórios:** vazio · zero · negativo · exatamente o limite · argumento omitido

Os dois testes que provam pureza:

```typescript
it("nao modifica o produto recebido", () => {
  const produto = camiseta();
  registrarVenda(produto, 3);
  expect(produto.estoque).toBe(10);
});

it("chamadas repetidas dao o mesmo resultado", () => {
  const produto = camiseta();
  expect(registrarVenda(produto, 2)).toEqual(registrarVenda(produto, 2));
});
```

> Se um teste seu precisa de `beforeEach` para zerar alguma coisa, isso é um sinal
> — provavelmente há estado global escondido.

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Pedir função | "faz o cálculo de frete" | "Implemente `acrescimoPorPeso(pesoKg: number): number`. Faixas: ≤1kg → 0; >1 e ≤5 → 5; >5 → 12. Peso ≤ 0 lança `Error('peso invalido')`." | Uma peça, com contrato e bordas |
| Evitar mutação | — | "Nenhuma função pode modificar os argumentos recebidos. Devolva novos objetos." | O defeito mais comum, dito antes |
| Decompor | "organiza melhor esse código" | "Divida esta função em funções puras de no máximo 15 linhas, cada uma com uma responsabilidade. Não mude o comportamento." | Diz o critério de "melhor" |
| Revisar efeitos | "tá bom?" | "Que efeitos colaterais esta função tem além do valor de retorno? Liste." | Pergunta pelo que a assinatura esconde |

**Ferramenta por ferramenta**

- *Copilot inline:* escreva a assinatura completa e o contrato em comentário; o corpo de uma função pequena e bem especificada é o que ele faz melhor.
- *Copilot Chat:* `/explain` e pergunte pelos efeitos colaterais.
- *Chat de navegador:* peça ajuda para decompor — "quantas responsabilidades esta função tem?".
- *Agente:* exercício 3, onde a decomposição é parte do que você revisa.

---

## Git desta aula: branch por unidade de trabalho

```bash
git checkout -b aula06-exercicios

# um commit por peça implementada
git commit -m "aula06: implementa freteBase e acrescimoPorPeso"
git commit -m "aula06: implementa desconto e prazo"
git commit -m "aula06: compoe calcularEntrega"

git checkout main
git merge aula06-exercicios
```

Branch e decomposição resolvem o mesmo problema em escalas diferentes: manter cada
unidade de trabalho pequena o bastante para ser revisada.

> **Rede de segurança:** com uma peça por commit, um `git revert` desfaz só a peça
> errada — não o dia inteiro.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Venda sem efeito colateral**
Arquivo: `exercicios/01-venda-pura.ts` · Teste: `npm run ex -- 01-venda-pura`

- Reescreva a função da leitura crítica: sem mutar o produto, sem estado global.
- Devolva `{ valor, produtoAtualizado }`, onde `produtoAtualizado` é um objeto **novo**.
- Dica: `{ ...produto, estoque: produto.estoque - quantidade }` cria a cópia.
- **Aceite:** os 11 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Frete decomposto**
Arquivo: `exercicios/02-decompor-frete.ts` · Teste: `npm run ex -- 02-decompor-frete`

- Quatro peças pequenas e uma que combina. **Implemente uma de cada vez**, rodando
  o teste a cada peça.
- É o método que você vai usar com agente: pedaço pequeno, critério de pronto,
  próximo pedaço.
- Repare que a peça combinada quase não tem lógica própria — é sinal de boa decomposição.
- **Aceite:** os 13 testes verdes **e** você consegue explicar cada peça.

### 🤖 Com agente — você especifica e revisa

**3. Pipeline de pedidos**
Arquivo: `exercicios/03-pipeline-pedidos.ts` · Spec: `exercicios/03-pipeline-pedidos.spec.md`

- Peça explicitamente a decomposição na sua especificação. **Os testes passam com
  um bloco único** — a decomposição é exigência sua, não do teste. Esse é o ponto
  do exercício: nem tudo que importa cabe num teste automatizado.
- Ordem das regras: filtrar itens → subtotal → verificar limite de 50 → desconto.
- **Aceite:** os 16 testes verdes **e** as 4 perguntas de revisão respondidas.

---

## Autoavaliação

- [ ] Sei dizer, olhando uma assinatura, o que ela **não** está me contando.
- [ ] Escrevo funções que não modificam os argumentos recebidos.
- [ ] Sei quebrar um problema em peças com critério de pronto para cada uma.
- [ ] Desconfio de teste que precisa de limpeza entre casos.
- [ ] Achei os três defeitos da leitura crítica sem rodar o código.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| Mutar o argumento | chamador quebra à distância | Devolva um objeto novo com spread |
| Estado global | teste precisa de `beforeEach` para limpar | Passe o estado como parâmetro |
| Função que faz duas coisas | o "e" no nome ou na descrição | Duas funções |
| Parâmetro opcional antes do obrigatório | erro de compilação | Opcionais por último |
| Pedir "o sistema inteiro" ao agente | diff grande demais para revisar | Uma peça por vez |

---

## Resumo

Uma assinatura é um contrato, mas ela só conta o que entra e o que sai — os efeitos
colaterais ficam escondidos no corpo, e é justamente ali que código gerado por IA
mais erra: mutando o objeto do chamador, criando estado global, juntando duas
responsabilidades porque o pedido tinha um "e". Funções puras eliminam essa classe
inteira de problema e são triviais de testar. E a decomposição deixou de ser
organização para virar unidade de trabalho: um pedaço pequeno o bastante para você
revisar é um pedaço pequeno o bastante para delegar a um agente com critério de
aceite. Quem pede "faz o sistema" recebe um diff que aprova por cansaço.

---

## Leitura complementar

- [TypeScript — Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [MDN — Funções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions)
- [Catálogo de prompts — dirigir um agente](../recursos/catalogo-de-prompts.md)
