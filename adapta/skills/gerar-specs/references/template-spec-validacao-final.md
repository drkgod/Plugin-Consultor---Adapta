# Extensão de SPEC — fase 5, validação transversal

Use o contrato base de SPEC e acrescente este bloco. A fase 5 valida; não cria capacidade nova.

## Cobertura das fases 1–4

| Fase | Sistema/loop/agente | SPEC/critério de origem | Cenário integrado | Evidência anterior | Prova nesta SPEC |
|---|---|---|---|---|---|

Nenhuma entrega das fases 1–4 pode ficar sem linha ou justificativa explícita de não aplicabilidade.

## Matriz de validação ponta a ponta

| ID | Pré-condição | Procedimento exato | Resultado esperado | Evidência | Responsável | Ação se falhar |
|---|---|---|---|---|---|---|
| VF-[nn] | | | | | | |

Cubra, quando aplicável: regressão funcional, integração, permissões, privacidade, integridade de
dados, duplicidade/idempotência, timeout, recuperação, rollback, observabilidade, custo, meta e
veredito dos loops.

## Aceite global

- **Roteiro do champion:** [passos que o cliente executa]
- **Aprovadores:** [papéis]
- **Critério de go-live/encerramento:** [binário]
- **Pendências e riscos residuais:** [lista ou nenhum]
- **Decisão quando houver falha:** corrigir na SPEC de origem | emenda aprovada | não liberar

O TDD desta SPEC inclui uma regressão integrada. Passar testes isolados das fases anteriores não
aprova o conjunto.
