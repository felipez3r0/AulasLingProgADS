// Ferramenta de autoavaliacao do projeto final.
//
// Rode isto no seu projeto antes de entregar. Ela nao substitui a
// rubrica - ela pega o que da para verificar automaticamente, para
// sobrar tempo de revisar o que so gente consegue avaliar.

export interface EstadoDoProjeto {
  temReadme: boolean;
  temGitignore: boolean;
  temDiarioDeIa: boolean;
  temCi: boolean;
  quantidadeDeCommits: number;
  quantidadeDeBranches: number;
  temPrDeAgenteRevisado: boolean;
  recursosComCrudCompleto: number;
  recursosSeRelacionam: boolean;
  quantidadeDeFiltros: number;
  regrasDeNegocio: number;
  testesPassam: boolean;
  typecheckPassa: boolean;
  cobreCasosDeBorda: boolean;
  arquivosComSegredo: string[];
  usaAnyNoCodigo: boolean;
}

export interface ItemDeChecagem {
  criterio: string;
  ok: boolean;
  observacao: string;
}

export interface ResultadoDaChecagem {
  itens: ItemDeChecagem[];
  bloqueios: string[];
  prontoParaEntregar: boolean;
  percentualAtendido: number;
}

const MIN_COMMITS = 15;
const MIN_RECURSOS_CRUD = 2;
const MIN_FILTROS = 2;
const MIN_REGRAS = 2;

/**
 * Verifica o estado do projeto contra os requisitos objetivos.
 *
 * `bloqueios` sao os itens que impedem a entrega, independentemente do resto.
 */
export function verificarEntrega(estado: EstadoDoProjeto): ResultadoDaChecagem {
  const itens: ItemDeChecagem[] = [
    {
      criterio: "CRUD completo em pelo menos 2 recursos",
      ok: estado.recursosComCrudCompleto >= MIN_RECURSOS_CRUD,
      observacao: `${estado.recursosComCrudCompleto} recurso(s) com CRUD completo`,
    },
    {
      criterio: "recursos se relacionam",
      ok: estado.recursosSeRelacionam,
      observacao: estado.recursosSeRelacionam ? "ok" : "os recursos estao isolados",
    },
    {
      criterio: "pelo menos 2 filtros por query param",
      ok: estado.quantidadeDeFiltros >= MIN_FILTROS,
      observacao: `${estado.quantidadeDeFiltros} filtro(s)`,
    },
    {
      criterio: "pelo menos 2 regras de negocio na camada de servico",
      ok: estado.regrasDeNegocio >= MIN_REGRAS,
      observacao: `${estado.regrasDeNegocio} regra(s)`,
    },
    {
      criterio: "testes passando",
      ok: estado.testesPassam,
      observacao: estado.testesPassam ? "ok" : "suite vermelha",
    },
    {
      criterio: "typecheck limpo",
      ok: estado.typecheckPassa,
      observacao: estado.typecheckPassa ? "ok" : "erros de tipo",
    },
    {
      criterio: "testes cobrem casos de borda",
      ok: estado.cobreCasosDeBorda,
      observacao: estado.cobreCasosDeBorda ? "ok" : "so caminho feliz",
    },
    {
      criterio: "sem `any` no codigo",
      ok: !estado.usaAnyNoCodigo,
      observacao: estado.usaAnyNoCodigo ? "ha `any` no codigo" : "ok",
    },
    {
      criterio: `pelo menos ${MIN_COMMITS} commits`,
      ok: estado.quantidadeDeCommits >= MIN_COMMITS,
      observacao: `${estado.quantidadeDeCommits} commit(s)`,
    },
    {
      criterio: "pelo menos 1 feature branch",
      ok: estado.quantidadeDeBranches >= 2,
      observacao: `${estado.quantidadeDeBranches} branch(es)`,
    },
    {
      criterio: "README documentando os endpoints",
      ok: estado.temReadme,
      observacao: estado.temReadme ? "ok" : "falta README.md",
    },
    {
      criterio: ".gitignore configurado",
      ok: estado.temGitignore,
      observacao: estado.temGitignore ? "ok" : "falta .gitignore",
    },
    {
      criterio: "CI configurado",
      ok: estado.temCi,
      observacao: estado.temCi ? "ok" : "falta workflow de CI",
    },
    {
      criterio: "DIARIO-IA.md preenchido",
      ok: estado.temDiarioDeIa,
      observacao: estado.temDiarioDeIa ? "ok" : "falta DIARIO-IA.md",
    },
    {
      criterio: "pelo menos 1 PR de agente revisado",
      ok: estado.temPrDeAgenteRevisado,
      observacao: estado.temPrDeAgenteRevisado ? "ok" : "nenhum PR de agente revisado",
    },
  ];

  const bloqueios: string[] = [];
  if (estado.arquivosComSegredo.length > 0) {
    bloqueios.push(`segredo commitado em: ${estado.arquivosComSegredo.join(", ")}`);
  }
  if (!estado.testesPassam) bloqueios.push("suite de testes vermelha");
  if (!estado.typecheckPassa) bloqueios.push("typecheck com erros");
  if (!estado.temDiarioDeIa) bloqueios.push("DIARIO-IA.md ausente");

  const atendidos = itens.filter((i) => i.ok).length;
  const percentualAtendido = Math.round((atendidos / itens.length) * 100);

  return {
    itens,
    bloqueios,
    prontoParaEntregar: bloqueios.length === 0 && atendidos === itens.length,
    percentualAtendido,
  };
}
