---
name: adapta:skill-mind
description: Entrada canônica que interpreta o pedido e executa a cadeia correta de skills do consultor.
argument-hint: "[pedido, job, fase ou contexto]"
disable-model-invocation: true
---

Use `skills/skill-mind/SKILL.md` como entrada obrigatória. Preserve o pedido original em
`$ARGUMENTS`, resolva a rota pelo contrato `contracts/skill-mind.json` e não encerre antes dos
finalizadores de estado e aprendizado.
