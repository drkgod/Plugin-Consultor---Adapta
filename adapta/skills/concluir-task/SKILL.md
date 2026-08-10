---
name: concluir-task
description: Verifica uma task executada pelo consultor contra SPEC, critérios, testes, segurança e evidências antes de marcá-la como concluída. Use para trabalho Tier B ou para validar a entrega sincronizada pelo cliente.
---

# Concluir task com evidência

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `concluir-task`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, trate uma única
task e preserve o run até os finalizadores.

Este job é do workspace do consultor e não substitui `adapta-cliente:concluir-task`. Carregue
`../../personas/consultor-adapta.md` e o painel homônimo em `../../contracts/subagents.json`.

## Fluxo

1. Localize a task, sua SPEC, critérios binários, artefatos alterados e evidências declaradas.
2. Reproduza as provas permitidas pela SPEC. Para código: teste-alvo, suíte relacionada,
   lint/typecheck quando disponíveis, diff e scan de segredos. Para entrega manual: roteiro e
   evidência observável.
3. Confira o perímetro da entrega (D17): mudança no diff que nenhum critério de aceite ou TDD da
   SPEC cobre é superfície não verificada — o aceite é teto, não só piso; o padrão é reprovar,
   salvo decisão explícita do consultor. Simplificação ou marca `adapta-divida:` que toque a
   linha vermelha (validação em fronteira de confiança, tratamento de erro contra perda de
   dados, segurança, acessibilidade, LGPD/dados pessoais) reprova automaticamente, sem
   julgamento de mérito.
4. Despache `verificador-de-entrega` em leitura com o contexto mínimo. Valide o retorno contra
   `schemas/verificacao-task.schema.json`.
5. Classifique `aprovada`, `reprovada` ou `bloqueada`. Só `aprovada` pode marcar a task e atualizar
   o percentual da fase.
6. Em reprovação, mantenha aberta e registre falha, reprodução e correção necessária. Em bloqueio,
   registre dono e próxima ação sem contornar gate.
7. Grave recibo em `.adapta/checks/tasks/<id>.json`; atualize a linha correspondente em
   `03-Projeto/02-Plano_de_acao/0N.Fase_N/00-Tasks_Gerais.md` e a checkbox de
   `00.tasks_per_fase/fase_N.md`, além de `STATUS.md` e `changelog.md`.
8. Se houver causa raiz reutilizável, devolva ao finalizador do SkillMind sinal, evidência e causa
   para uma etapa autorizada de `aprendizado-continuo capturar`.

Quando a task foi implementada no Ethos, prova automatizada não substitui o teste do cliente.
Mantenha o run aberto e não avance à próxima task até o aceite humano explícito registrado no
envelope/ledger do SkillMind.

Não execute comandos arbitrários inventados: use comandos declarados na SPEC e inspecione-os antes.
