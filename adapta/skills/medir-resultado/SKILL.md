---
name: medir-resultado
description: Fecha o projeto medindo o antes/depois - analisa os vídeos regravados (05a-2), compara com o baseline (prompt 05b), gera comparacao.md com as 3 camadas de resultado e prepara a entrevista de case. Use ao fim da fase 5, quando chegarem os vídeos "depois", ou quando o usuário pedir "medir o resultado" / "comparar antes e depois" / "fechar o projeto".
---

# Medir Resultado (antes/depois + case)

## Bloqueio de entrada

- `check-fase-5.md` existe? Se não → o projeto não terminou; feche a fase 5 primeiro.
- Existem vídeos em `07_resultado/videos_depois/`? Se não → peça ao CS para solicitar a
  regravação com o **mesmo roteiro** (`04`) e os **mesmos processos** do discovery. Sem
  regravação não há medição — **não estime resultado sem evidência**.

## Passos

1. **Receba do sistema a análise dos vídeos "depois"** em `07_resultado/analises/`, com métricas
   no mesmo formato do baseline. Se o artefato não veio, não estime: solicite novo processamento.
2. **Monte os inputs** do prompt `02_prompts/05b-prompt-comparacao.md` (metodologia):
   `<baseline>` ← `03_discovery/baseline.md` (congelado) · `<raio_x_depois>` ← passo 1 ·
   `<plano>` ← `04_plano/PRD.md` + `escopo.md` · `<contexto_financeiro>` ← seção do baseline.
3. **Execute e salve** em `07_resultado/comparacao.md`. Honestidade em dobro: números
   conservadores, contas explícitas, métrica que piorou reportada.
4. **Prepare o case:** `07_resultado/case.md` a partir do template `14`, preenchendo o que vem
   da comparação e marcando o roteiro de perguntas da camada 3 (percepção). A entrevista
   acontece **depois** da comparação.
5. **Atualize** `STATUS.md` e `changelog.md`. O resumo executivo do `comparacao.md` é o
   material da reunião de entrega.
6. **Meça o custo do método:** rode
   `node <metodologia>/plugins/adapta/scripts/relatorio-metodo.mjs --workspace <workspace-consultor> --out <workspace-consultor>/07_resultado/custo-do-metodo.md`.
   O script lê os recibos `05_execucao/checks/tasks/*.json` e `05_execucao/dividas.md`, sem
   estimar horas ou tokens. Preencha manualmente as lacunas e compare qualquer ganho contra um
   baseline explícito.
7. **Feche o ciclo de conhecimento:**
   - `/adapta:aprendizado-continuo capturar`: aprendizados do projeto, anonimizados;
   - caso bem-sucedido → candidato ao golden set (`02_prompts/golden-set/`) e à biblioteca
     de cases;
   - via `/adapta:sincronizar-cliente`, publique no repo do cliente a versão dele do resultado
     (comparação em linguagem de cliente + case) — é o material da renovação.
