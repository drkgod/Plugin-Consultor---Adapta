---
name: gerar-specs
description: "Gera e revisa as SPECs da fase em foco no diretório 0N.Fase_N/01-SPECs, em modo onda e com profundidade executável pelo Ethos: sistemas nas fases 1–3, loops/agentes na fase 4 e validação transversal na fase 5. Use depois dos gates de escopo e antes de gerar-tasks."
---

# Gerar SPECs da fase em modo onda

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `gerar-specs`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a etapa autorizada e preserve o run até os finalizadores.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/workspace-layout.json`,
`../../contracts/consultor-workflows.json`, `references/contrato-spec.md`,
`references/contrato-decomposicao.md`, `../escopo-definitivo/references/contrato-fases-ethos.md` e
o template correspondente à fase: `references/template-spec.md` nas fases 1–3,
`references/template-spec-loop-ethos.md` na fase 4 ou
`references/template-spec-validacao-final.md` na fase 5.

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
   **Degrau da solução** com justificativa e contém instrução suficiente para execução sem decisão
   estrutural improvisada.
3. Nas fases 1–3, recuse “implementar”, “integrar” ou “configurar” sem detalhar estado atual e
   desejado, atores, permissões, dados, regras, contrato das integrações, passos, arquivos ou
   superfícies afetadas, exceções, rollback, critérios binários, provas e pontos de parada. Lacuna
   material vira `BLOQUEIO` e retorna ao consultor; o Ethos não a completa por suposição.
4. A fase 1 abre com entrega palpável. Fundação, levantamento ou preparação sem demonstração não
   satisfaz o gate.
5. Na fase 4, cada SPEC configura um loop, agente ou integração operacional e preenche os campos
   de Meta, Validação, Conectores, Skills e Arranque. A SPEC aponta para os sistemas das fases 1–3
   que usa; não amplia silenciosamente suas capacidades.
6. Na fase 5, gere SPECs de validação ponta a ponta que cubram todas as fases 1–4. Cada item da
   matriz declara pré-condição, procedimento, resultado esperado, evidência, responsável e ação em
   caso de falha. Cobertura incompleta bloqueia o fechamento.
7. Cada SPEC inclui `## TDD da SPEC`: RED, GREEN, REFACTOR/REGRESSÃO e comandos/evidências. Para
   entrega não técnica, use cenário verificável com condição, ação, resultado e prova.
8. Atualize `01-SPECs/00-INDICE.md` e as colunas de fase, requisito, SPEC, aceite e prova em
   `03-Projeto/02-Plano_de_acao/matriz-de-rastreabilidade.md`. Deixe `## Tasks vinculadas` vazio
   até a etapa `gerar-tasks` autorizada pelo SkillMind.
9. Para emenda aprovada, use `references/template-microspec.md` e registre em `## Emendas` da
   SPEC mãe.
10. Rode o painel `gerar-specs`; risco é obrigatório quando houver credencial, dado pessoal,
   input externo, API, banco, autenticação, publicação ou ação irreversível.
11. Corrija achados seguros; mudanças de intenção voltam ao consultor. Atualize `STATUS.md` e
   `changelog.md`.
12. Pare e devolva ao SkillMind a etapa `gerar-tasks`. SPEC define o contrato; a skill seguinte decompõe sem
   reescrever.

Revisores são read-only; o agente principal é o único escritor.
