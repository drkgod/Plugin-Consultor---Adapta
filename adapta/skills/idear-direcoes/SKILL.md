---
name: idear-direcoes
description: Gera e avalia direções fundamentadas para o escopo base antes de definir requisitos. Use quando houver mais de um caminho plausível, quando o escopo parecer estreito ou genérico, ou quando o consultor pedir alternativas. Não use para detalhar fases, SPECs ou tasks.
---

# Idear direções fundamentadas

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `idear-direcoes`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a etapa autorizada e preserve o run até os finalizadores.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/workspace-layout.json`,
`../../contracts/subagents.json`, `../../contracts/model-routing.json`,
`references/contrato-ideacao.md` e `schemas/avaliacao-ideias.schema.json`.

## Entradas

- Exija `03-Projeto/01-Escopo.md`; não exija `check-input.md` nem folha de rosto.
- Se `03-Projeto/direcoes.md` já existir, atualize somente quando uma fonte mudou ou o consultor
  pediu nova rodada. Preserve decisões anteriores e registre o motivo.

## Processo

1. Leia o escopo base, DMO, reuniões, documentos, contexto e processos mapeados. Passe caminhos
   aos revisores; não replique documentos grandes no prompt.
2. Decomponha o problema em 3–5 eixos derivados das fontes.
3. Gere no mínimo três candidatas por eixo, variando mecanismo, sequência, recorte, reuso,
   redução de risco e maior valor.
4. Rode o painel `idear-direcoes`: minerador de contexto, crítico de ideias e, quando aplicável,
   pesquisador de precedentes.
5. Registre rejeição explícita para ideias sem evidência, fora do objetivo, caras demais ou
   equivalentes a outra opção.
6. Cada sobrevivente cita fonte, hipótese, ganho, custo, risco, reversibilidade e confirmação
   necessária.
7. Escreva `03-Projeto/direcoes.md` com candidatas, ranking, rejeições, incertezas e recomendação.
8. Atualize `changelog.md` e devolva ao SkillMind a etapa `definir-requisitos`.

Não cria requisito final, fase, arquitetura, SPEC ou task. O agente principal é o único escritor;
revisores trabalham em leitura.
