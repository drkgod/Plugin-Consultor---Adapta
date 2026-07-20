---
name: concluir-task
description: Verifica uma task executada pelo consultor contra SPEC, critérios, testes, segurança e evidências antes de marcá-la como concluída. Use para trabalho Tier B ou para validar a entrega sincronizada pelo cliente.
---

# Concluir task com evidência

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
7. Grave recibo em `05_execucao/checks/tasks/<id>.json`; atualize `STATUS.md` e `changelog.md`.
8. Se houver causa raiz reutilizável, chame `aprendizado-continuo` no modo capturar.

Não execute comandos arbitrários inventados: use comandos declarados na SPEC e inspecione-os antes.

