// Manipulacao de arquivos com node:fs/promises.
//
// Repare em duas decisoes que percorrem todo o arquivo:
//   1. toda funcao recebe o CAMINHO como parametro, em vez de fixar um
//      caminho la dentro. Sem isso, nao da para testar sem sujar o projeto.
//   2. usamos a versao de promises (async/await), nao a sincrona.

import { readFile, writeFile, appendFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import { join, dirname, extname, basename } from "node:path";

/** Le um arquivo de texto inteiro. */
export async function lerTexto(caminho: string): Promise<string> {
  return readFile(caminho, "utf8");
}

/** Escreve texto, criando a pasta se preciso. Sobrescreve o que houver. */
export async function escreverTexto(caminho: string, conteudo: string): Promise<void> {
  await mkdir(dirname(caminho), { recursive: true });
  await writeFile(caminho, conteudo, "utf8");
}

/** Acrescenta ao fim, sem apagar o que ja existe. */
export async function acrescentarLinha(caminho: string, linha: string): Promise<void> {
  await mkdir(dirname(caminho), { recursive: true });
  await appendFile(caminho, `${linha}\n`, "utf8");
}

/** Existe? Repare que a checagem e feita com try/catch, nao com um `exists`. */
export async function existe(caminho: string): Promise<boolean> {
  try {
    await stat(caminho);
    return true;
  } catch {
    return false;
  }
}

/** Lista arquivos de uma pasta, filtrando por extensao. */
export async function listarPorExtensao(pasta: string, ext: string): Promise<string[]> {
  const entradas = await readdir(pasta);
  return entradas.filter((nome) => extname(nome) === ext).sort();
}

/** Caminhos: use `join`, nunca concatene com "/" na mao. */
export function montarCaminho(pasta: string, arquivo: string): string {
  return join(pasta, arquivo);
}

export function nomeSemExtensao(caminho: string): string {
  return basename(caminho, extname(caminho));
}

/** Apaga uma pasta inteira. Usado pelos testes para limpar. */
export async function apagar(caminho: string): Promise<void> {
  await rm(caminho, { recursive: true, force: true });
}
