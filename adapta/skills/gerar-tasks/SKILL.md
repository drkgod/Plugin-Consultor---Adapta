---
name: gerar-tasks
description: Decompõe SPECs detalhadas em tasks independentes, binárias e executáveis uma por vez pelo Ethos; sincroniza 00-Tasks_Gerais.md, a Jornada, as Tasks vinculadas das SPECs e a matriz de rastreabilidade.
---

# Gerar tasks a partir das SPECs

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `gerar-tasks`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a decomposição autorizada e preserve o run até os finalizadores.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/workspace-layout.json`,
`../../contracts/subagents.json`, `../../references/review-calibration.md`,
`../../references/review-panels.md`, `references/contrato-tasks.md`, as SPECs da fase em foco e
`schemas/revisao-tasks.schema.json`.

## Gates

- Exija `.adapta/checks/check-escopo.md` aprovado.
- Exija SPECs revisadas, com critérios de aceite e TDD executável.
- Se uma task exigir mudar resultado, limite, critério ou prova, devolva ao SkillMind a etapa
  `gerar-specs`.

## Processo

1. Leia `0N.Fase_N/00-Tasks_Gerais.md`, todas as SPECs em `0N.Fase_N/01-SPECs/`, a lista
   `00.tasks_per_fase/fase_N.md` e `matriz-de-rastreabilidade.md`.
2. Para cada SPEC, derive tasks pela progressão de evidência: preparação, caminho principal, bordas/erros, integração/handoff e prova final, somente quando cada recorte deixar estado válido e demonstrável.
3. Cada task possui ID estável, ação, dono, SPEC, critério binário, subseção exata da SPEC, recorte da prova, evidência esperada, pré-condições, ponto de parada e status. Não use uma task vaga para compensar SPEC rasa; devolva ao SkillMind a etapa `gerar-specs`.
4. Tasks liberadas na mesma leva não dependem de outra task aberta. Uma task por SPEC é corte degenerado, salvo micro-SPEC proporcional.
5. Sincronize quatro projeções do mesmo conjunto:
   - tabela operacional completa em `0N.Fase_N/00-Tasks_Gerais.md`;
   - checklist da Jornada em `00.tasks_per_fase/fase_N.md`, preservando cada marcador `<!-- id:… -->`; task nova recebe um UUID uma única vez;
   - `## Tasks vinculadas` de cada SPEC;
   - `03-Projeto/02-Plano_de_acao/matriz-de-rastreabilidade.md`.
   A projeção da Jornada contém título e `[ ]`/`[x]`; os detalhes permanecem no arquivo de tasks gerais e nas SPECs.
6. Rode `revisor-decomposicao` e `revisor-rastreabilidade` nos territórios exclusivos do contrato comum, calibre gravidade, deduplicate por consequência e corrija inconsistências seguras.
7. Atualize `STATUS.md` e `changelog.md`. Informe que a fase está pronta para handoff ou para o dry-run de `liberar-fase`.

Nas fases 1–5, cada task executa somente o detalhe já decidido na SPEC. Nas fases 4 e 5, preserve tasks de sistema e separe as tasks adicionais de loop; não combine dois loops ou duas metas na mesma task. Na fase 5, tasks adicionais executam a matriz de validação e registram resultado positivo ou falha; não corrigem silenciosamente outra fase sem emenda/autorização.

## Emendas

Micro-SPEC aprovada pode gerar uma task. Registre-a nas quatro projeções, preservando histórico.
Revisores são read-only; o agente principal é o único escritor.
