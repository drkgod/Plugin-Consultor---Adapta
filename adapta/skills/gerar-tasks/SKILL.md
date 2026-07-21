---
name: gerar-tasks
description: Decompoe SPECs revisadas em tasks independentes, binarias e executaveis por um papel em uma sessao; sincroniza a tabela operacional completa de Tasks da fase, as Tasks vinculadas de cada SPEC e a matriz de rastreabilidade. Use depois de gerar-specs ou ao criar uma emenda aprovada. Nao cria nem reescreve o contrato da SPEC.
---

# Gerar tasks a partir das SPECs

Carregue `../../personas/consultor-adapta.md`, `../../contracts/subagents.json`,
`references/contrato-tasks.md`, as SPECs da fase em foco e
`schemas/revisao-tasks.schema.json`.

## Gates

- Exija `check-escopo.md` e `check-cliente.md` aprovados.
- Exija SPECs da fase em foco revisadas por `gerar-specs`, com critérios de aceite e TDD
  executável.
- Se uma task exigir mudar resultado, limite, critério ou prova da SPEC, pare e devolva para
  `/adapta:gerar-specs`. Task não corrige contrato por baixo.

## Processo

1. Leia a fase em foco, todas as suas SPECs e `05_execucao/matriz-specs-fases.md`.
2. Para cada SPEC, derive tasks pela progressão de evidência: preparação/fixture, caminho
   principal, bordas/erros, integração/handoff e prova final, somente quando cada recorte deixar
   um estado válido e demonstrável.
3. Cada task deve ter:
   - ID estável, ação concreta e um dono;
   - uma SPEC de origem;
   - critério binário;
   - recorte nomeado da prova da SPEC;
   - evidência esperada;
   - pré-condições já satisfeitas no momento da liberação;
   - status.
4. **Independência:** nenhuma task liberada na mesma leva depende de outra task aberta. Quando a
   sequência for inevitável, organize levas separadas ou recomponha o corte.
   **Uma task por SPEC é corte degenerado**, salvo micro-spec que explicitamente cabe em uma task.
5. Escreva o mesmo conjunto canônico em três projeções, sem criar lista paralela:
   - `## Tasks` de `04_plano/fases/fase-N.md` como **tabela operacional completa**, com as
     colunas `ID`, `Task`, `Dono`, `SPEC`, `Critério`, `Recorte da prova`,
     `Evidência esperada`, `Pré-condições` e `Status`;
   - `## Tasks vinculadas` de cada SPEC;
   - `05_execucao/matriz-specs-fases.md`.
   `/adapta:gerar-pasta-cliente` copia essa fase pronta para o repo do cliente sem reescrever,
   resumir ou recriar as tasks; portanto a task precisa nascer completa aqui.
6. Rode o painel `gerar-tasks`:
   - `revisor-decomposicao` verifica tamanho, independência, dono e recorte da prova;
   - `revisor-rastreabilidade` verifica consistência das três projeções e ausência de task órfã.
7. Corrija inconsistências seguras. Mudança de intenção ou de contrato volta ao consultor e à
   SPEC proprietária.
8. Atualize STATUS, índice e changelog. Informe que a fase está pronta para
   `/adapta:gerar-pasta-cliente` ou para o dry-run de `liberar-fase`.

## Emendas

Micro-spec aprovada por D19 pode gerar uma única task. Registre a task na fase, na seção
`## Emendas` e em `## Tasks vinculadas` da SPEC mãe, preservando o histórico append-only.

Subagents são read-only e retornam `schemas/revisao-tasks.schema.json`; o agente principal é o
único escritor.
