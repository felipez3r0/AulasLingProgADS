# Linguagem de Programação — ADS (FATEC)

Disciplina do 2º semestre de Análise e Desenvolvimento de Sistemas.

**Stack:** TypeScript · Node.js · Express · Vitest
**Ferramentas de IA:** GitHub Copilot · chat de propósito geral · agentes de codificação · Copilot Agent no GitHub

---

## A premissa deste curso

Escrever código deixou de ser o gargalo da profissão. Uma IA produz em segundos o
que levava uma tarde — e produz com aparência de correto, indentado e comentado,
inclusive quando está errado.

O que ficou caro é **julgar**: isto resolve o problema certo? vai quebrar de que
jeito? como eu provo que funciona?

Julgar exige exatamente os fundamentos que esta ementa cobre. Não dá para rastrear
a execução de um laço sem entender laço; não dá para usar tipo como contrato sem
entender tipo; não dá para revisar um `sort` que corrompeu o array do chamador sem
entender referência.

Por isso este curso é **mais** exigente nos fundamentos, e não menos. A diferença
é o motivo: você não aprende `for` porque cai na prova. Aprende porque é com ele
que você decide se aceita ou recusa o que a máquina escreveu.

**A regra da disciplina:** nada entra no seu código sem que você saiba verificar.

---

## Como o curso funciona

Cada aula tem três partes que não existiam no formato anterior:

| Parte | O que é |
| --- | --- |
| **Leitura crítica** | Um trecho gerado por IA, com defeito real. Você acha o bug **antes** de rodar. |
| **Verificação** | Como provar que o código funciona: tipos, testes, execução. |
| **Trilha 🚫 🤝 🤖** | Exercícios em três níveis: sem IA, com IA assistida, com agente. |

### Os três níveis de exercício

| Nível | Modo | O que treina |
| --- | --- | --- |
| 🚫 | **Sem IA.** Copilot desligado. | Constrói o modelo mental. É o único momento em que você descobre se realmente sabe. |
| 🤝 | **IA assistida.** Você dirige, ela digita. | Especificar antes de pedir; aceitar só o que entende. |
| 🤖 | **Com agente.** Você especifica e revisa. | Escrever critério de aceite, delimitar escopo, ler diff. |

Fazer na ordem importa. Os níveis 🤝 e 🤖 entregam código que funciona mesmo quando
você não entendeu nada — só o 🚫 te dá esse retorno.

---

## Grade

### Módulo 1 — Fundação: ambiente, versionamento e verificação

| # | Tema | Skills |
| --- | --- | --- |
| 01 | [Ambiente e os quatro modos de usar IA](aula01-ambiente-e-modos-de-ia/) | S3, S8, S10 |
| 02 | [Git como rede de segurança e leitura de diff](aula02-git-rede-de-seguranca/) | S2, S8, S11 |
| 03 | [Da intenção ao teste: especificação como critério de aceite](aula03-especificacao-e-teste/) | S1, S3, S6 |

### Módulo 2 — Fundamentos da linguagem sob verificação

| # | Tema | Ementa | Skills |
| --- | --- | --- | --- |
| 04 | [Variáveis, tipos, operadores e expressões](aula04-variaveis-tipos-operadores/) | E1 | S7, S3 |
| 05 | [Comandos de desvio e controle de malhas](aula05-desvio-e-malhas/) | E2, E3 | S4, S2 |
| 06 | [Funções, escopo e decomposição](aula06-funcoes-e-decomposicao/) | E5 | S6, S1 |
| 07 | [Vetores, referência e valor — os "ponteiros" do TypeScript](aula07-vetores-e-referencia/) | E4 | S2, S4 |
| 08 | [Estruturas, uniões e tipos próprios](aula08-estruturas-e-tipos-proprios/) | E6 | S7, S1 |

### Módulo 3 — Programa real: bibliotecas, arquivos e depuração

| # | Tema | Ementa | Skills |
| --- | --- | --- | --- |
| 09 | [Módulos, bibliotecas e segurança de dependências](aula09-modulos-e-bibliotecas/) | E5 | S10, S9 |
| 10 | [Manipulação de arquivos e dados](aula10-arquivos-e-dados/) | E7 | S3, S5 |
| 11 | [Depuração por hipótese: quando a IA erra e insiste](aula11-depuracao/) | — | S5, S4 |

### Módulo 4 — Agentes, API e projeto

| # | Tema | Skills |
| --- | --- | --- |
| 12 | [Agentes de codificação: especificar, delegar, revisar](aula12-agentes-de-codificacao/) | S9, S11, S6 |
| 13 | [HTTP, REST e Express](aula13-http-rest-e-express/) | S6, S3 |
| 14 | [CRUD, validação e tratamento de erros](aula14-crud-validacao-e-erros/) | S7, S10 |
| 15 | [Projeto final: da issue ao PR revisado](aula15-projeto-final/) | todas |

