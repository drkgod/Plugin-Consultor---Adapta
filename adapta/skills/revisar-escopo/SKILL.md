---
name: revisar-escopo
description: Faz revisão multipersona do escopo base e dos requisitos, separando falhas, decisões humanas, alternativas e pontos sólidos. Use antes da análise crítica. Não sintetiza a posição final do consultor nem gera o escopo definitivo.
---

# Revisar escopo base

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `revisar-escopo`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a etapa autorizada e preserve o run até os finalizadores.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/workspace-layout.json`,
`../../contracts/subagents.json`, `../../references/review-calibration.md`,
`../../references/review-panels.md`, `references/persona-catalog.md` e
`schemas/achado-revisao-escopo.schema.json`.

## Entradas

- Obrigatória: `03-Projeto/01-Escopo.md`, com fontes rastreáveis.
- Quando existirem: `direcoes.md`, `requisitos.md`, DMO, reuniões, documentos, mapeamentos e
  precedentes consultados.
- Não exija `check-input.md`, folha de rosto ou raio-X isolado. Se requisitos materialmente
  ambíguos não estiverem definidos, devolva ao SkillMind a etapa `definir-requisitos`.

## Processo

1. Monte um pacote de contexto por caminhos e gere `run_id`.
2. Rode o painel `revisar-escopo`, read-only, com no máximo três membros simultâneos: núcleo de
   plano, adversarial e viabilidade; guardião de escopo e alternativas entram quando aplicável.
3. Cada achado cita evidência, cenário de falha, gravidade calibrada pela rubrica comum, confiança
   e decisão necessária. Cada persona permanece no território da tabela `revisar-escopo`.
4. Deduplicate por consequência real.
5. Escreva `03-Projeto/revisao-do-escopo.md` com cobertura, achados `RV-NNN`, decisões humanas,
   alternativas, riscos residuais e pontos sólidos.
6. Não corrija o escopo silenciosamente. Grounding ou requisito volta à skill proprietária;
   mudança de intenção fica para o consultor.
7. Atualize `changelog.md` e devolva ao SkillMind a síntese `analise-critica`.

Não escreve `analise-do-consultor.md`, não aprova gate e não cria fase, SPEC ou task.
