// Erros de dominio: classes que carregam o status HTTP correspondente.
//
// Assim a camada de servico nao precisa saber o que e HTTP: ela lanca
// "nao encontrado", e o middleware traduz para 404.

export class ErroDaApi extends Error {
  constructor(
    mensagem: string,
    readonly status: number,
    readonly detalhes?: unknown,
  ) {
    super(mensagem);
    this.name = new.target.name;
  }
}

export class NaoEncontrado extends ErroDaApi {
  /**
   * Recebe a mensagem pronta em vez de montar `${recurso} nao encontrado`.
   *
   * Concordancia de genero em portugues nao sai de concatenacao: "tarefa
   * nao encontrado" e "rota nao encontrado" estao errados. Montar mensagem
   * de usuario grudando pedacos e um erro classico - e um dos que codigo
   * gerado por IA comete com mais frequencia em portugues.
   */
  constructor(mensagem: string) {
    super(mensagem, 404);
  }
}

export class DadosInvalidos extends ErroDaApi {
  constructor(detalhes: unknown) {
    super("dados invalidos", 400, detalhes);
  }
}

export class Conflito extends ErroDaApi {
  constructor(mensagem: string) {
    super(mensagem, 409);
  }
}
