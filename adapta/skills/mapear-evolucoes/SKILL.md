---
name: mapear-evolucoes
description: Consolida sinais de reunião, task, debug e resultado da fase em evoluções candidatas, classificadas por impacto e destino, sem alterar automaticamente o plano ou o método.
---

# Mapear evoluções do projeto

Carregue `../../personas/consultor-adapta.md`. Este job é do projeto do cliente; promoção para a
metodologia continua sendo responsabilidade de `adapta-metodo:mapear-evolucoes`.

## Fluxo

1. Reúna mudanças observadas desde a última liberação: atas, decisões, tasks reprovadas, debugs,
   métricas, feedback, divergências entre escopo previsto e execução, o ledger de dívidas
   (`05_execucao/dividas.md`) e mudanças órfãs sinalizadas por `sincronizar-cliente` (D17).
2. Despache `minerador-de-evolucoes` em leitura e valide
   `schemas/evolucao.schema.json`. Agrupe duplicatas pela mesma causa raiz.
3. Classifique cada sinal como: `correcao-task`, `ajuste-fase-atual`, `ajuste-fase-futura`,
   `proximo-ciclo` ou `aprendizado-metodo`. Dívida com gatilho atingido tende a `proximo-ciclo`;
   mudança órfã tende a `correcao-task` ou `ajuste-fase-atual` (legitimar ou reverter — nunca
   ignorar).
4. Escreva `05_execucao/evolucoes/evolucoes-fase-N.md` com evidência, impacto, recomendação,
   responsável e opções `aceitar | rejeitar | adiar` ainda sem seleção.
5. O consultor decide. Só `liberar-fase` aplica decisões aceitas e apenas em fases futuras.
6. Candidatos duráveis e anonimizáveis podem seguir para `aprendizado-continuo`; este job não
   edita o pacote da metodologia nem o acervo de aprendizados.
