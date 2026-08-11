---
name: escopo-definitivo
description: "Consolida o escopo base, a análise crítica e a autoria humana em 03-Projeto/02-Escopo-Definitivo.md, preservando exatamente cinco fases: sistemas nas fases 1–3, loops e agentes na fase 4 e validação ponta a ponta na fase 5, com revisão documental multipersona antes dos gates."
---

# Escopo definitivo em cinco fases

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `escopo-definitivo`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a consolidação autorizada e preserve o run até os finalizadores.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/workspace-layout.json` e
`../../contracts/consultor-workflows.json` e `references/contrato-fases-ethos.md`. Geração e
revisão documental são um único job.

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
   fases 1–3 entregam os sistemas, fase 4 operacionaliza loops/agentes/conectores sobre essas
   entregas e fase 5 valida transversalmente tudo que foi feito nas fases 1–4. O antigo conjunto
   `PRD.md` + `escopo.md` deixa de ser criado.
4. Confirme o scaffold do plano sem sobrescrever conteúdo existente:
   - `03-Projeto/02-Plano_de_acao/00.tasks_per_fase/fase_1.md` a `fase_5.md`;
   - `03-Projeto/02-Plano_de_acao/01.Fase_1/` a `05.Fase_5/`;
   - em cada fase, `00-Tasks_Gerais.md` e `01-SPECs/00-INDICE.md`.
5. Preserve objetivo mensurável, fora de escopo, riscos, sequência ASA, entrega visível,
   checklist e critério de aceite por fase. Para cada fase 1–3, deixe explícitos capacidades do
   sistema, atores, dados, integrações, regras e resultado demonstrável que alimentarão SPECs
   profundas em onda. Para a fase 4, descreva loops e agentes candidatos com meta e validação. Para
   a fase 5, declare a matriz de validação das fases 1–4. Fases futuras precisam chegar às SPECs
   sem decisão estrutural improvisada.
6. Execute o painel `escopo-definitivo`: coerência e viabilidade sempre; guardião de escopo,
   adversarial e risco quando aplicável. Deduplicate em `safe_auto`, `gated_auto` e `manual`;
   aplique apenas `safe_auto`.
7. Atualize `03-Projeto/02-Plano_de_acao/matriz-de-rastreabilidade.md` e confirme que toda decisão
   aparece em requisito, fora de escopo, risco ou fase. Se surgir “nova fase”, recomponha as cinco.
8. Crie `.adapta/checks/check-escopo.md` como controle interno `PENDENTE`; inclua a conferência da
   arquitetura 1–3 sistemas, 4 loops/agentes e 5 validação integral. A skill não aprova o check.
9. Atualize `STATUS.md` e `changelog.md` e devolva ao SkillMind a etapa
   `gerar-setup-ethos`; o pacote de setup é complementar e não faz parte deste arquivo.

Use `schemas/revisao-escopo.schema.json`. Falha de revisor aparece como cobertura parcial e usa
fallback serial; nunca é omitida.
