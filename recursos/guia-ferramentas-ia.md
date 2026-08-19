# Guia das quatro ferramentas de IA

Este curso usa quatro modos de trabalhar com IA. Eles não são intercambiáveis, e
usar o modo errado é a causa mais comum de frustração ("a IA não ajudou") e de
retrabalho ("a IA fez demais e eu não entendo mais o meu código").

A pergunta que você deve fazer antes de cada tarefa é: **qual é o tamanho da coisa
que preciso, e quanto eu já sei sobre ela?**

---

## Visão geral

| Modo | Ferramenta típica | Tamanho da tarefa | Você já sabe o que quer? | Onde roda |
| --- | --- | --- | --- | --- |
| 1. Autocomplete | Copilot inline | linha, função curta | sim, quase digitando | no editor |
| 2. Chat | Copilot Chat, Claude, ChatGPT, Gemini | um conceito, um bug, um trecho | não, quero entender | painel ou navegador |
| 3. Agente | Claude Code, Codex CLI, Cursor | vários arquivos, tarefa inteira | sim, e sei verificar | terminal/IDE, mexe nos arquivos |
| 4. Agente no GitHub | Copilot Agent, revisão de PR | uma issue fechada | sim, e outra pessoa vai revisar | na nuvem, abre PR |

---

## Modo 1 — Autocomplete inline (GitHub Copilot)

**O que é.** Sugestões de código enquanto você digita, aceitas com `Tab`.

**Quando cabe.** Quando você já sabe exatamente o que vai escrever e a sugestão só
economiza digitação: o corpo óbvio de uma função cuja assinatura você acabou de
escrever, o próximo caso de um `switch`, o preenchimento de um objeto de teste.

**Quando não cabe.** Quando você não sabe o que quer. O autocomplete vai propor
*alguma coisa*, e algo plausível é exatamente o que engana.

**A técnica que funciona.** Escreva primeiro a **assinatura** e um comentário de
contrato. O Copilot lê o que está acima do cursor:

```typescript
// Retorna a média das notas. Array vazio retorna 0.
// Não modifica o array recebido.
export function media(notas: number[]): number {
  // a sugestão aqui já nasce restrita pelo contrato acima
}
```

**Regra do curso:** só aceite uma sugestão que você **conseguiria ter escrito**.
Se você aceitou algo que não sabe explicar, você não economizou tempo — você
adiou uma dívida.

---

## Modo 2 — Chat (Copilot Chat, Claude, ChatGPT, Gemini)

**O que é.** Uma conversa. Você cola código ou descreve um problema e recebe
explicação, alternativa ou diagnóstico.

**Quando cabe.** Entender um conceito, entender um trecho de código alheio,
interpretar uma mensagem de erro, comparar duas formas de fazer a mesma coisa,
gerar casos de teste que você não pensou.

**Quando não cabe.** Para mudar dez arquivos. Copiar e colar código de volta do
chat, um arquivo por vez, é lento e propenso a erro — para isso existe o modo 3.

**A técnica que funciona.** Peça o **modo de falha**, não o resumo:

| Pergunta fraca | Pergunta boa |
| --- | --- |
| "explica esse código" | "Explique linha a linha e diga qual entrada faz ele dar resultado errado." |
| "tá certo?" | "Que caso de borda esse código não trata?" |
| "como faço X?" | "Me dê duas formas de fazer X e diga em que situação cada uma é pior." |

**Cuidado com dados.** O que você cola num chat de navegador sai da sua máquina.
Nunca cole senha, token, chave de API, dado de cliente ou código sob NDA.

---

## Modo 3 — Agente de codificação (Claude Code, Codex CLI, Cursor)

**O que é.** Um programa que **lê e escreve arquivos do seu projeto e roda comandos**.
Você descreve a tarefa; ele explora o código, edita vários arquivos, roda os testes e
itera até passar.

