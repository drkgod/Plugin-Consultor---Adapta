# Contrato de requisitos do escopo base

Um requisito descreve intenção verificável de produto ou processo. Ele define comportamento,
limite e sucesso sem antecipar a implementação.

## Estrutura mínima

Cada `RQ-NNN` contém:

- ator;
- situação ou gatilho;
- resultado esperado;
- valor para o objetivo;
- incluído e fora de escopo;
- regras e restrições;
- fluxo principal e falhas relevantes;
- sinal de sucesso ou critério observável;
- fonte, inferência ou decisão humana;
- dependências e responsável;
- decisão pendente, quando houver.

## Regras

1. Requisito não usa “melhor”, “intuitivo”, “robusto” ou “completo” sem tornar a qualidade
   observável.
2. Mecanismos candidatos não viram decisão de arquitetura.
3. Requisito sem fonte é marcado `[INFERÊNCIA]`.
4. Um requisito pode permanecer aberto, mas precisa declarar quem decide e até quando.
5. O conjunto precisa cobrir caminho principal, vazio/nulo, falha, permissão e recuperação
   sempre que esses estados existirem.
6. Fora de escopo é parte do contrato, não nota opcional.
