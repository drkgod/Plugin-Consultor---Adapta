# SPEC-[FASE]-[NNN] — [nome da entrega]

**Fase:** [1–5]  
**Status:** planejada | em andamento | aceita | bloqueada  
**Dono:** [nome/papel]  
**Origem no escopo:** [ID da decisão/requisito/fase]
**Degrau da solução:** [reuso | nativo da plataforma | dependência existente | construção mínima] — [justificativa em 1 linha]

## Resultado observável

[O que passa a existir ou ser possível demonstrar. Na fase 1, descreva o valor palpável para o
cliente.]

## Limites e dependências

- **Inclui:**
- **Fora de escopo:**
- **Entradas e pré-condições:**
- **Saídas/artefatos:**
- **Dependências e responsáveis:**
- **Risco e plano B:**
- **Rollback ou reversão:**

## Fluxo e regras

1. [passo observável]
2. [passo observável]

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | | | |
| Limite | | | |
| Falha | | | |

## Checklist de execução

- [ ] [pré-condição conferida]
- [ ] [atividade ou configuração concluída]
- [ ] [evidência anexada]
- [ ] [dono e handoff confirmados]

## Critérios de aceite

- [ ] **CA-[fase]-[nn]:** [condição binária demonstrável]
- [ ] **CA-[fase]-[nn]:** [condição binária demonstrável]

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | [teste/cenário que deve falhar antes da entrega] | [comando, fixture ou fluxo] | [falha esperada ligada ao CA] | [onde registrar] |
| GREEN | [menor comportamento que deve passar] | [comando, fixture ou fluxo] | [passa CA principal] | [onde registrar] |
| REFACTOR/REGRESSÃO | [checagem de regressão, borda ou limpeza] | [comando, fixture ou fluxo] | [sem regressão] | [onde registrar] |

**Dados/fixtures:** [entradas realistas, massa mínima, contas de teste ou documento usado]  
**Caminhos de erro obrigatórios:** [falha, vazio, permissão, dado inválido, timeout etc.]  
**Quando não houver código:** use cenário verificável no lugar de teste automatizado, mantendo
RED/GREEN/REGRESSÃO como estados de prova.

**Evidência exigida:** [link/path, captura, log, documento, demonstração ou aceite humano]

## Tasks vinculadas

| ID | Task | Dono | SPEC | Checklist/aceite | Recorte da prova | Status |
|---|---|---|---|---|---|---|
| [N.1] | | | | | [ex.: RED 1 e 3 passam] | ☐ |

## Emendas

<!-- Append-only (D19): mudanças aprovadas depois da geração. A história não é reescrita. -->

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
