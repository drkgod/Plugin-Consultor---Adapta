---
name: definir-requisitos
description: Transforma o escopo base e as direções escolhidas em requisitos claros, com ator, resultado, limites, sinais de sucesso, fluxos, premissas e decisões pendentes. Use antes da revisão quando o significado do escopo ainda precisa ser fechado.
---

# Definir requisitos do escopo

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `definir-requisitos`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a etapa autorizada e preserve o run até os finalizadores.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/workspace-layout.json`,
`../../contracts/subagents.json`, `references/contrato-requisitos.md` e
`schemas/revisao-requisitos.schema.json`.

## Entradas

- Exija `03-Projeto/01-Escopo.md`; `check-input.md` não existe no layout atual.
- Use `03-Projeto/direcoes.md` quando existir. A skill pode partir diretamente do escopo quando o
  espaço de solução já estiver delimitado.
- Decisão indispensável pede uma pergunta por vez; decisão que pode permanecer aberta segue
  marcada, sem consenso inventado.

## Processo

1. Classifique a complexidade como leve, padrão ou profunda.
2. Separe fatos, inferências, decisões já tomadas e alternativas abertas.
3. Para cada resultado, defina ator, valor observável, limites, regras, fluxo, falhas, sinais de
   sucesso, evidências, dependências, responsáveis e mecanismos candidatos.
4. Rode o painel `definir-requisitos` e faça teste de pressão contra subjetividade, ausência de
   evidência e decisão estrutural disfarçada de detalhe.
5. Escreva `03-Projeto/requisitos.md` com IDs `RQ-NNN`, rastreabilidade para `01-Escopo.md` e
   `direcoes.md`, quando houver.
6. Atualize `changelog.md` e devolva ao SkillMind a próxima etapa `revisar-escopo`.

Não escolhe stack, arquitetura, fases, SPECs ou tasks. O agente principal é o único escritor.
