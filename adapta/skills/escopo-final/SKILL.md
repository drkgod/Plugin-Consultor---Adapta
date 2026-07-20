---
name: escopo-final
description: Consolida sistema, análise crítica e autoria humana em PRD, escopo, rastreabilidade e exatamente cinco fases, e executa a revisão documental multipersona inspirada em ce-doc-review antes dos gates.
---

# Escopo final em cinco fases

Carregue `../../personas/consultor-adapta.md` e siga o contrato
`../../contracts/consultor-workflows.json`. Geração e revisão documental são um único job; não há
`plano-final`, `revisar-plano` ou `detalhar-fase` intermediários.

<!-- Consolida o padrão ce-doc-review: classificação do documento, lentes condicionais, correções seguras e decisões humanas separadas. -->

## Gate de entrada

Exija `proposta.md`, `analise-critica.md` e `analise-do-consultor.md`. Se houver decisão humana
obrigatória sem resposta, pare, liste os IDs pendentes e não componha o escopo final.

## Fluxo

1. Monte uma matriz `fonte/achado/apontamento → decisão → requisito → fase`.
2. Resolva contradições respeitando a decisão explícita do consultor; não preencha silêncio.
3. Escreva `04_plano/PRD.md`, `04_plano/escopo.md`,
   `04_plano/matriz-de-rastreabilidade.md` e exatamente cinco arquivos
   `04_plano/fases/fase-1.md` a `fase-5.md`.
4. Preserve objetivo mensurável, fora de escopo, riscos, contornos de bloqueadores, sequência ASA,
   demonstração visível, checklist e critério de aceite por fase. A fase 1 deve ter uma entrega
   palpável; as fases 2–5 ficam completas o suficiente para receber suas SPECs sem decisão
   estrutural improvisada.
5. Classifique o conjunto como documento de requisitos e execute a revisão inspirada em
   `ce-doc-review`, conforme `../../contracts/subagents.json`:
   - sempre: coerência e viabilidade;
   - quando houver excesso ou prioridades concorrentes: guardião de escopo;
   - quando houver premissa desafiável, alternativa não resolvida ou decisão estrutural:
     adversarial;
   - quando houver dados sensíveis, autenticação ou integração: lente de risco na revisão das
     SPECs posteriores; aqui registre o requisito e o gate, sem inventar implementação.
6. Deduplicate achados e separe-os em: `safe_auto` (ortografia, referência, inconsistência
   inequívoca), `gated_auto` (correção provável que toca intenção) e `manual` (promessa, escopo,
   métrica, ordem ou decisão do consultor). Aplique apenas `safe_auto`; devolva os demais ao humano.
7. Refaça a matriz de rastreabilidade depois das correções e confirme que toda decisão da análise
   crítica aparece em requisito, fora de escopo, risco ou fase. Se uma decisão pedir “nova fase”,
   recomponha as cinco existentes — dividir/mesclar/reordenar sem criar fase 6.
8. Crie `05_execucao/checks/check-escopo.md` com estado `PENDENTE`; a skill não o aprova.
9. Atualize `STATUS.md`, `00_INDICE.md` e `changelog.md`.

Use `schemas/revisao-escopo.schema.json` para os revisores. Se um revisor falhar, registre cobertura
parcial e faça fallback serial com a mesma persona; nunca omita a falha.
