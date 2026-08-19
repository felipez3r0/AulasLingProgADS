// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Aqui a tarefa e ORGANIZAR: separar responsabilidades em modulos e
// reexportar por um barril. Voce vai criar os arquivos dentro de
// exercicios/relatorio/ e este arquivo apenas os reune.
//
// Estrutura esperada:
//   relatorio/formatacao.ts  -> formatarMoeda, formatarPercentual
//   relatorio/calculo.ts     -> total, media, maiorValor
//   relatorio/index.ts       -> reexporta os dois
//
// Metodo: peca ao Copilot Chat um esboco da divisao, mas DECIDA voce
// o que vai em cada modulo. A pergunta que resolve: "o que muda junto?"
//
// Rode: npm run ex -- 02-organizar

export {
  formatarMoeda,
  formatarPercentual,
  total,
  media,
  maiorValor,
} from "./relatorio/index.js";
