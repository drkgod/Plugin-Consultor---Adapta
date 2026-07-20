---
name: revisar-proposta
description: Faz revisao multipersona da proposta e dos requisitos, separando falhas, decisoes humanas, alternativas e pontos solidos. Use depois de definir requisitos ou diretamente em propostas leves e claras. Nao sintetiza a posicao final do consultor nem gera escopo, fases, SPECs ou tasks.
---

# Revisar proposta

<!-- Reempacota padrões de revisão adversarial do Compound Engineering para o método (D6/D23). -->

Carregue `../../personas/consultor-adapta.md`, `../../contracts/subagents.json`,
`references/persona-catalog.md` e `schemas/achado-revisao-proposta.schema.json`.

## Entradas

- Obrigatórias: `proposta.md`, `check-input.md` aprovado, folha de rosto e raios-X.
- Quando existirem: `direcoes.md`, `requisitos.md`, bloqueadores, baseline, reuniões e
  precedentes consultados.
- Se requisitos materialmente ambíguos não estiverem definidos, pare e recomende
  `/adapta:definir-requisitos`.

## Processo

1. Monte um pacote de contexto por caminhos e gere `run_id`.
2. Rode o painel `revisar-proposta`, read-only, com no máximo três membros simultâneos:
   - sempre: `revisor-de-plano`, `revisor-adversarial`, `revisor-viabilidade`;
   - condicional: `guardiao-de-escopo` quando houver excesso ou prioridade concorrente;
   - condicional: `explorador-de-alternativas` quando a proposta omitir opções ou mantiver
     decisão estrutural aberta.
3. Cada achado cita evidência, cenário de falha, gravidade, confiança e decisão necessária.
   Falha factual, decisão humana e alternativa defensável são categorias diferentes.
4. Deduplicate por consequência real. Dois revisores apontando a mesma falha fortalecem um
   achado; não criam pendências artificiais.
5. Escreva `04_plano/proposta/revisao-da-proposta.md` com:
   - cobertura do painel e eventuais falhas;
   - achados graves e moderados com IDs `RV-NNN`;
   - decisões humanas;
   - alternativas defensáveis;
   - riscos residuais;
   - o que foi verificado e está sólido.
6. Não corrija a proposta silenciosamente. Correção de grounding ou requisito volta à skill
   proprietária; mudanças de intenção ficam para o consultor.
7. Atualize `changelog.md` e informe o próximo passo:
   `/adapta:analise-critica`.

## Limites

- Não escreve `analise-do-consultor.md`.
- Não convoca conselho por conta própria; apenas sinaliza quando há dois ou mais caminhos
  defensáveis.
- Não aprova gate nem cria fase, SPEC ou task.
- O agente principal é o único escritor; subagents escrevem apenas no scratch contratado.
