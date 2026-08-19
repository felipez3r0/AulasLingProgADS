# Trilha de skills de dev-com-IA

Este curso ensina TypeScript. Mas o que ele **treina** são onze habilidades que
decidem se você trabalha com IA ou é substituído pela conversa sobre ela.

Cada skill é **introduzida** numa aula e **reforçada** em várias outras. Nenhuma é
ensinada uma vez e abandonada — é por isso que a tabela abaixo é uma espiral, não
uma lista.

---

## As onze skills

| # | Skill | O que é, na prática |
| --- | --- | --- |
| **S1** | Especificar intenção | Transformar "quero um sistema de notas" em entrada, saída, casos de borda e restrições. Um prompt bom é uma especificação boa. |
| **S2** | Ler código | Entender código que você não escreveu, incluindo o seu de duas semanas atrás. O gargalo da profissão deixou de ser escrever. |
| **S3** | Verificar | Provar que funciona: rodar, testar, checar tipos. Nada entra sem prova. |
| **S4** | Rastrear execução mentalmente | Acompanhar valores passo a passo e prever a saída **antes** de rodar. É o que separa revisar de aceitar. |
| **S5** | Depurar por hipótese | Ler stack trace, reduzir à reprodução mínima, formular e derrubar hipóteses. Necessário quando a IA erra e insiste. |
| **S6** | Decompor em passos verificáveis | Quebrar um problema em pedaços pequenos, cada um com critério de pronto. É literalmente como se dirige um agente. |
| **S7** | Tipos como contrato | Usar o sistema de tipos como especificação executável. O compilador é o primeiro revisor do código gerado. |
| **S8** | Git como rede de segurança | Commits pequenos, leitura de diff, reverter sem medo. Quando o agente escreve 300 linhas, o diff é a sua defesa. |
| **S9** | Gerenciar contexto do agente | Decidir o que o agente precisa saber: `AGENTS.md`, arquivos relevantes, fronteiras da tarefa. |
| **S10** | Ceticismo calibrado | Desconfiar na medida certa: dependências alucinadas, APIs inventadas, segredos vazados, dados sensíveis. |
| **S11** | Revisar código que você não escreveu | Ler um PR e decidir: aprovo, peço mudança ou recuso. |

---

## Espiral: onde cada skill aparece

**I** = introduzida · **R** = reforçada · **A** = avaliada no projeto final

| Skill | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 |
| --- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| S1 Especificar intenção | | | **I** | | R | | | R | | | | R | R | R | A |
| S2 Ler código | | **I** | R | | R | | R | | R | | R | R | | R | A |
| S3 Verificar | R | | **I** | R | R | R | R | R | R | R | R | R | R | R | A |
| S4 Rastrear execução | | | R | | **I** | | R | | | | R | | | | A |
| S5 Depurar por hipótese | | | | | R | | | | | R | **I** | R | R | R | A |
| S6 Decompor | | | R | | | **I** | | R | | | | R | R | R | A |
| S7 Tipos como contrato | | | | **I** | | R | R | R | | R | | | R | R | A |
| S8 Git como rede | **I** | R | R | R | R | R | R | R | R | R | R | R | | R | A |
| S9 Contexto do agente | | | | | | | | | R | | | **I** | R | R | A |
| S10 Ceticismo calibrado | R | | | | | | | | **I** | R | R | R | | R | A |
| S11 Revisar código alheio | | R | | | | | R | | | | | **I** | | R | A |

Convenções que sustentam a espiral:

- Todo `README.md` de aula declara no cabeçalho quais skills trabalha.
- O nível 🚫 dos exercícios sempre exercita **S2, S3, S4**.
- O nível 🤝 sempre exercita **S1, S3, S7**.
- O nível 🤖 sempre exercita **S6, S9, S11**.
- `npm run estrutura` falha se alguma skill sumir do curso.

---

## Por que estas, e não outras

A escolha não é sobre "conceitos clássicos de programação". É sobre **o que sobra
para o humano** quando a produção de código deixa de ser cara.

Quando escrever custava caro, a competência central era escrever. Hoje o texto sai
em segundos, e o que ficou caro é **julgar**: isto está certo? resolve o problema
certo? vai quebrar de que jeito? Julgar exige exatamente as skills acima — e todas
elas se apoiam nos fundamentos que a disciplina cobre, porque não existe rastrear
execução sem entender laço, nem tipo como contrato sem entender tipo.

É por isso que este curso ficou **mais** exigente nos fundamentos, e não menos.
