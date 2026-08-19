# Preparando o ambiente

Você vai fazer isto **uma vez**. Depois disso, todas as 15 aulas rodam com os
mesmos comandos.

## 1. Node.js 20 ou superior

Baixe a versão **LTS** em [nodejs.org](https://nodejs.org/). Confira:

```bash
node --version    # v20.x ou superior
npm --version
```

> **Windows:** use o instalador `.msi` e marque "Add to PATH". Se `node` não for
> reconhecido depois, feche e reabra o terminal.

## 2. Git

[git-scm.com](https://git-scm.com/). Configure seu nome e e-mail — eles vão em
todo commit que você fizer:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
git config --global init.defaultBranch main
```

## 3. VS Code

[code.visualstudio.com](https://code.visualstudio.com/). Ao abrir este repositório
pela primeira vez, ele vai sugerir as extensões recomendadas — aceite. São elas:

| Extensão | Para quê |
| --- | --- |
| GitHub Copilot | sugestões inline |
| GitHub Copilot Chat | chat dentro do editor |
| Vitest | roda e depura testes pela interface |
| EditorConfig | mantém formatação consistente |

> **Copilot é gratuito para estudante** pelo [GitHub Student Developer Pack](https://education.github.com/pack),
> usando seu e-mail institucional.

## 4. Clonar e instalar

```bash
git clone <url-do-repositorio>
cd AulasLingProgADS
npm install
```

## 5. Confirmar que está tudo certo

```bash
npm test
```

Você deve ver os testes dos exemplos passando. Se passou, o ambiente está pronto.

```bash
npm run ex:run
```

Este **deve falhar**. Não é problema: os exercícios são publicados vermelhos de
propósito — eles são o enunciado em forma executável. Deixá-los verdes é o seu trabalho.

---

## Comandos que você vai usar o semestre inteiro

```bash
npm test                  # exemplos de todas as aulas (devem passar)
npm test -- aula05        # exemplos da aula 05
npm run ex -- aula05      # exercícios da aula 05, em watch (reroda ao salvar)
npm run ex -- 01-media    # um exercício só, pelo nome do arquivo
npm run typecheck         # checagem de tipos, sem rodar nada
npm run check             # tudo junto
```

Para executar um arquivo TypeScript direto, sem compilar:

```bash
npx tsx aula04-variaveis-tipos-operadores/exemplos/01-declaracoes.ts
```

---

## Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| `node: command not found` | Node não está no PATH | Reinstale marcando "Add to PATH"; reabra o terminal |
| `Cannot find module` ao rodar teste | dependências não instaladas | `npm install` na **raiz** do repositório |
| `ERR_MODULE_NOT_FOUND` em import próprio | falta o `.js` no import | Em ESM, importe `./arquivo.js` mesmo que o arquivo seja `.ts` |
| Testes não aparecem no VS Code | extensão Vitest lendo a config errada | Ela usa `vitest.config.ts` (exemplos). Exercícios rodam pelo terminal |
| `npm test` diz "No test files found" | você filtrou uma aula sem exemplos ainda | Rode `npm test` sem filtro |
| Copilot não sugere nada | não autenticado ou desativado | `Ctrl+Shift+P` → *GitHub Copilot: Enable Completions* |

Se travar em algo que não está aqui, abra uma
[issue de dúvida](../.github/ISSUE_TEMPLATE/duvida-de-aula.md) — e inclua a mensagem
de erro **completa**, não um resumo.
