---
name: definir-requisitos
description: Transforma a proposta e as direcoes escolhidas em requisitos de produto claros, com ator, resultado, limites, sinais de sucesso, fluxos, premissas e decisoes pendentes. Use antes da revisao critica quando o significado do escopo ainda precisa ser fechado. Nao use para decidir arquitetura, fases, SPECs ou tasks.
---

# Definir requisitos da proposta

<!-- Reempacota a função de ce-brainstorm para o método Adapta (D6/D23). -->

Esta skill responde: **o que a proposta precisa significar para poder ser revisada e planejada?**

Carregue `../../personas/consultor-adapta.md`, `../../contracts/subagents.json`,
`references/contrato-requisitos.md` e `schemas/revisao-requisitos.schema.json`.

## Bloqueio de entrada

- Exija `check-input.md` aprovado e `04_plano/proposta/proposta.md`.
- Use `04_plano/proposta/direcoes.md` quando existir. A skill também pode trabalhar diretamente
  da proposta quando o espaço de solução já estiver suficientemente delimitado.
- Se uma resposta do consultor for indispensável para definir comportamento, faça uma pergunta
  por vez. Decisão que pode permanecer aberta segue marcada; não invente consenso.

## Processo

1. Classifique a complexidade como **leve**, **padrão** ou **profunda** para dimensionar o
   detalhamento. Complexidade afeta cerimônia, não a qualidade mínima.
2. Separe fatos, inferências, decisões já tomadas e alternativas ainda abertas.
3. Para cada resultado pretendido, defina:
   - ator e situação inicial;
   - resultado e valor observável;
   - entra e fora de escopo;
   - regras de negócio e limites;
   - fluxo principal, variações e estados de falha;
   - sinais de sucesso e evidências;
   - premissas, dependências e responsáveis;
   - 2–3 mecanismos plausíveis quando a escolha ainda estiver aberta.
4. Rode o painel `definir-requisitos`:
   - `analista-de-fluxo` verifica atores, estados, transições, erro e handoffs;
   - `detector-de-pontos-cegos` entra em escopo padrão/profundo ou quando houver território que o
     consultor declarou não dominar.
5. Faça um teste de pressão: requisito sem evidência, comportamento subjetivo, sucesso
   imensurável, fora de escopo ausente e decisão estrutural disfarçada de detalhe voltam para
   correção.
6. Escreva `04_plano/proposta/requisitos.md` com IDs estáveis `RQ-NNN`, incluindo:
   - objetivo e atores;
   - requisitos e critérios de sucesso;
   - fluxos e exceções;
   - limites e fora de escopo;
   - premissas e dependências;
   - decisões tomadas, pendentes e mecanismos candidatos;
   - rastreabilidade para proposta e direções.
7. Atualize `changelog.md` e informe o próximo passo:
   `/adapta:revisar-proposta`.

## Limites

- Não escolhe stack, banco, API, biblioteca, arquivo ou arquitetura.
- Não cria fases, SPECs ou tasks.
- Não transforma pergunta aberta em requisito obrigatório.
- O agente principal é o único escritor; subagents são read-only.