**Quando cabe.** Uma tarefa que atravessa arquivos e que você **sabe verificar**:
"implemente estas funções até `npm run ex -- aula07` ficar verde", "extraia esta
lógica para um módulo separado e ajuste os imports".

**Quando não cabe.** Quando você não tem critério de aceite. Sem um comando que diga
"pronto", o agente entrega algo que parece pronto, e você não tem como discordar.

**A técnica que funciona.** Uma especificação com quatro partes:

1. **Objetivo** — o que precisa existir no fim (não como fazer).
2. **Critério de aceite** — um comando executável: `npm run ex -- aula07`.
3. **Fronteira** — que arquivos ele pode tocar, e quais são intocáveis (os testes).
4. **Contexto** — que arquivos ele deve ler antes de começar.

Depois que ele terminar, a etapa que **não é opcional**:

```bash
git diff        # leia linha a linha antes de commitar
```

Se o diff tem 300 linhas e você leu 20, você não revisou — você assinou embaixo.

**Contexto é algo que você projeta.** Este repositório tem um [`AGENTS.md`](../AGENTS.md)
justamente para isso: ele diz ao agente o que não fazer, antes que ele tente.

---

## Modo 4 — Agente no GitHub (Copilot Agent, revisão de PR)

**O que é.** Você atribui uma **issue** a um agente. Ele trabalha na nuvem e abre um
**Pull Request**. Um humano revisa, comenta e pede ajustes — como faria com qualquer
colega.

**Quando cabe.** Tarefa bem delimitada e descrita por escrito, num projeto com testes.
É o modo mais próximo de como equipes reais estão trabalhando hoje.

**Quando não cabe.** Tarefa que exige decisão de arquitetura ou contexto que só existe
na cabeça de alguém.

**A técnica que funciona.** A qualidade do PR é a qualidade da issue. Uma issue boa tem
objetivo, critério de aceite executável e fronteira — as mesmas quatro partes do modo 3.
Use o template [`tarefa-para-agente`](../.github/ISSUE_TEMPLATE/tarefa-para-agente.md).

**A parte que é sua.** Revisar. Um PR aberto por agente não é um PR aprovado. O
[checklist de revisão](checklist-revisao-de-codigo-ia.md) existe para isso.

---

## Como escolher: árvore de decisão

```
Eu sei exatamente o que quero escrever?
├── SIM → é só uma linha ou função curta?
│         ├── SIM → Modo 1 (autocomplete)
│         └── NÃO → tenho um comando que prova que ficou pronto?
│                   ├── SIM → outra pessoa vai revisar? 
│                   │         ├── SIM → Modo 4 (agente no GitHub)
│                   │         └── NÃO → Modo 3 (agente local)
│                   └── NÃO → volte e escreva o teste primeiro
└── NÃO → Modo 2 (chat), até você saber o que quer
```

O caminho "não sei o que quero, então vou pedir para o agente fazer" é o único que
o curso pede que você não tome. Ele produz código que funciona por acaso e que você
não consegue consertar quando parar de funcionar.

---

## O que nenhuma delas faz por você

- **Decidir se o problema certo está sendo resolvido.** A IA otimiza a resposta,
  não a pergunta.
- **Saber o que é "certo" no seu contexto.** Regra de negócio, requisito legal,
  acordo com o cliente — nada disso está no modelo.
- **Assumir a responsabilidade.** O commit tem o seu nome.

---

## Custo de dependência: uma nota honesta

Existe um efeito real e medido: quem resolve um problema com ajuda tende a
**superestimar** o quanto entendeu. Você lê a solução, ela faz sentido, e a sensação
de compreensão é quase idêntica à compreensão de verdade — mas some quando você
precisa produzir a mesma coisa sozinho.

É por isso que a trilha de exercícios deste curso começa em 🚫 **sem IA**. Não é
nostalgia nem desconfiança da ferramenta. É que o nível 🤝 e o nível 🤖 só são
seguros para quem consegue perceber quando a resposta está errada — e essa
percepção você só constrói produzindo a resposta algumas vezes.
