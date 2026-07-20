---
name: liberar-fase
description: Fecha a fase atual com evidências, decide evoluções, gera e revalida SPECs e tasks da próxima fase, e prepara sua publicação segura. Use no ritual de transição entre fases; na fase 5, encerra o projeto.
---

# Liberar próxima fase

Este é o orquestrador da transição. Carregue a persona e os contratos em `../../contracts/`.

## Sequência obrigatória

1. Sincronize o estado do cliente em modo leitura e confira que não há mudança local não tratada.
2. Passe cada task por `concluir-task`; valide critérios binários, demonstração, métrica e check da
   fase. Se qualquer item falhar, não feche nem publique.
3. Rode `mapear-evolucoes` e pare para o consultor decidir cada evolução. Registre o check de
   fechamento somente depois das decisões.
4. Aplique as evoluções aceitas apenas às fases futuras e escreva
   `05_execucao/evolucoes/delta-fase-N+1.md`, com antes/depois e razão.
5. Calcule o digest do estado exato que será encerrado:
   `node <metodologia>/plugins/adapta/scripts/preparar-liberacao-fase.mjs --cliente <repo-cliente> --digest-ativo`.
   Registre o fechamento em `05_execucao/checks/check-fase-N.md` com
   `**O que foi validado:** ... active-sha256=<digest>`. Esse é o check canônico da governança;
   qualquer mudança posterior em `04_fase-atual/` invalida a aprovação. Não crie uma família
   paralela de `check-liberacao-*`.
6. Se N < 5, gere as SPECs da fase N+1 em modo onda (D21): rode `gerar-specs` para a fase N+1,
   alimentado pelas evoluções aceitas e pelo ledger `05_execucao/dividas.md`; revalide
   checklist, aceite e TDD por SPEC. Depois rode `gerar-tasks`, valide independência,
   rastreabilidade e recortes de prova, e só então faça o dry-run determinístico:
   `node <metodologia>/plugins/adapta/scripts/preparar-liberacao-fase.mjs --consultor <workspace> --cliente <repo-cliente> --de <N> --para <N+1> --dry-run`.
   O comando salva `05_execucao/checks/release-plan-fase-N-N+1.json`. Mostre o digest do plano,
   hashes, arquivo da fase atual e delta. Após confirmação, execute sem `--dry-run`; a execução
   consome o plano selado e falha se qualquer origem mudou. O
   script arquiva `04_fase-atual/` em `05_entregas/fase-N/`, grava ali
   `phase-closure-manifest.json` com o digest aprovado, inventário e divergências em relação ao
   manifesto de entrada, e promove a próxima fase de modo atômico. Ele não faz commit nem push.
   Se a evolução alterar o contrato da fase ou mudar a prova esperada, rode `gerar-specs` em modo
   de atualização do conjunto afetado e regenere as tasks afetadas antes do dry-run. Em seguida rode
   `validar-exportacao-cliente.mjs <repo-cliente>`; qualquer hash, vazamento ou estrutura inválida
   mantém a publicação bloqueada.
7. Só após nova confirmação e validação verde publique no repo do cliente.
8. Se N = 5, não invente fase 6: rode `medir-resultado`, registre fechamento e proponha próximo
   ciclo fora do escopo atual.
9. Atualize STATUS, índice e changelog. Capture aprendizado reutilizável sem publicar sozinho.

Falha de subagent, TDD da SPEC, validação, privacidade ou sincronização mantém o gate fechado.
