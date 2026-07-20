---
name: adapta:plano-consultor
description: Alias legado que inicia a análise crítica e para no checkpoint de autoria humana.
argument-hint: "[contexto opcional ou caminho do handoff]"
disable-model-invocation: true
---

NOTE: Rode a análise crítica e PARE para o consultor preencher `analise-do-consultor.md`.
Depois da autoria humana, o consultor chama `/adapta:escopo-final` separadamente. Se não houver
proposta, a própria skill informa o pré-requisito sem atravessar o gate.

/adapta:analise-critica $ARGUMENTS
