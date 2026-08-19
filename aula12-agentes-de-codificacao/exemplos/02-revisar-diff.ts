// Revisar diff: o que procurar quando um agente entrega 200 linhas.
//
// Este arquivo traz DUAS implementacoes da mesma funcao. A segunda e o
// tipo de coisa que um agente entrega quando a tarefa e vaga: funciona
// nos casos testados e traz decisoes que ninguem pediu.

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
}

/** Versao enxuta: faz o que foi pedido, nada mais. */
export function buscarAtivos(usuarios: Usuario[], termo: string): Usuario[] {
  const busca = termo.trim().toLowerCase();
  return usuarios.filter(
    (u) => u.ativo && (u.nome.toLowerCase().includes(busca) || u.email.toLowerCase().includes(busca)),
  );
}

/**
 * Versao "completa" gerada por agente a partir de "faz uma busca de usuarios".
 *
 * Ela funciona. E traz cinco decisoes que ninguem pediu:
 *   1. paginacao com valores padrao inventados
 *   2. ordenacao por nome, que ninguem mencionou
 *   3. um cache global, que quebra a previsibilidade
 *   4. inclui usuarios INATIVOS quando o termo bate exatamente
 *   5. limite de resultados fixado em 50
 *
 * Cada uma parece razoavel isolada. Juntas, sao uma funcao que ninguem
 * consegue prever - e um diff que o revisor aprovou porque "os testes passaram".
 */
const cacheDeBusca = new Map<string, Usuario[]>();

export function buscarUsuarios(
  usuarios: Usuario[],
  termo: string,
  pagina = 1,
  porPagina = 20,
): Usuario[] {
  const chave = `${termo}-${pagina}-${porPagina}`;
  const emCache = cacheDeBusca.get(chave);
  if (emCache) return emCache;

  const busca = termo.trim().toLowerCase();
  const encontrados = usuarios
    .filter((u) => {
      const bateNome = u.nome.toLowerCase().includes(busca);
      const bateEmail = u.email.toLowerCase().includes(busca);
      const exato = u.nome.toLowerCase() === busca;
      return (u.ativo && (bateNome || bateEmail)) || exato;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .slice((pagina - 1) * porPagina, (pagina - 1) * porPagina + porPagina)
    .slice(0, 50);

  cacheDeBusca.set(chave, encontrados);
  return encontrados;
}

/** So para os testes conseguirem observar o cache. */
export function limparCache(): void {
  cacheDeBusca.clear();
}

export function tamanhoDoCache(): number {
  return cacheDeBusca.size;
}
