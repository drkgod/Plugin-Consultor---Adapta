# Migração 0.8.0 — layout `Plano — <id>`

## Objetivo

Alinhar o plugin do consultor à árvore atualmente materializada nas pastas de clientes, sem
recriar a estrutura histórica `01_contexto` → `07_resultado`.

## Alterações incompatíveis

- `gerar-proposta` passa a `gerar-escopo`.
- `revisar-proposta` passa a `revisar-escopo`.
- `escopo-final` passa a `escopo-definitivo`.
- `proposta.md` passa a `03-Projeto/01-Escopo.md`.
- PRD, escopo e cinco arquivos de fase deixam de ser outputs paralelos; o consolidado passa a
  `03-Projeto/02-Escopo-Definitivo.md`.
- SPECs e tasks passam a usar `03-Projeto/02-Plano_de_acao/0N.Fase_N/`.
- reuniões passam a `02-Reuniao/<Categoria>/`.
- `check-input.md` foi removido; a qualidade de entrada é verificada por rastreabilidade.

Aliases de nomenclatura estão registrados em `adapta/contracts/compatibility.json` para orientar
migração, mas não recriam as skills antigas.

## Compatibilidade preservada

O repo operacional externo do cliente continua usando `01_projeto`, `02_reunioes`,
`04_fase-atual` e `05_entregas`. Esses caminhos pertencem ao destino do handoff, não ao workspace
do consultor. O validador mantém também padrões legados na denylist para impedir vazamentos.

## Controles internos

Checks posteriores ao input, recibos, memória, debug, evoluções e resultados foram movidos para
`.adapta/`. Essa pasta não faz parte do handoff externo.

## SkillMind e perfil Ethos legado

- `skill-mind` passa a ser a entrada canônica de todos os jobs.
- Cada skill especializada exige `SKILLMIND_ENVELOPE v1`; invocação direta volta ao SkillMind.
- `adapta/MEMORY.md` fornece o índice de skills, comandos, contratos e caminhos para a memória
  persistente do Ethos.
- `contracts/skill-mind.json` descreve rotas e dependências, inclusive a expansão completa da
  análise crítica.
- `.adapta/orquestracao/` guarda o ledger de runs e o relatório de recuperação.
- Todo run concluído exige checkpoint e disposição `captured` ou `not-reusable` para aprendizado.
- Execução de task fica limitada a uma por vez e exige teste humano explícito antes do avanço.

Hooks continuam disponíveis como otimização advisory no Claude, mas não são requisito de correção.
No Ethos, o fallback lê skills/personas inline, executa painéis em série e pode usar cron apenas
para detectar runs interrompidos.

## Descoberta da raiz

Scripts aceitam:

1. a própria pasta `Plano — <id>`; ou
2. a pasta do cliente com exatamente um filho `Plano — <id>` contendo `03-Projeto/`.

Nenhum plano é escolhido quando há ambiguidade.

## Validação

```bash
npm test
npm run validate
node adapta/scripts/build-ethos-memory.mjs --check
python <plugin-creator>/scripts/validate_plugin.py adapta
```

O pacote completo da metodologia deve atualizar seus testes e validadores para os novos nomes
antes de republicar este espelho. Como a mudança altera contrato e nomenclatura do método, a
promoção também exige uma entrada em `04_governanca/decisoes-de-metodo.md` na fonte de verdade.
