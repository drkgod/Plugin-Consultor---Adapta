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
9. A task aponta para a subseção exata da SPEC e declara o ponto de parada. Instrução vaga não
   autoriza o executor a completar regra, arquitetura, campo, permissão ou aceite ausente.
10. Task da fase 4 trata uma meta/loop por vez. Task da fase 5 registra a validação e a evidência;
    correção descoberta retorna à SPEC de origem ou a uma emenda aprovada.

## Projeções canônicas

O conjunto de tasks aparece em:

- `0N.Fase_N/00-Tasks_Gerais.md`: tabela operacional completa;
- `00.tasks_per_fase/fase_N.md`: checklist da Jornada com IDs imutáveis;
- `## Tasks vinculadas` da SPEC: visão do contrato;
- `02-Plano_de_acao/matriz-de-rastreabilidade.md`: visão de rastreabilidade.

`00-Tasks_Gerais.md` é a **tabela operacional completa** que será copiada para o cliente. Ela precisa
ter, no mínimo: `ID`, `Task`, `Dono`, `SPEC`, `Critério`, `Recorte da prova`,
`Evidência esperada`, `Pré-condições` e `Status`.

As quatro projeções devem conter os mesmos IDs e status; os detalhes completos de SPEC, dono,
critério, recorte de prova, evidência e pré-condições ficam em `00-Tasks_Gerais.md`, nas SPECs e
na matriz. Não existe `tasks.md` paralelo. O handoff duplica tasks gerais e SPECs sem reescrever.

## Sinais de corte ruim

- task com mais de um dono;
- task que mistura preparação, implementação e validação sem necessidade;
- task cujo aceite repete o resultado inteiro da SPEC;
- cadeia longa entre tasks abertas;
- task sem evidência própria;
- task que altera critério da SPEC;
- task órfã ou SPEC sem tasks, salvo justificativa explícita.
