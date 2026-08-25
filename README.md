# Linguagem de Programação I - ADS (FATEC)

Repositório da disciplina de Linguagem de Programação I do curso de Análise e Desenvolvimento de Sistemas.

**Tecnologias:** TypeScript, Node.js, Express, SQLite (libSQL/Turso), Vitest
**Ferramentas:** VS Code, Git/GitHub, GitHub Copilot (ou assistente equivalente)

---

## Ementa oficial

Variáveis, constantes, operadores e expressões. Estruturas de seleção e repetição. Vetores, matrizes e cadeia de caracteres. Modularização de programas: passagem de parâmetros por valor e referência. Estruturas de dados heterogêneas. Manipulação de arquivos.

**Objetivo de aprendizagem:** solucionar problemas utilizando a lógica de programação e a implementação de programas por meio de uma linguagem de programação.

**Competência:** demonstrar capacidade de resolver problemas complexos e propor soluções criativas e inovadoras, através de algoritmos, linguagens de programação e estruturas de dados.

**Carga:** 80 aulas (4h/semana, 17 encontros: 15 de conteúdo + 2 de prova). **Pré-requisito:** Lógica de Programação (C).

---

## Por que esta disciplina é assim

Você já programa em C. Esta disciplina não vai reensinar `if`, `for` e funções — vai mapear o que você sabe para TypeScript em poucas semanas e usar o tempo restante no que realmente muda quando se desenvolve com assistentes de IA:

- **Ler** código que você não escreveu e prever o que ele faz antes de executar.
- **Especificar** o problema (contrato, tipos, casos de erro) antes de pedir ou escrever código.
- **Testar e verificar** se o código — seu ou gerado — faz o que a especificação pede.
- **Depurar** e **revisar** código com defeitos, inclusive código gerado por IA.
- **Decidir**: aceitar, ajustar ou rejeitar uma sugestão, e saber explicar por quê.

O backend (Node + Express) é o caso de estudo da segunda metade: é o tipo de código que assistentes geram bem e que você precisa saber ler, verificar e corrigir. Ele também é a API que o front-end em React da disciplina de Programação Web vai consumir, dentro do projeto integrador levantado em Engenharia de Software.

---

## Contrato de uso de IA

Vale para toda a disciplina. Cada atividade indica explicitamente o modo.

| Modo | O que significa | Onde se aplica |
|------|-----------------|----------------|
| **Sem IA** | Editor sem assistente, sem chat. | Provas práticas, diagnóstico inicial, exercícios marcados. |
| **IA como tutor** | Pode perguntar, pedir explicação, pedir dica. Não pode pedir a solução. | Exercícios de fixação, dúvidas de sintaxe. |
| **IA como par** | Pode gerar código, mas você escreve a especificação e os testes antes, e revisa o que foi gerado. | Aulas 06 e 09–14, projeto final. |

Regras que não mudam:

1. Todo código entregue é de sua responsabilidade. "Foi a IA" não é justificativa para bug, vulnerabilidade ou plágio.
2. O projeto final exige um **log de decisões**: o que foi pedido à IA, o que foi aceito, o que foi rejeitado e por quê.
3. Você pode ser sorteado para explicar qualquer trecho do seu projeto. Não saber explicar o próprio código é reprovação naquele critério.
4. A cota do plano gratuito do Copilot é limitada. As atividades foram desenhadas para usar IA em revisão e explicação mais do que em geração em massa. Planeje o uso.

---

## Estrutura das aulas

### Bloco 1 - De C para TypeScript (sala invertida)

Leia o material em casa. A aula é para resolver problemas e tirar dúvidas.

| Aula | Tema | Modo IA | Pasta |
|------|------|---------|-------|
| 01 | Git/GitHub, ambiente, contrato de IA e **diagnóstico** (ler C e prever saída) | Sem IA | [aula01-git-ambiente-diagnostico](aula01-git-ambiente-diagnostico/) |
| 02 | De C para TS: tipos, expressões, seleção, repetição — porte de programas próprios do 1º semestre | Tutor | [aula02-de-c-para-ts](aula02-de-c-para-ts/) |
| 03 | Funções, escopo, passagem por valor e por referência, módulos | Tutor | [aula03-funcoes-referencia-modulos](aula03-funcoes-referencia-modulos/) |
| 04 | Arrays, matrizes e strings — leitura de código sem executar | Tutor | [aula04-arrays-matrizes-strings](aula04-arrays-matrizes-strings/) |
| 05 | Objetos, interfaces e tipos: modelar dados a partir de um enunciado | Tutor | [aula05-objetos-modelagem](aula05-objetos-modelagem/) |

### Bloco 2 - Verificar antes de confiar

| Aula | Tema | Modo IA | Pasta |
|------|------|---------|-------|
| 06 | Testes com Vitest: você escreve os testes, a IA implementa, você julga | Par | [aula06-testes](aula06-testes/) |
| 07 | Assincronia (Promises, async/await) e manipulação de arquivos (`fs/promises`) | Tutor | [aula07-assincronia-arquivos](aula07-assincronia-arquivos/) |
| P1 | **Prova 1** (sem IA): prever saída, encontrar bug plantado, explicar trecho | Sem IA | [prova1](prova1/) |

### Bloco 3 - Backend como caso de estudo

