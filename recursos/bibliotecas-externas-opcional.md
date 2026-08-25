# Módulos e Bibliotecas Externas (material opcional)

> Arquivado a partir da antiga `aula09-modulos-bibliotecas` durante a reescrita do curso. A parte central (export/import) migrou para `aula03-funcoes-referencia-modulos`. O restante — organização de projeto, npm em detalhe, e um tour por bibliotecas (uuid, date-fns, chalk) — fica aqui como referência opcional; não é conteúdo obrigatório de nenhuma aula do plano atual.

## Organizando um Projeto

```
meu-projeto/
  src/
    index.ts
    models/
      aluno.ts
    services/
      aluno-service.ts
    utils/
      formatacao.ts
      index.ts            # Barrel file
  package.json
  tsconfig.json
```

```typescript
// src/models/aluno.ts
export interface Aluno {
  nome: string;
  ra: string;
  notas: number[];
}
```

## npm - Gerenciador de Pacotes

```bash
npm install pacote-nome       # dependência de produção
npm install -D pacote-nome    # dependência de desenvolvimento
```

| Seção | Quando usar |
|-------|-------------|
| `dependencies` | Pacotes necessários em produção |
| `devDependencies` | Ferramentas usadas apenas no desenvolvimento |

- **node_modules/**: pasta com todo o código dos pacotes instalados (NUNCA commite no Git!)
- **package-lock.json**: registra as versões exatas instaladas (SEMPRE commite no Git!)

## Bibliotecas Úteis

### uuid - Gerar IDs únicos

```typescript
import { v4 as gerarId } from "uuid";
const id: string = gerarId();
```

### date-fns - Manipulação de datas

```typescript
import { format, addDays, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const hoje = new Date();
console.log(format(hoje, "dd/MM/yyyy"));
```

### chalk - Cores no terminal

```typescript
import chalk from "chalk";
console.log(chalk.green("Sucesso!"));
```

## Módulos Built-in do Node.js

```typescript
import path from "path";
const caminho = path.join("src", "models", "aluno.ts");

import os from "os";
console.log(os.platform());
```
