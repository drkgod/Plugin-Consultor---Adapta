---
name: conselho-de-decisao
description: Lente interna da análise crítica para decisões ambíguas com caminhos defensáveis concorrentes; produz dissenso e recomendação não vinculante ao consultor. Também pode ser invocada explicitamente para um go/no-go, mas não substitui análise crítica nem escopo final.
---

<!-- Reempacotado de ECC (Everything Claude Code, github.com/affaan-m/ECC — skill `council`), traduzido e adaptado ao método Adapta Native (decisão D6). -->

# Conselho de Decisão (4 vozes para decisão ambígua)

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `conselho-de-decisao`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute a lente
autorizada e preserve o run até os finalizadores.

Para quando **existem dois ou mais caminhos defensáveis** e o risco real é ancoragem: a
conversa já pende para um lado e ninguém construiu o desacordo. O valor do conselho não é
unanimidade — é tornar a divergência legível **antes** de decidir.

## Quando NÃO usar

| Em vez do conselho | Use |
|---|---|
| Revisar o escopo base | `skill-mind job=analise-critica` (ele convoca o conselho se necessário) |
| Verificar se uma entrega está pronta | `verificador-de-entrega` (plugin do cliente) |
| Especificar a fase | `skill-mind job=gerar-specs` |
| Decompor SPECs em tasks | `skill-mind job=gerar-tasks` |
| Pergunta factual ou execução óbvia | responda/execute direto |

## As 4 vozes

| Voz | Lente |
|---|---|
| **Arquiteto** (você, no contexto) | correção, manutenibilidade, consequência de longo prazo para o projeto |
| **Cético** | desafia a premissa: a pergunta está certa? existe alternativa mais simples? |
| **Pragmático** | velocidade de entrega, impacto no cliente, realidade operacional dos 4 meses |
| **Crítico** | casos de borda, risco de queda, modos de falha |

## Ritual

1. **Extraia a pergunta real** em uma frase: o que estamos decidindo, quais restrições valem,
   o que conta como sucesso. Pergunta vaga → uma pergunta de esclarecimento antes de convocar.
2. **Reúna só o contexto necessário** (trechos do escopo, restrições, STATUS — compacto).
3. **Escreva a posição do Arquiteto primeiro** — sua posição, as 3 razões mais fortes, o
   principal risco do caminho preferido. Antes de ler as outras vozes, para a síntese não virar
   eco.
4. **Dispare as 3 vozes externas em paralelo** (subagentes), cada uma recebendo **apenas a
   pergunta + o contexto compacto + o papel** — nunca a conversa inteira (é isso que quebra a
   ancoragem). Molde do prompt:

   ```text
   Você é o [PAPEL] num conselho de decisão de 4 vozes.

   Pergunta: [a decisão]
   Contexto: [só os trechos relevantes]

   Responda com:
   1. Posição — 1-2 frases
   2. Razões — 3 bullets concisos
   3. Risco — o maior risco da sua própria recomendação
   4. Surpresa — uma coisa que as outras vozes podem estar deixando passar

   Seja direto. Sem hedging. Menos de 300 palavras.
   ```

5. **Sintetize com guarda-corpos de viés:**
   - não descarte uma voz externa sem explicar por quê;
   - se uma voz mudou sua recomendação, diga isso explicitamente;
   - inclua sempre o dissenso mais forte, mesmo rejeitado;
   - duas vozes alinhadas contra a sua posição inicial = sinal real, não ruído.

## Formato do veredito

```markdown
## Conselho: [título curto da decisão]

**Arquiteto:** [posição em 1-2 frases + 1 linha de porquê]
**Cético:** [idem]
**Pragmático:** [idem]
**Crítico:** [idem]

### Veredito
- **Consenso:** [onde convergem]
- **Dissenso mais forte:** [a divergência que mais importa]
- **Checagem de premissa:** [o Cético desafiou a pergunta em si?]
- **Recomendação:** [o caminho sintetizado — a decisão final é do consultor]
```

## Persistência

Decisão que muda algo real no projeto → devolva ao SkillMind o job `registrar-decisao`.
Decisão que muda **o método** (não só este projeto) → leve para quem mantém o pacote
(`04_governanca/decisoes-de-metodo.md`). Decisão que não muda nada → não persista.
