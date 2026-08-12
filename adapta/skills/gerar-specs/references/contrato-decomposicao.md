# Contrato de decomposição — plano → fases → SPECs

<!-- Fundamentos: independência testável por história (github/spec-kit), INVEST (Bill Wake),
vertical slicing / Elephant Carpaccio (Alistair Cockburn). Reempacotado para o método (D6).
Decisões D19/D20. -->

Regras de corte que `gerar-specs` aplica e o painel de revisão cobra. Não fixam quantidade;
fixam invariantes. O corte SPEC → tasks pertence a
`../../gerar-tasks/references/contrato-tasks.md` (D23).

## Plano → fases

- Cada fase fecha um incremento **observável do processo crítico** — fatia vertical, nunca
  camada técnica ("fase de banco" é anti-padrão; fase só de fundação é proibida, D15).
- Toda fase em `02-Escopo-Definitivo.md` tem a seção **"Fora desta fase"**: o que não construir agora, com motivo
  curto ("fase futura" / "fora do programa"). Declarar o out-of-scope protege o champion de
  improvisar.
- Fases 1–5 são incrementos dos sistemas. As fases 4 e 5 acrescentam loops/agentes/conectores que
  operam esses incrementos; a fase 5 também valida transversalmente as fases 1–5. Esses acréscimos
  não criam fases adicionais, não removem os gates existentes e não substituem a entrega de sistema.

## Fase → SPECs

Uma SPEC é a menor unidade com **resultado observável próprio**. Cortes:

1. Dois resultados demonstráveis distintos → duas SPECs.
2. Validadores diferentes (metade técnica, metade processo manual) → separar.
3. A e B só demonstráveis juntos → uma SPEC só.
4. Mudança de **dado, permissão ou integração** → SPEC própria, sempre.
5. **Mesma SPEC vs. nova:** especificação que não muda o resultado observável nem adiciona
   critério de aceite é detalhe da SPEC existente; resultado ou critério novo é SPEC nova.
6. Ancoragem: 3–7 SPECs por fase é o range saudável — fora disso, suspeite do corte da fase.
7. Nas fases 4 e 5, separe as SPECs de sistema das SPECs de loop; loops com metas diferentes têm
   SPECs distintas. Na fase 5, corte também as SPECs de validação por superfície de risco sem deixar
   entrega anterior órfã.

## Degrau da solução (D18/D20)

Toda SPEC declara o degrau escolhido — reuso do que existe no repo | recurso nativo da
plataforma | dependência já instalada | construção mínima — com justificativa de uma linha.
A decisão de arquitetura desce pronta para o agente do cliente; ele não escala a escada sozinho.
O degrau opera **dentro** do que a Adapta constrói: reusar componente ou ferramenta que o
cliente já tem é diferente de substituir a entrega por produto de prateleira.

## Mudança durante a execução (D19)

- **Bug dentro do aceite:** mesma SPEC, mesmo TDD, re-verificação. A SPEC não muda.
- **Mudança além do aceite:** sinal → consultor decide **emenda** (micro-spec + entrada na seção
  `## Emendas` da SPEC — `template-microspec.md`) ou **SPEC nova**
  (quando cria resultado observável novo, corte 5 acima).
- **Micro-spec basta** quando as três valem: (a) não toca dado, permissão, integração nem fluxo
  principal; (b) cabe em uma task; (c) não cria resultado observável novo. Falhou qualquer uma
  → SPEC completa. Gate proporcional: micro-spec passa só pelo `analista-de-specs` em tier
  econômico, ou direto pelo consultor — sem painel completo.
- A task da emenda é criada depois por `/adapta:gerar-tasks`.
- O cliente nunca escreve na SPEC — ele dispara sinais; a emenda é autoria do consultor.
