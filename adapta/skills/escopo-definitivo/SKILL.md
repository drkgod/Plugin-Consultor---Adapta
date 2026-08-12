---
name: escopo-definitivo
description: "Consolida o escopo base, a análise crítica e a autoria humana em 03-Projeto/02-Escopo-Definitivo.md, preservando exatamente cinco fases de evolução dos sistemas; nas fases 4 e 5 acrescenta loops e agentes, e na fase 5 também valida o conjunto ponta a ponta."
---

# Escopo definitivo em cinco fases

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `escopo-definitivo`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a consolidação autorizada e preserve o run até os finalizadores.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/workspace-layout.json`,
`../../contracts/consultor-workflows.json`, `../../references/review-calibration.md`,
`../../references/review-panels.md` e `references/contrato-fases-ethos.md`. Geração e revisão
documental são um único job.

## Gate de entrada

Exija `03-Projeto/01-Escopo.md`, `03-Projeto/analise-critica.md` e
`03-Projeto/analise-do-consultor.md`. Se houver decisão humana obrigatória sem resposta, pare e
liste os IDs pendentes. `check-input.md` não existe e não deve ser recriado.

## Fluxo

1. Monte a matriz `fonte/achado → decisão → requisito → fase`.
2. Resolva contradições respeitando a decisão explícita do consultor; não preencha silêncio.
3. Escreva um único `03-Projeto/02-Escopo-Definitivo.md` com resultado de negócio, atores, fluxo,
   capacidades, exatamente cinco fases, fora de escopo, critérios globais, riscos, gates e
   decisões do consultor. Preserve o método existente e acrescente a arquitetura do contrato:
   as fases 1–5 entregam incrementos dos sistemas; as fases 4 e 5 acrescentam, sem substituir
   esses incrementos, loops/agentes/conectores; e a fase 5 também valida transversalmente tudo
   que foi feito nas fases 1–5. O antigo conjunto
   `PRD.md` + `escopo.md` deixa de ser criado.
4. Confirme o scaffold do plano sem sobrescrever conteúdo existente:
   - `03-Projeto/02-Plano_de_acao/00.tasks_per_fase/fase_1.md` a `fase_5.md`;
   - `03-Projeto/02-Plano_de_acao/01.Fase_1/` a `05.Fase_5/`;
   - em cada fase, `00-Tasks_Gerais.md` e `01-SPECs/00-INDICE.md`.
5. Preserve objetivo mensurável, fora de escopo, riscos, sequência ASA, entrega visível,
   checklist e critério de aceite por fase. Para cada fase 1–5, deixe explícitos capacidades do
   sistema, atores, dados, integrações, regras e resultado demonstrável que alimentarão SPECs
   profundas em onda. Para as fases 4 e 5, descreva também loops e agentes candidatos com meta e
   validação, sempre como trilha adicional à entrega dos sistemas. Para a fase 5, declare ainda a
   matriz de validação das fases 1–5. Fases futuras precisam chegar às SPECs sem decisão estrutural
   improvisada.
6. Execute o painel `escopo-definitivo` nos territórios exclusivos do contrato: coerência e
   viabilidade sempre; guardião de escopo e adversarial quando aplicável. Calibre gravidade pela
   rubrica comum, deduplicate em `safe_auto`, `gated_auto` e `manual` e aplique apenas `safe_auto`.
7. Atualize `03-Projeto/02-Plano_de_acao/matriz-de-rastreabilidade.md` e confirme que toda decisão
   aparece em requisito, fora de escopo, risco ou fase. Se surgir “nova fase”, recomponha as cinco.
8. Crie `.adapta/checks/check-escopo.md` como controle interno `PENDENTE`; inclua a conferência de
   sistemas nas fases 1–5, loops/agentes adicionais nas fases 4 e 5 e validação integral na fase 5.
   A skill não aprova o check.
9. Atualize `STATUS.md` e `changelog.md` e devolva ao SkillMind a etapa
   `gerar-setup-ethos`; o pacote de setup é complementar e não faz parte deste arquivo.

Use `schemas/revisao-escopo.schema.json`. Falha de revisor aparece como cobertura parcial e usa
fallback serial; nunca é omitida.
