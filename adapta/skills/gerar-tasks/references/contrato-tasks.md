# Contrato de decomposição — SPEC → tasks

<!-- Fundamentos: independência testável por história (Spec Kit), INVEST e vertical slicing.
Reempacotado para o método Adapta (D6/D20/D23). -->

Task é a menor unidade de trabalho com critério binário, executável por um papel em uma sessão e
capaz de produzir evidência própria.

## Invariantes

1. Toda task aponta para uma única SPEC.
2. Todo critério da task é coberto por um critério ou pelo TDD da SPEC.
3. O recorte da prova nomeia exatamente o cenário, comando ou evidência herdada.
4. A task deixa o projeto em estado válido; não termina em “metade conectada”.
5. Tasks liberadas juntas são independentes. Dependência inevitável exige outra leva.
6. Uma task por SPEC é degenerado, exceto micro-spec que, por definição, cabe em uma task.
7. TDD permanece na SPEC. A task não cria RED/GREEN paralelo.
8. Dono, evidência e status são obrigatórios.

## Projeções canônicas

O conjunto de tasks aparece em:

- tabela `## Tasks` da fase: visão operacional;
- `## Tasks vinculadas` da SPEC: visão do contrato;
- matriz `matriz-specs-fases.md`: visão de rastreabilidade.

A tabela da fase é a **tabela operacional completa** que será copiada para o cliente. Ela precisa
ter, no mínimo: `ID`, `Task`, `Dono`, `SPEC`, `Critério`, `Recorte da prova`,
`Evidência esperada`, `Pré-condições` e `Status`.

As três projeções devem conter os mesmos IDs, SPEC, dono, critério, recorte de prova, evidência,
pré-condições e status. Não existe `tasks.md` paralelo. O handoff do cliente duplica a fase e as
SPECs sem reescrever as tasks.

## Sinais de corte ruim

- task com mais de um dono;
- task que mistura preparação, implementação e validação sem necessidade;
- task cujo aceite repete o resultado inteiro da SPEC;
- cadeia longa entre tasks abertas;
- task sem evidência própria;
- task que altera critério da SPEC;
- task órfã ou SPEC sem tasks, salvo justificativa explícita.
