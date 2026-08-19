# Glossário

Termos que aparecem no curso. Se você encontrar um que não está aqui, abra uma issue.

## Programação

**Argumento** — o valor que você passa ao chamar a função. O *parâmetro* é o nome
na declaração; o argumento é o valor real.

**Asserção** — afirmação num teste sobre o que deveria ser verdade (`expect(x).toBe(3)`).

**Caso de borda** — entrada no limite do domínio: vazio, zero, negativo, máximo,
ausente. É onde código gerado por IA falha com mais frequência.

**Contrato** — o acordo de uma função: o que aceita, o que devolve, o que garante.
Em TypeScript, boa parte dele é expressa pelos tipos e verificada pelo compilador.

**Efeito colateral** — quando uma função faz algo além de devolver um valor:
escreve arquivo, altera variável externa, modifica o argumento recebido.

**Escopo** — a região do código onde um nome existe.

**Função pura** — dada a mesma entrada, devolve sempre a mesma saída, sem efeito
colateral. Fácil de testar e de raciocinar.

**Imutabilidade** — não alterar dados no lugar; criar novos. `[...a, b]` em vez de `a.push(b)`.

**Invariante** — algo que precisa ser verdade sempre. "A lista nunca tem duas tarefas
com o mesmo id."

**Mutação** — alterar um valor no lugar. `array.push(x)` muta; `[...array, x]` não.

**Off-by-one** — errar o limite de um laço por um: `<=` onde devia ser `<`. Clássico
em código gerado, porque o modelo acerta a forma e erra o limite.

**Referência vs valor** — números e strings são copiados quando atribuídos; arrays e
objetos não — a nova variável aponta para o mesmo dado. Ver Aula 07.

**Reprodução mínima** — o menor código que ainda mostra o bug. A ferramenta de
diagnóstico mais subestimada.

**Type guard** — verificação que estreita um tipo (`typeof x === "string"`), fazendo
o compilador saber com o que está lidando dali para frente.

## Ferramentas

**Agente de codificação** — programa de IA que lê e escreve arquivos do projeto e
roda comandos. Claude Code, Codex CLI, Cursor.

**`AGENTS.md`** — arquivo na raiz que dá contexto e regras a agentes de IA.

**CI (integração contínua)** — automação que roda testes a cada push. Neste
repositório, `.github/workflows/ci.yml`.

**Commit** — um ponto salvo no histórico do Git.

**Diff** — as linhas que mudaram entre duas versões. Sua principal ferramenta de
revisão de código gerado por IA.

**ESM** — o sistema de módulos moderno do JavaScript (`import`/`export`).

**Lockfile** (`package-lock.json`) — registra as versões exatas instaladas, para
todo mundo ter o mesmo ambiente. Deve ser commitado.

**Pull Request (PR)** — proposta de mudança aberta para revisão antes do merge.

**Semver** — versionamento `MAIOR.MENOR.CORREÇÃO`. Mudança de MAIOR pode quebrar seu código.

**Vitest** — o executor de testes usado no curso.

## IA

**Alucinação** — quando o modelo produz algo plausível e falso: um método que não
existe, um pacote que nunca foi publicado, uma citação inventada.

**Contexto** — a informação que o modelo tem disponível ao responder. Arquivos
abertos, histórico da conversa, `AGENTS.md`. Contexto ruim é a causa mais comum de
resposta ruim.

**LLM** — *large language model*, o tipo de modelo por trás dessas ferramentas.
Prevê o texto mais provável a seguir; não executa o código que escreve, a menos que
seja um agente com ferramentas.

**MCP** — protocolo que permite conectar ferramentas e fontes de dados externas a
um assistente de IA.

**Prompt** — o que você pede. Neste curso: uma especificação.

**Slopsquatting** — atacante registra no npm um nome de pacote que os modelos
costumam inventar, esperando que alguém instale sem conferir. Ver Aula 09.

**Vibe coding** — aceitar código gerado sem entendê-lo, iterando por tentativa até
parecer funcionar. Serve para protótipo descartável. Não serve para código que
alguém vai manter — e é o oposto do que este curso treina.
