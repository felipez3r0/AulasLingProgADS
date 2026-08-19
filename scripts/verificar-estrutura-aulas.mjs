#!/usr/bin/env node
/**
 * Verificador de estrutura do curso.
 *
 * Prova, de forma automatizada, tres coisas que um curso pode facilmente
 * perder ao longo do tempo:
 *
 *   1. Toda aula segue o mesmo template (o aluno sabe onde procurar cada coisa).
 *   2. Todo exemplo tem teste e todo exercicio tem teste.
 *   3. Os 7 itens da ementa oficial da FATEC estao cobertos por alguma aula.
 *
 * O item 3 e o mais importante: a ementa e documento formal da disciplina.
 * Este script falha o CI se algum item ficar orfao.
 *
 * Uso: npm run estrutura
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Itens da ementa oficial da FATEC, com o codigo usado nos metadados das aulas. */
const EMENTA = {
  E1: "Variaveis, constantes, operadores e expressoes",
  E2: "Comandos de desvio",
  E3: "Controle de malhas",
  E4: "Vetores e ponteiros",
  E5: "Funcoes de biblioteca",
  E6: "Estruturas, unioes e tipos definidos pelo usuario",
  E7: "Manipulacao de arquivos",
};

/** Skills de dev-com-IA. Toda aula declara quais trabalha. */
const SKILLS = {
  S1: "Especificar intencao",
  S2: "Ler codigo",
  S3: "Verificar (testes, tipos, execucao)",
  S4: "Rastrear execucao mentalmente",
  S5: "Depurar por hipotese",
  S6: "Decompor em passos verificaveis",
  S7: "Tipos como contrato",
  S8: "Git como rede de seguranca",
  S9: "Gerenciar contexto do agente",
  S10: "Ceticismo calibrado",
  S11: "Revisar codigo que voce nao escreveu",
};

/**
 * Secoes obrigatorias, na ordem em que devem aparecer.
 * O casamento e por prefixo, para o titulo poder variar depois dos dois pontos.
 */
const SECOES_OBRIGATORIAS = [
  "## Objetivos",
  "## Por que isso importa quando a IA escreve o codigo",
  "## Antes de comecar",
  "## Leitura critica",
  "## Verificacao",
  "## Prompts desta aula",
  "## Git desta aula",
  "## Exercicios",
  "### 🚫",
  "### 🤝",
  "### 🤖",
  "## Autoavaliacao",
  "## Leitura complementar",
];

/** A aula de projeto final nao segue o template de aula expositiva. */
const ISENTAS_DO_TEMPLATE = new Set(["aula15-projeto-final"]);

const erros = [];
const avisos = [];

const semAcento = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function listarAulas() {
  return readdirSync(RAIZ)
    .filter((n) => /^aula\d{2}-/.test(n))
    .filter((n) => statSync(join(RAIZ, n)).isDirectory())
    .sort();
}

function arquivosTs(dir) {
  if (!existsSync(dir)) return [];
  const saida = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const caminho = join(dir, entrada.name);
    if (entrada.isDirectory()) saida.push(...arquivosTs(caminho));
    else if (entrada.name.endsWith(".ts")) saida.push(caminho);
  }
  return saida;
}

