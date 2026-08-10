---
name: adapta:plano-consultor
description: Alias legado que inicia a análise crítica e para no checkpoint de autoria humana.
argument-hint: "[contexto opcional ou caminho do handoff]"
disable-model-invocation: true
---

NOTE: Rode a análise crítica e PARE para o consultor preencher `analise-do-consultor.md`.
Depois da autoria humana, o consultor chama `/adapta:escopo-definitivo` separadamente. Se não
houver `03-Projeto/01-Escopo.md`, a própria skill informa o pré-requisito.

/adapta:skill-mind job=analise-critica $ARGUMENTS
