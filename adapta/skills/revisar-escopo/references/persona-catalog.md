# Catálogo de personas — revisar-escopo

Esta skill usa prompt assets locais, nao agentes globais como dependencia operacional. Os arquivos
em `plugins/adapta/agents/` continuam como espelho/documentacao do painel.

A divisão completa `Revisa / Não revisa / Encaminha para` é canônica em
`../../../references/review-panels.md`. A gravidade segue `../../../references/review-calibration.md`.

## Núcleo sempre ativo

| Persona | Prompt asset | Foco |
|---|---|---|
| `revisor-de-plano` | `references/personas/revisor-de-plano.md` | Conformidade com o metodo, grounding, objetivo, bloqueadores, ASA, fases |
| `revisor-adversarial` | `references/personas/revisor-adversarial.md` | Premissas, suposicoes, falsificacao e custo de reversao |
| `revisor-viabilidade` | `references/personas/revisor-viabilidade.md` | Realidade tecnica, dependencias, caminhos de erro, prazo, migracao |
## Condicionais

| Persona | Prompt asset | Quando entra |
|---|---|---|
| `guardiao-de-escopo` | `references/personas/guardiao-de-escopo.md` | Excesso, prioridades concorrentes, ciclo apertado ou requisito sem conexão com o objetivo |
| `explorador-de-alternativas` | `references/personas/explorador-de-alternativas.md` | Ausência de alternativas, decisão estrutural aberta ou escopo preso a um mecanismo |

## Protocolo de dispatch

1. Passe para todos o mesmo pacote de contexto: `01-Escopo.md`, DMO, reuniões, documentos,
   mapeamentos e qualquer restrição técnica conhecida.
2. Peça JSON compatível com `schemas/achado-revisao-escopo.schema.json`.
3. Peça que cada achado cite evidência em arquivo/trecho/timestamp. Achado sem evidência vira
   risco residual, nao achado grave.
4. Use no máximo três revisores simultâneos, retry único para output inválido/transiente e fila
   determinística. Capacidade ocupada é backpressure, não falha.
5. Falha persistente vira `status: parcial|falhou` e fallback serial com a mesma persona; nunca
   desaparece da síntese.
6. Cada achado declara confiança `0|25|50|75|100`; confiança alta exige evidência citável.
7. Nenhum revisor escreve arquivos oficiais ou aprova o plano. O agente principal sintetiza e o
   consultor decide.
