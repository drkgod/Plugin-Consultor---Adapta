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
