---
name: debugar
description: Diagnostica causa raiz de falhas técnicas, TDD de SPEC, artefatos e agentes pelo ciclo ce-debug adaptado: reproduzir, traçar cadeia causal, testar hipóteses, corrigir contra a SPEC quando autorizado, verificar e relatar.
---

# Debugar entrega ou agente

<!-- Reempacota ce-debug e o workflow local de introspecção de agentes; não depende do plugin externo em runtime. -->

Carregue `../../personas/consultor-adapta.md`. Escolha `debug-entrega` para código, script,
sincronização ou artefato; escolha `debug-agente` para loop, contexto errado, output inválido ou
falha de subagent.

## Ciclo

1. **Triar e reproduzir:** extraia sintoma, esperado, ambiente, fase, gates, última mudança e
   tentativas anteriores. Reproduza antes de teorizar; redija segredos e dados pessoais.
2. **Traçar o caminho causal:** caminhe do sintoma para trás até o primeiro ponto em que o estado
   válido se torna inválido. Observe valores reais em fronteiras; código “suspeito” não é prova.
3. **Testar hipóteses:** formule no máximo três, ordenadas por evidência. Para cada elo incerto,
   declare uma previsão observável e execute um teste discriminante por vez. Previsão errada com
   “fix que funciona” indica remendo de sintoma, não causa raiz.
4. **Gate de causa raiz:** não proponha correção até explicar a cadeia completa, sem “de algum
   modo”. Se 2–3 hipóteses falharem, diagnostique o bloqueio; não repita variações da mesma ideia.
5. **Escolher ação:** diagnóstico é o padrão. Só corrija quando o pedido já autorizar a mudança ou
   após confirmação do consultor. Problema de responsabilidade/requisito vai para
   `analise-critica` (antes dos gates) ou `mapear-evolucoes` (durante execução), não recebe patch.
6. **Corrigir contra a SPEC e seu TDD:** registre o critério de aceite, etapa RED/GREEN/REGRESSÃO
   ou cenário observável que falhou, aplique a menor correção da causa e rode a verificação ampla
   prevista na SPEC. Se o TDD da SPEC estiver errado ou incompleto, registre dúvida/evolução em vez
   de adaptar o código para caber numa prova ruim. Mudança de escopo, método, credencial ou ação
   remota continua exigindo decisão humana.
7. **Verificar:** reexecute a reprodução, os testes relacionados, regressão e leia o diff final.
8. **Relatar:** grave `05_execucao/debug/debug-<data>-<slug>.md` com cadeia causal, evidência,
   correção, verificação, risco residual e rollback; atualize changelog/STATUS.
9. Se a causa for reutilizável, chame `aprendizado-continuo capturar`. Para falha de agente,
   acrescente captura de prompt/contexto, classificação da falha e recuperação contida sem gravar
   transcript ou segredo na memória.

Nunca “conserte” um gate, teste ou evidência removendo a verificação que revelou o problema.
