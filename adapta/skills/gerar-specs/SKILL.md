---
name: gerar-specs
description: "Gera e revisa as SPECs da fase em foco no diretório 0N.Fase_N/01-SPECs, em modo onda e com profundidade executável pelo Ethos: sistemas nas fases 1–5, loops/agentes adicionais nas fases 4 e 5 e validação transversal também na fase 5."
---

# Gerar SPECs da fase em modo onda

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `gerar-specs`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a etapa autorizada e preserve o run até os finalizadores.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/workspace-layout.json`,
`../../contracts/consultor-workflows.json`, `references/contrato-spec.md`,
`references/contrato-decomposicao.md`, `../../references/review-calibration.md`,
`../../references/review-panels.md`, `../escopo-definitivo/references/contrato-fases-ethos.md` e
`references/template-spec.md` como contrato base em todas as fases; nas fases 4 e 5, carregue também
`references/template-spec-loop-ethos.md` para as SPECs adicionais de loop; na fase 5, carregue ainda
`references/template-spec-validacao-final.md` para as SPECs adicionais de validação.

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
3. Nas fases 1–5, recuse “implementar”, “integrar” ou “configurar” sem detalhar estado atual e
   desejado, atores, permissões, dados, regras, contrato das integrações, passos, arquivos ou
   superfícies afetadas, exceções, rollback, critérios binários, provas e pontos de parada. Lacuna
   material vira `BLOQUEIO` e retorna ao consultor; o Ethos não a completa por suposição.
4. A fase 1 abre com entrega palpável. Fundação, levantamento ou preparação sem demonstração não
   satisfaz o gate.
5. Nas fases 4 e 5, gere primeiro as SPECs de sistema previstas para a fase usando o contrato base.
   Cada uma preserva profundidade, aceite e TDD. O conjunto da fase precisa conter ao menos uma
   SPEC de sistema; uma SPEC de loop não satisfaz esse gate.
6. Depois, gere SPECs adicionais para cada loop, agente ou integração operacional das fases 4 e 5,
   preenchendo Meta, Validação, Conectores, Skills e Arranque. A SPEC aponta para os sistemas que
   usa e não amplia silenciosamente suas capacidades.
7. Na fase 5, gere também SPECs de validação ponta a ponta que cubram todas as fases 1–5. Cada item da
   matriz declara pré-condição, procedimento, resultado esperado, evidência, responsável e ação em
   caso de falha. Cobertura incompleta bloqueia o fechamento.
8. Cada SPEC inclui `## TDD da SPEC`: RED, GREEN, REFACTOR/REGRESSÃO e comandos/evidências. Para
   entrega não técnica, use cenário verificável com condição, ação, resultado e prova.
9. Atualize `01-SPECs/00-INDICE.md` e as colunas de fase, requisito, SPEC, aceite e prova em
   `03-Projeto/02-Plano_de_acao/matriz-de-rastreabilidade.md`. Deixe `## Tasks vinculadas` vazio
   até a etapa `gerar-tasks` autorizada pelo SkillMind.
10. Para emenda aprovada, use `references/template-microspec.md` e registre em `## Emendas` da
   SPEC mãe.
11. Rode o painel `gerar-specs` nos territórios exclusivos do contrato comum e calibre gravidade
   antes da síntese; risco é obrigatório quando houver credencial, dado pessoal, input externo,
   API, banco, autenticação, publicação ou ação irreversível.
12. Corrija achados seguros; mudanças de intenção voltam ao consultor. Atualize `STATUS.md` e
   `changelog.md`.
13. Pare e devolva ao SkillMind a etapa `gerar-tasks`. SPEC define o contrato; a skill seguinte decompõe sem
   reescrever.

Revisores são read-only; o agente principal é o único escritor.
