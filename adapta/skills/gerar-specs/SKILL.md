---
name: gerar-specs
description: Gera e revisa as SPECs da fase em foco em modo onda, cada uma com resultado, limites, checklist, criterios de aceite, degrau da solucao e TDD acoplado. Use depois dos gates de escopo e antes de gerar-tasks. Nao decompoe nem escreve tasks.
---

# Gerar SPECs da fase em modo onda

Carregue `../../personas/consultor-adapta.md`, `../../contracts/consultor-workflows.json`,
`references/contrato-spec.md`, `references/contrato-decomposicao.md` e
`references/template-spec.md`.

As cinco fases permanecem detalhadas em `04_plano/fases/fase-N.md`; as SPECs são geradas em
onda (D21): fase atual agora, fase N+1 durante a fase N via `liberar-fase`, alimentadas pelas
evoluções aceitas e pelo ledger de dívidas.

## Gates

- Exija `check-escopo.md` e `check-cliente.md` aprovados.
- Se o escopo mudou depois do corte, exija decisão humana registrada e revalide o conjunto.
- Gere e revise somente as SPECs da fase em foco. O cliente recebe apenas a fase aberta.

## Composição e revisão

1. Leia PRD, escopo, matriz de rastreabilidade, fase em foco, regras de negócio, riscos e a
   realidade do cliente. Em onda (fase ≥ 2), leia também evoluções aceitas e
   `05_execucao/dividas.md`.
2. Escreva uma ou mais SPECs por unidade verificável usando o template e os cortes fase → SPEC
   de `contrato-decomposicao.md`. Toda SPEC declara o **Degrau da solução** com justificativa.
3. A fase 1 abre com uma entrega palpável e demonstrável; fundação, levantamento ou preparação
   sem demonstração não satisfaz o gate.
4. Fases futuras mantêm objetivo, escopo, aceite, dependências e "Fora desta fase"; suas SPECs
   chegam na onda. Decisão dependente de evidência anterior vira condição explícita, sem deixar
   arquitetura estrutural em aberto.
5. Em cada SPEC, gere `## TDD da SPEC`:
   - **RED:** teste ou cenário que falha antes;
   - **GREEN:** menor comportamento esperado;
   - **REFACTOR/REGRESSÃO:** proteção contra regressão e limpeza;
   - **Comandos/evidências:** comandos, fixtures, fluxo manual ou prova equivalente.
   Para entrega não técnica, use cenário verificável com condição, ação, resultado e evidência.
   Confirme que todos os critérios de aceite possuem prova correspondente.
6. Escreva `05_execucao/specs/fase-N/spec-*.md` e atualize as colunas de fase, requisito, SPEC,
   aceite e prova em `05_execucao/matriz-specs-fases.md`. Deixe `## Tasks vinculadas` vazio até
   `/adapta:gerar-tasks`. Confirme "Fora desta fase" no arquivo da fase.
7. Para emendas aprovadas, use `references/template-microspec.md` e registre em `## Emendas` da
   SPEC mãe. A task correspondente será criada depois por `gerar-tasks`.
8. Rode o painel `gerar-specs`. O revisor de risco é obrigatório quando houver credenciais,
   dados pessoais, input externo, API, banco, autenticação, publicação ou ação irreversível.
9. Corrija achados seguros; mudanças de intenção voltam ao consultor. Atualize índice, STATUS e
   changelog.
10. Pare e informe o próximo passo obrigatório: `/adapta:gerar-tasks`. SPEC define o contrato;
    a skill seguinte decompõe o trabalho sem reescrever esse contrato.

Subagents são read-only e retornam `schemas/revisao-spec.schema.json`; o agente principal é o
único escritor.