---

## As onze skills

O curso ensina TypeScript, mas **treina** onze habilidades. Cada uma é introduzida
numa aula e reforçada em várias — ver [trilha completa](recursos/trilha-de-skills.md).

| | Skill | | Skill |
| --- | --- | --- | --- |
| S1 | Especificar intenção | S7 | Tipos como contrato |
| S2 | Ler código | S8 | Git como rede de segurança |
| S3 | Verificar (testes, tipos, execução) | S9 | Gerenciar contexto do agente |
| S4 | Rastrear execução mentalmente | S10 | Ceticismo calibrado |
| S5 | Depurar por hipótese | S11 | Revisar código que você não escreveu |
| S6 | Decompor em passos verificáveis | | |

---

## Ementa oficial

> Variáveis, constantes, operadores e expressões. Comandos de desvio. Controle de
> malhas. Vetores e ponteiros. Funções de biblioteca. Estruturas, uniões e tipos
> definidos pelo usuário. Manipulação de arquivos.

**Objetivo:** solucionar problemas utilizando a lógica de programação e a
implementação de programas por meio de uma linguagem de programação.

| Item | Aula principal | Reforço |
| --- | --- | --- |
| E1 Variáveis, constantes, operadores e expressões | 04 | 03, 05 |
| E2 Comandos de desvio | 05 | 08, 14 |
| E3 Controle de malhas | 05 | 07, 10 |
| E4 Vetores e ponteiros | 07 | 08, 10 |
| E5 Funções de biblioteca | 06, 09 | 10, 13 |
| E6 Estruturas, uniões e tipos definidos pelo usuário | 08 | 10, 14 |
| E7 Manipulação de arquivos | 10 | 14, 15 |

A ementa foi escrita quando a linguagem de referência era C. O
[mapa da ementa](recursos/mapa-ementa.md) explica como "ponteiros" e "uniões" foram
traduzidos honestamente para TypeScript — sem fingir equivalência nem omitir a
diferença. `npm run estrutura` falha se algum item ficar sem aula responsável.

---

## Começando

```bash
git clone <url-do-repositorio>
cd AulasLingProgADS
npm install
npm test
```

`npm test` deve passar. Depois rode:

```bash
npm run ex:run
```

Este **deve falhar** — os exercícios são publicados vermelhos de propósito. Eles são
o enunciado em forma executável, e deixá-los verdes é o seu trabalho.

Passo a passo completo em [recursos/setup.md](recursos/setup.md).

### Comandos do dia a dia

```bash
npm test                  # exemplos de todas as aulas (devem passar)
npm test -- aula05        # exemplos da aula 05
npm run ex -- aula05      # exercícios da aula 05, em watch
npm run ex -- aula05/01   # só o exercício 1
npm run typecheck         # checagem de tipos
npm run check             # tudo junto
```

---

## Estrutura do repositório

```
aulaNN-slug/
  README.md          # a aula
  exemplos/          # código do texto — testes .spec.ts que PASSAM
  exercicios/        # seu trabalho — testes .test.ts que FALHAM até você resolver
recursos/            # guias transversais
scripts/             # verificador de estrutura e cobertura da ementa
AGENTS.md            # contexto para agentes de IA (e material da Aula 12)
```

A separação entre `exemplos/*.spec.ts` (sempre verde) e `exercicios/*.test.ts`
(vermelho por design) é o que permite ao CI validar o curso sem mentir sobre o
estado dos exercícios.

---

## Recursos

| Documento | Para quê |
| --- | --- |
| [Guia das ferramentas de IA](recursos/guia-ferramentas-ia.md) | As quatro modalidades e quando cada uma cabe |
| [Catálogo de prompts](recursos/catalogo-de-prompts.md) | Prompts prontos por situação |
| [Checklist de revisão](recursos/checklist-revisao-de-codigo-ia.md) | Antes de aceitar qualquer código gerado |
| [Trilha de skills](recursos/trilha-de-skills.md) | As onze skills e onde aparecem |
| [Mapa da ementa](recursos/mapa-ementa.md) | Rastreabilidade e traduções de C |
| [Setup](recursos/setup.md) | Preparar o ambiente |
| [Como entregar](recursos/como-entregar.md) | Fluxo de entrega dos exercícios |
| [Rubrica do projeto](recursos/rubrica-projeto-final.md) | Como o projeto final é avaliado |
| [Glossário](recursos/glossario.md) | Termos do curso |
| [Template de aula](recursos/TEMPLATE-AULA.md) | Para quem for criar ou adaptar aulas |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) LTS (20+)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)
- [GitHub Copilot](https://github.com/features/copilot) — gratuito via [Student Pack](https://education.github.com/pack)
- Acesso a um chat de IA (Claude, ChatGPT ou Gemini) e, a partir da Aula 12, a um agente de codificação
