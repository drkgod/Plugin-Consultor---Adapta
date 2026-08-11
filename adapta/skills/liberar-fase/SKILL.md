---
name: liberar-fase
description: Fecha a fase atual com evidências, decide evoluções, gera e revalida SPECs e tasks da próxima fase, e prepara sua publicação segura. Use no ritual de transição entre fases; na fase 5, encerra o projeto.
---

# Liberar próxima fase

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `liberar-fase`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
o submodo da etapa e preserve o run até os finalizadores.

Carregue a persona, os contratos em `../../contracts/` e `../../references/runtime-paths.md`. O SkillMind é dono da sequência completa
e executa `sincronizar-cliente`, `concluir-task`, `mapear-evolucoes`, `gerar-specs`, `gerar-tasks`
e `medir-resultado` como etapas separadas. Esta skill não reinvoca dependências: exige seus recibos
no ledger e devolve pendência quando algum estiver ausente.

## Submodo `preparar-transicao`

1. Exija recibo de sincronização em modo leitura e de `concluir-task` aprovada para cada task da
   fase. Falha, bloqueio, task aberta ou prova incompleta mantém o gate fechado.
2. Exija artefato de `mapear-evolucoes` e decisão humana `aceitar`, `rejeitar` ou `adiar` para cada
   item. Não decida pelo consultor.
3. Aplique evoluções aceitas somente às fases futuras. Grave
   `.adapta/evolucoes/delta-fase-N+1.md` com antes/depois e razão; preserve o histórico das
   rejeitadas/adiadas.
4. Calcule o digest do estado exato que será encerrado executando, a partir do diretório desta
   skill, `node ../../scripts/preparar-liberacao-fase.mjs`. Passe o caminho já registrado do clone
   do cliente em `--cliente` e use `--digest-ativo`.
5. Registre `.adapta/checks/check-fase-N.md` com aprovador humano, data e
   `active-sha256=<digest>`. Mudança posterior na fase ativa invalida a aprovação.
6. Se N < 5, encerre este submodo e devolva ao SkillMind a próxima etapa `gerar-specs`. Na
   transição 3→4, cobre as SPECs de loops/agentes/conectores; na transição 4→5, cobre as SPECs de
   validação transversal das fases 1–4. Se N = 5, exija cobertura integral da matriz final e
   devolva a próxima etapa `medir-resultado`; nunca crie fase 6.

## Submodo `selar-liberacao`

Use somente quando N < 5 e os recibos de `gerar-specs` e `gerar-tasks` da fase N+1 estiverem
concluídos.

1. Revalide checklist, aceite, TDD, independência das tasks, matriz e ledger de dívidas. Para a
   fase 5, qualquer entrega das fases 1–4 sem prova ou justificativa mantém o gate fechado.
2. Faça o dry-run determinístico com `../../scripts/preparar-liberacao-fase.mjs`, resolvido a
   partir desta skill. Passe a raiz do plano em `--consultor`, o clone já registrado em
   `--cliente`, a fase atual em `--de`, a seguinte em `--para` e `--dry-run`.
3. Mostre digest, hashes, arquivo da fase e delta. Pare para confirmação explícita.
4. Após confirmação, execute sem `--dry-run`. O plano selado deve falhar se qualquer origem tiver
   mudado; a operação arquiva a fase atual e promove a próxima sem commit ou push.
5. Rode `../../scripts/validar-exportacao-cliente.mjs` com o clone do cliente como primeiro
   argumento. Qualquer hash, vazamento ou estrutura
   inválida mantém a publicação bloqueada.
6. Peça nova confirmação imediatamente antes de push/publicação. Não reutilize a confirmação do
   dry-run.

## Submodo `encerrar-projeto`

Use somente na fase 5, depois da validação transversal das fases 1–4 e do recibo de
`medir-resultado`. Registre o fechamento, resultados, riscos residuais e recomendação de próximo
ciclo fora do escopo atual. Não invente fase 6 nem publique comparação/case sem confirmação.

## Fechamento do submodo

Atualize `STATUS.md`, índice e `changelog.md`, marque a etapa correspondente no ledger e devolva ao
SkillMind. O SkillMind faz checkpoint e a triagem de aprendizado no fechamento global. Falha de
subagente, TDD, validação, privacidade ou sincronização mantém o gate fechado.
