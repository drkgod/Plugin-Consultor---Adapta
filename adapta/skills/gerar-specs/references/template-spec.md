# SPEC-[FASE]-[NNN] — [nome da entrega]

**Fase:** [1–5]  
**Status:** planejada | em andamento | aceita | bloqueada  
**Dono:** [nome/papel]  
**Origem no escopo:** [ID da decisão/requisito/fase]
**Degrau da solução:** [reuso | nativo da plataforma | dependência existente | construção mínima] — [justificativa em 1 linha]

## Contexto e decisões fechadas

- **Estado atual:** [o que existe hoje, com fonte]
- **Estado desejado:** [o que muda ao aceitar esta SPEC]
- **Decisões já fechadas:** [arquitetura, ferramenta, regra ou padrão que o executor não decide]
- **Bloqueios:** [nenhum | dado/decisão que impede executar]

## Resultado observável

[O que passa a existir ou ser possível demonstrar. Na fase 1, descreva o valor palpável para o
cliente.]

## Limites e dependências

- **Inclui:**
- **Fora de escopo:**
- **Entradas e pré-condições:**
- **Saídas/artefatos:**
- **Dependências e responsáveis:**
- **Atores e permissões mínimas:**
- **Superfícies/arquivos/configurações afetadas:**
- **Risco e plano B:**
- **Rollback ou reversão:**

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| [quando aplicável] | | | | | |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-[nn] | | | | |

## Fluxo e regras

1. [passo observável]
2. [passo observável]

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | | | |
| Limite | | | |
| Falha | | | |

## Instruções de execução para o Ethos

1. **Ler antes de alterar:** [arquivos, artefatos e seções exatas]
2. **Alterar somente:** [recorte autorizado]
3. **Não alterar:** [limites e áreas protegidas]
4. **Executar nesta ordem:** [sequência determinística]
5. **Parar e pedir validação quando:** [gate, acesso, ambiguidade ou ação externa]
6. **Estado válido ao parar:** [o que deve continuar funcionando]

## Checklist de execução

- [ ] [pré-condição conferida]
- [ ] [atividade ou configuração concluída]
- [ ] [caminhos principal, limite e falha exercitados]
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

## Handoff e operação

- **Como demonstrar:** [roteiro curto]
- **Como operar depois:** [responsável e rotina]
- **Como monitorar:** [sinal, alerta ou revisão]
- **Pendência conhecida:** [nenhuma ou dívida explicitamente registrada]

## Tasks vinculadas

| ID | Task | Dono | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições | Status |
|---|---|---|---|---|---|---|---|---|
| [N.1] | | | | | [ex.: RED 1 e 3 passam] | | | ☐ |

## Emendas

<!-- Append-only (D19): mudanças aprovadas depois da geração. A história não é reescrita. -->

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
