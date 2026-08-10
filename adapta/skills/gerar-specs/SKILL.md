---
name: gerar-specs
description: Gera e revisa as SPECs da fase em foco no diretório 0N.Fase_N/01-SPECs, em modo onda, com resultado, limites, checklist, critérios de aceite, degrau da solução e TDD acoplado. Use depois dos gates de escopo e antes de gerar-tasks.
---

# Gerar SPECs da fase em modo onda

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `gerar-specs`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a etapa autorizada e preserve o run até os finalizadores.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/workspace-layout.json`,
`../../contracts/consultor-workflows.json`, `references/contrato-spec.md`,
`references/contrato-decomposicao.md` e `references/template-spec.md`.

As cinco fases ficam em `03-Projeto/02-Escopo-Definitivo.md`; a execução de cada fase vive em
`03-Projeto/02-Plano_de_acao/0N.Fase_N/`. As SPECs são geradas em onda: fase atual agora e fase
N+1 durante a fase N via `liberar-fase`.

## Gates

- Exija `.adapta/checks/check-escopo.md` e `.adapta/checks/check-cliente.md` aprovados.
- Se o escopo definitivo mudou depois do corte, exija decisão humana registrada e revalide.
- Gere e revise somente as SPECs da fase em foco.

## Composição e revisão

1. Leia `02-Escopo-Definitivo.md`, `matriz-de-rastreabilidade.md`, o recorte da fase, regras,
   riscos e a realidade do cliente. Para fase ≥ 2, leia evoluções aceitas e
   `.adapta/dividas.md`.
2. Escreva uma ou mais SPECs em
   `03-Projeto/02-Plano_de_acao/0N.Fase_N/01-SPECs/spec-*.md`. Toda SPEC declara o
   **Degrau da solução** com justificativa.
3. A fase 1 abre com entrega palpável. Fundação, levantamento ou preparação sem demonstração não
   satisfaz o gate.
4. Cada SPEC inclui `## TDD da SPEC`: RED, GREEN, REFACTOR/REGRESSÃO e comandos/evidências. Para
   entrega não técnica, use cenário verificável com condição, ação, resultado e prova.
5. Atualize `01-SPECs/00-INDICE.md` e as colunas de fase, requisito, SPEC, aceite e prova em
   `03-Projeto/02-Plano_de_acao/matriz-de-rastreabilidade.md`. Deixe `## Tasks vinculadas` vazio
   até a etapa `gerar-tasks` autorizada pelo SkillMind.
6. Para emenda aprovada, use `references/template-microspec.md` e registre em `## Emendas` da
   SPEC mãe.
7. Rode o painel `gerar-specs`; risco é obrigatório quando houver credencial, dado pessoal,
   input externo, API, banco, autenticação, publicação ou ação irreversível.
8. Corrija achados seguros; mudanças de intenção voltam ao consultor. Atualize `STATUS.md` e
   `changelog.md`.
9. Pare e devolva ao SkillMind a etapa `gerar-tasks`. SPEC define o contrato; a skill seguinte decompõe sem
   reescrever.

Revisores são read-only; o agente principal é o único escritor.
