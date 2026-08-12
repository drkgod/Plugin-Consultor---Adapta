# Calibração canônica de achados

Todos os painéis que emitem `grave`, `moderado` ou `baixo` usam esta rubrica. Gravidade mede o
impacto do problema se ele permanecer; confiança mede a força da evidência. Nunca aumente a
gravidade para compensar confiança baixa.

| Gravidade | Critério obrigatório | Efeito no gate |
|---|---|---|
| `grave` | Há cenário concreto e evidência citável de que o problema torna o resultado inseguro, inválido, não executável ou incapaz de atingir o objetivo; inclui perda/corrupção de dados, violação de privacidade/segurança, capacidade essencial ausente ou falha sem recuperação aceitável. | Bloqueia o gate ou a execução afetada. |
| `moderado` | O resultado ainda pode existir, mas há risco material de comportamento incorreto, retrabalho relevante, ambiguidade executável, degradação mensurável ou dependência sem tratamento. Existe contorno limitado, porém não deve virar comportamento padrão. | Exige correção ou decisão explícita antes da liberação aplicável. |
| `baixo` | Melhoria localizada de clareza, consistência, manutenção ou evidência; não ameaça objetivo, segurança, aceite nem executabilidade e não muda a decisão estrutural. | Não bloqueia; entra como ajuste seguro ou dívida registrada. |

## Regras de uso

1. Todo achado declara consequência, cenário de falha e `sourceRef`. Sem cenário concreto, não é
   `grave`. Sem evidência citável, registre lacuna/risco residual ou reduza a confiança.
2. Quando o impacto ficar entre duas faixas, use a menor e explique qual evidência faria subir.
3. O mesmo defeito não muda de gravidade conforme a persona. O agente principal deduplica por
   consequência e recalibra pela rubrica antes da síntese.
4. Achados duplicados não somam gravidade. Preserve a evidência mais forte e os sourceRefs úteis.
5. `handling`, prioridade, confiança e gravidade são dimensões distintas. Correção fácil pode ser
   grave; correção difícil pode ser baixa.