| Aula | Tema | Modo IA | Pasta |
|------|------|---------|-------|
| 08 | HTTP e REST: escrever o contrato da API (endpoints, payloads, erros) e testar uma API alheia com curl/fetch | Tutor | [aula08-http-rest-contrato](aula08-http-rest-contrato/) |
| 09 | Express: gerar o servidor com o agente a partir do contrato e dos testes; a aula é revisar o que foi gerado | Par | [aula09-express-gerado-revisado](aula09-express-gerado-revisado/) |
| 10 | Persistência com SQLite (libSQL): padrão repository, revisar o SQL gerado, `file:` em dev e Turso em produção via variável de ambiente | Par | [aula10-sqlite-repository](aula10-sqlite-repository/) |
| 11 | Validação (Zod), tratamento de erros e middleware — bug hunt em código gerado com defeitos plantados | Par | [aula11-validacao-erros-bughunt](aula11-validacao-erros-bughunt/) |
| 12 | Code review cruzado de PRs com rubrica (avaliação por pares) | Par | [aula12-code-review](aula12-code-review/) |

### Bloco 4 - Projeto integrador

| Aula | Tema | Modo IA | Pasta |
|------|------|---------|-------|
| 13 | Projeto: contrato da API alinhado com o front → testes → implementação assistida | Par | [aula13-14-projeto](aula13-14-projeto/) |
| 14 | Projeto: revisão cruzada entre grupos e **deploy** (Render + Turso) | Par | [aula13-14-projeto](aula13-14-projeto/) |
| 15 | Buffer / recuperação / ajustes finais do projeto | — | — |
| P2 | **Prova 2** (sem IA) + defesas amostradas do projeto | Sem IA | [prova2-defesas](prova2-defesas/) |

> Ajuste: se o diagnóstico da aula 01 mostrar base fraca em C, o Bloco 1 ganha um encontro, retirado da aula 15.

---

## Projeto final (integrador)

O projeto é em grupo e atravessa três disciplinas do semestre:

| Disciplina | Responsabilidade |
|------------|------------------|
| Engenharia de Software | Levantamento do problema, requisitos, escopo |
| Programação Web | Front-end em React |
| **Linguagem de Programação I** | **Backend: API REST em TypeScript + Express** |

Nesta disciplina avalia-se **somente o backend**, mas ele precisa ser o backend real que o front do grupo consome. Um backend que não atende ao contrato combinado com o front não cumpre o objetivo.

Entregáveis obrigatórios (pasta `backend/` ou repositório próprio do grupo):

- Contrato da API (endpoints, payloads, códigos de erro) escrito **antes** do código e alinhado com quem faz o front
- Testes com Vitest cobrindo os endpoints e os casos de erro
- Código com tipagem, validação (Zod) e tratamento de erros
- Persistência em SQLite via `@libsql/client` (arquivo local em desenvolvimento, Turso em produção); modelagem do banco é assunto de Banco de Dados I, aqui avalia-se o acesso a dados
- API **publicada** (Render + Turso) com URL no README do projeto
- Histórico Git com commits por etapa; cada integrante deve ter commits no backend e pelo menos um PR revisado por outro integrante
- `DECISOES.md`: log de uso da IA (pedido, aceito, rejeitado, motivo)
- Divisão de responsabilidades do grupo declarada no README do projeto

Recomendação: o grupo não deve dividir "quem faz front" e "quem faz back". Todos passam pelo backend, ainda que em partes diferentes. A defesa amostrada é individual.

---

## Pré-requisitos de ambiente

- [Node.js](https://nodejs.org/) LTS
- [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- [GitHub Copilot](https://github.com/features/copilot) — plano gratuito ou via [GitHub Student Pack](https://education.github.com/pack)
- Contas gratuitas em [Render](https://render.com) e [Turso](https://turso.tech) (a partir da aula 10)

```bash
git clone <url-do-repositorio>
cd AulasLingProgADS/aula06-testes/projeto-base
npm install   # nas pastas de aula que têm package.json (06, 09, 10, 11, 13-14)
```

---

## Materiais de apoio

A pasta [recursos/](recursos/) reúne os artefatos usados em várias aulas e no projeto:

- [Template de contrato de API](recursos/template-contrato-api.md) — usado a partir da aula 08
- [Rubrica de code review](recursos/rubrica-code-review.md) — aulas 12 e 14, e PRs do projeto
- [Template de DECISOES.md](recursos/template-decisoes.md) — log de uso de IA do projeto final
- [Roteiro de deploy Render + Turso](recursos/roteiro-deploy-render-turso.md) — aula 14
- [Template de scaffolding](recursos/template-scaffolding/) — a estrutura base dos `projeto-base/` das aulas práticas
- Material opcional de aprofundamento: [tipos avançados de TypeScript](recursos/typescript-tipos-avancados-opcional.md) e [bibliotecas externas do ecossistema Node](recursos/bibliotecas-externas-opcional.md)

---

## Contribuindo com o material

Para quem for reescrever, revisar ou manter as pastas de aula deste repositório — estrutura padrão de cada `aulaNN-*/README.md`, o que foi removido/adicionado na reescrita, convenções de tooling (Vitest, scaffolding) e a política de sigilo das provas — veja [CONTRIBUTING.md](CONTRIBUTING.md).
