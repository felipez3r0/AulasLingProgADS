# Template de aula

Toda aula de 01 a 14 segue esta estrutura. A aula 15 (projeto final) é isenta,
porque não é aula expositiva.

`npm run estrutura` verifica que as seções obrigatórias existem **e estão na ordem**.
Isso não é rigidez decorativa: o aluno precisa saber, sem procurar, onde fica o
exercício e onde fica o comando de verificação.

Copie o bloco abaixo ao criar uma aula nova.

---

````markdown
# Aula NN — Título

> **Módulo:** M? — nome do módulo
> **Ementa oficial:** E1, E2 — ou `transversal` se a aula não cobre item da ementa
> **Skills:** S3 (introduz), S4 (reforça), S8 (reforça)
> **Pré-requisitos:** Aula NN-1

## Objetivos

- Conceito: ...
- Conceito: ...
- Skill de dev-com-IA: ...
- Ao final, você saberá verificar: ...

## Por que isso importa quando a IA escreve o código

Três a seis linhas ligando o conceito da aula à prática de revisar ou dirigir IA.
Não é motivação genérica: precisa nomear **qual erro concreto** este conceito
permite enxergar em código gerado.

## Antes de começar

```bash
npm test -- aulaNN     # exemplos desta aula: devem PASSAR
npm run ex -- aulaNN   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Primeiro conceito

Explicação curta e direta.

```typescript
// aulaNN-slug/exemplos/01-nome.ts
```

> **Comparando com C:**
> ```c
> // equivalente em C
> ```
> O que muda e por quê.

> **Quando a IA escreve isto:** qual erro típico este conceito permite detectar.

**Verifique:** `npm test -- 01-nome`

## 2..N. Demais conceitos

Mesma estrutura: exemplo executável, comparação com C quando ajudar, nota sobre
código gerado, comando de verificação.

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"prompt exato usado"*

```typescript
// aulaNN-slug/exemplos/leitura-critica/gerado-pela-ia.ts
```

**Antes de rodar**, preencha a tabela de rastreio:

| Passo | Estado | Valor esperado |
| --- | --- | --- |
| | | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta:** o defeito está documentado e **provado por um teste** em
> `exemplos/leitura-critica/gerado-pela-ia.spec.ts`. Esse teste passa — porque
> ele afirma o comportamento defeituoso. Corrigir é o exercício 🚫 1.

---

## Verificação: como provar que funciona

- Invariantes desta aula — o que sempre precisa ser verdade:
  - ...
- Casos de borda obrigatórios: vazio · zero · negativo · limite · ausente
- O teste que pegaria o bug da seção anterior:

```typescript
it("descrição do comportamento esperado", () => { /* ... */ });
```

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| | | | |

**Ferramenta por ferramenta**

- *Copilot inline:* ...
- *Copilot Chat:* ...
- *Chat de navegador:* ...
- *Agente:* ver a trilha 🤖 abaixo.

---

## Git desta aula: tema da espiral

```bash
# comandos do tema
```

> **Rede de segurança:** antes de deixar a IA (ou você) mexer no código, garanta
> que o trabalho anterior está commitado.

---

## Exercícios

Faça **nesta ordem**. O nível 🚫 constrói o modelo mental que torna 🤝 e 🤖 seguros.

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Título**
Arquivo: `exercicios/01-nome.ts` · Teste: `npm run ex -- 01-nome`

- passos
- **Aceite:** todos os casos verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Título**
Arquivo: `exercicios/02-nome.ts` · Teste: `npm run ex -- 02-nome`

- Escreva **primeiro** a assinatura e o contrato em comentário; só então aceite sugestões.
- **Aceite:** testes verdes **e** você consegue explicar cada linha aceita.

### 🤖 Com agente — você especifica e revisa

**3. Título**
Arquivo: `exercicios/03-nome.ts`

- Escreva a especificação antes de chamar o agente: objetivo · arquivos permitidos ·
  arquivos intocáveis · comando de aceite.
- Rode o agente. Depois **`git diff` e revise linha a linha antes de commitar**.
- **Aceite:** teste verde **e** um commit cuja mensagem descreve o que *você* revisou.

---

## Autoavaliação

- [ ] Consigo explicar o conceito principal sem consultar o material.
- [ ] Consigo prever a saída de um trecho desta aula antes de rodar.
- [ ] Achei o bug da leitura crítica sem rodar o código.
- [ ] Sei dizer qual das quatro ferramentas de IA cabe em cada exercício.

Caixa desmarcada indica exatamente o que revisar.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| | | |

---

## Leitura complementar

- [Título](url)
````

---

## Notas de design

**O bloco "Quando a IA escreve isto" é obrigatório** nas seções numeradas principais.
É ele que impede a IA de voltar a ser apêndice: se a única menção a IA estivesse no
fim, a aula voltaria a ser "conteúdo + dica".

**O bug plantado fica em `exemplos/`, não em `exercicios/`.** O `.spec.ts` que o
acompanha **afirma o comportamento defeituoso** e por isso passa:

```typescript
it("BUG: ignora o último elemento — corrigir é o exercício 1", () => {
  expect(somaTotal([1, 2, 3])).toBe(3);
});

it.todo("depois de corrigido, deve retornar 6");
```

Assim o CI fica verde sem esconder o defeito, e o teste é literalmente a
demonstração de que verificação pega o que a leitura desatenta deixa passar.

**Todo exercício declara arquivo alvo, comando de teste e critério de aceite.**
Esse é o mesmo formato que o aluno vai usar para especificar tarefas a um agente.
A forma do enunciado *é* a lição.
