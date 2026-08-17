# Migração 0.9.0 — setup do Ethos e loops de valor

Esta versão acrescenta capacidades sem renomear skills ou caminhos existentes.

## O que mudou

- `escopo-definitivo` mantém cinco fases, agora com contrato explícito: fases 1–3 para sistemas,
  fase 4 para loops/agentes/conectores e fase 5 para validação das fases 1–4.
- `gerar-setup-ethos` passa a rodar depois do escopo definitivo e cria
  `03-Projeto/03-Setup-Ethos/`.
- `gerar-specs` usa contratos por tipo de fase e exige detalhamento executável pelo Ethos.
- `gerar-tasks`, `liberar-fase` e `medir-resultado` passam a preservar essa rastreabilidade.

## Compatibilidade

- O layout anterior continua válido; a pasta `03-Setup-Ethos/` é aditiva.
- O fluxo de SPECs em onda, gates humanos, handoff da fase atual e aprendizado permanecem.
- `MEMORY.md` continua sendo instalado manualmente na memória do Ethos; a skill não cria outra
  memória por cliente.

## Correção 0.9.1

- Remove dos comandos os placeholders antigos de raiz do plugin e do pacote da metodologia.
- Resolve scripts a partir do `SKILL.md` carregado por `references/runtime-paths.md`.
- O ETHOS não deve pedir ao consultor o caminho do pacote da metodologia.

## Correção 0.9.2

- Restaura a evolução dos sistemas nas cinco fases, como no fluxo anterior: loops/agentes são
  acréscimos nas fases 4 e 5, e a validação é outro acréscimo da fase 5.
- Fases 4 e 5 exigem ao menos uma SPEC de sistema; SPEC de loop ou validação não satisfaz esse gate.
- Restaura uma rubrica única para `grave`, `moderado` e `baixo`, separada de confiança.
- Define territórios exclusivos para os painéis `definir-requisitos`, `revisar-escopo`,
  `escopo-definitivo`, `gerar-specs` e `gerar-tasks`, inclusive no fallback serial do Ethos.

## Correção 0.9.3

- O `MEMORY.md` passa a exigir sincronização, no mesmo run, dos arquivos criados/alterados pelo MCP
  do Google Drive na pasta ativa do cliente.
- O agente só declara sincronização após confirmação do MCP; falha mantém a tarefa pendente.
- A autorização não inclui excluir, mover, compartilhar, mudar permissões ou escrever fora da pasta.

## Correção 0.9.4

- Remove a exigência do `.adapta/checks/check-cliente.md` do fluxo do plugin do consultor.
- O handoff inicial exige apenas o `check-escopo.md` e seus demais recibos e evidências.
- Atualiza os contratos, skills e testes para validar handoff sem o check-cliente.
- O check-cliente continua proibido na exportação externa, junto com os demais controles internos.