function verificarAula(aula) {
  const dir = join(RAIZ, aula);
  const readme = join(dir, "README.md");

  if (!existsSync(readme)) {
    erros.push(`${aula}: falta README.md`);
    return { ementa: [], skills: [] };
  }

  const texto = readFileSync(readme, "utf8");
  const linhas = texto.split("\n");

  // --- metadados -----------------------------------------------------------
  const itensEmenta = [];
  const itensSkill = [];

  const linhaEmenta = linhas.find((l) => semAcento(l).includes("**ementa oficial:**"));
  if (!linhaEmenta) {
    erros.push(`${aula}: README nao declara "**Ementa oficial:**" no bloco de metadados`);
  } else if (!semAcento(linhaEmenta).includes("transversal")) {
    for (const cod of linhaEmenta.match(/\bE[1-7]\b/g) ?? []) itensEmenta.push(cod);
    if (itensEmenta.length === 0) {
      erros.push(`${aula}: "Ementa oficial" nao cita nenhum codigo E1..E7 nem "transversal"`);
    }
  }

  const linhaSkills = linhas.find((l) => semAcento(l).includes("**skills:**"));
  if (!linhaSkills) {
    erros.push(`${aula}: README nao declara "**Skills:**" no bloco de metadados`);
  } else {
    for (const cod of linhaSkills.match(/\bS\d{1,2}\b/g) ?? []) {
      if (!SKILLS[cod]) erros.push(`${aula}: skill desconhecida "${cod}"`);
      else itensSkill.push(cod);
    }
    if (itensSkill.length === 0) erros.push(`${aula}: "Skills" nao cita nenhuma skill S1..S11`);
  }

  // --- secoes obrigatorias, na ordem ---------------------------------------
  if (!ISENTAS_DO_TEMPLATE.has(aula)) {
    const cabecalhos = linhas.filter((l) => l.startsWith("#")).map(semAcento);
    let cursor = 0;
    for (const secao of SECOES_OBRIGATORIAS) {
      const alvo = semAcento(secao);
      const achouEm = cabecalhos.findIndex((c, i) => i >= cursor && c.startsWith(alvo));
      if (achouEm === -1) {
        const existeForaDeOrdem = cabecalhos.some((c) => c.startsWith(alvo));
        erros.push(
          existeForaDeOrdem
            ? `${aula}: secao "${secao}" esta fora da ordem do template`
            : `${aula}: falta a secao "${secao}"`,
        );
      } else {
        cursor = achouEm + 1;
      }
    }
  }

  // --- pastas de codigo ----------------------------------------------------
  const dirExemplos = join(dir, "exemplos");
  const dirExercicios = join(dir, "exercicios");

  if (!existsSync(dirExemplos)) {
    erros.push(`${aula}: falta a pasta exemplos/`);
  } else {
    // Todo exemplo apresentado na aula precisa de teste. Modulos de apoio em
    // subpastas (ex: exemplos/loja/) sao exercitados pelo teste do exemplo que
    // os importa, entao nao exigimos um .spec.ts para cada um deles.
    // Excecao: leitura-critica/ e conteudo da aula e precisa de teste proprio.
    for (const arq of arquivosTs(dirExemplos)) {
      if (arq.endsWith(".spec.ts")) continue;
      if (arq.includes("mini-projeto")) continue;
      const emSubpasta = dirname(arq) !== dirExemplos;
      const emLeituraCritica = arq.includes(`${sep}leitura-critica${sep}`);
      if (emSubpasta && !emLeituraCritica) continue;
      const irmao = arq.replace(/\.ts$/, ".spec.ts");
      if (!existsSync(irmao)) {
        erros.push(`${relative(RAIZ, arq)}: exemplo sem teste irmao (.spec.ts)`);
      }
    }
  }

  if (!existsSync(dirExercicios)) {
    if (!ISENTAS_DO_TEMPLATE.has(aula)) erros.push(`${aula}: falta a pasta exercicios/`);
  } else {
    for (const arq of arquivosTs(dirExercicios)) {
      if (arq.endsWith(".test.ts")) continue;
      const irmao = arq.replace(/\.ts$/, ".test.ts");
      if (!existsSync(irmao)) {
        erros.push(`${relative(RAIZ, arq)}: exercicio sem teste irmao (.test.ts)`);
      }
    }
    // sufixo errado deixaria o exercicio rodar na suite de exemplos
    for (const arq of arquivosTs(dirExercicios)) {
      if (arq.endsWith(".spec.ts")) {
        erros.push(
          `${relative(RAIZ, arq)}: exercicio usando sufixo .spec.ts (reservado a exemplos verdes)`,
        );
      }
    }
    for (const arq of arquivosTs(dirExemplos)) {
      if (arq.endsWith(".test.ts")) {
        erros.push(
          `${relative(RAIZ, arq)}: exemplo usando sufixo .test.ts (reservado a exercicios vermelhos)`,
        );
      }
    }
  }

  // --- links relativos quebrados -------------------------------------------
  for (const [, alvo] of texto.matchAll(/\]\((?!https?:|mailto:|#)([^)]+)\)/g)) {
    const limpo = alvo.split("#")[0];
    if (!limpo) continue;
    const candidatos = [join(dir, limpo), join(RAIZ, limpo)];
    if (!candidatos.some((c) => existsSync(c))) {
      erros.push(`${aula}: link quebrado -> ${limpo}`);
    }
  }

  return { ementa: itensEmenta, skills: itensSkill };
}

// ---------------------------------------------------------------------------

const aulas = listarAulas();
console.log(`\nVerificando ${aulas.length} aulas em ${RAIZ}\n`);

if (aulas.length !== 15) {
  avisos.push(`esperava 15 aulas, encontrei ${aulas.length}`);
}

const cobertura = Object.fromEntries(Object.keys(EMENTA).map((k) => [k, []]));
const usoDeSkill = Object.fromEntries(Object.keys(SKILLS).map((k) => [k, []]));

for (const aula of aulas) {
  const { ementa, skills } = verificarAula(aula);
  for (const e of ementa) cobertura[e]?.push(aula);
  for (const s of skills) usoDeSkill[s]?.push(aula);
}

// --- cobertura da ementa oficial (o teste que importa) ---------------------
console.log("Cobertura da ementa oficial:");
for (const [cod, descricao] of Object.entries(EMENTA)) {
  const aulasDoItem = cobertura[cod];
  const marca = aulasDoItem.length > 0 ? "ok " : "FALTA";
  console.log(`  [${marca}] ${cod} ${descricao}: ${aulasDoItem.join(", ") || "-- nenhuma aula --"}`);
  if (aulasDoItem.length === 0) {
    erros.push(`ementa: item ${cod} (${descricao}) nao e coberto por nenhuma aula`);
  }
}

console.log("\nCobertura das skills de dev-com-IA:");
for (const [cod, nome] of Object.entries(SKILLS)) {
  const aulasDaSkill = usoDeSkill[cod];
  const marca = aulasDaSkill.length >= 2 ? "ok " : aulasDaSkill.length === 1 ? "so1" : "FALTA";
  console.log(`  [${marca}] ${cod} ${nome}: ${aulasDaSkill.length} aula(s)`);
  if (aulasDaSkill.length === 0) erros.push(`skills: ${cod} (${nome}) nao aparece em nenhuma aula`);
  else if (aulasDaSkill.length === 1) avisos.push(`skill ${cod} aparece em uma unica aula (sem espiral)`);
}

// --- relatorio -------------------------------------------------------------
if (avisos.length > 0) {
  console.log(`\n${avisos.length} aviso(s):`);
  for (const a of avisos) console.log(`  - ${a}`);
}

if (erros.length > 0) {
  console.error(`\n${erros.length} erro(s):`);
  for (const e of erros) console.error(`  x ${e}`);
  console.error("");
  process.exit(1);
}

console.log("\nEstrutura do curso validada com sucesso.\n");
