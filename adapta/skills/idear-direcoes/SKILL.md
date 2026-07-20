---
name: idear-direcoes
description: Gera e avalia direcoes fundamentadas para uma proposta antes de definir requisitos. Use quando houver mais de um caminho plausivel, quando a proposta parecer estreita ou generica, ou quando o consultor pedir alternativas. Nao use para detalhar requisitos, fases, SPECs ou tasks.
---

# Idear direções fundamentadas

<!-- Reempacota a função de ce-ideate para o método Adapta (D6/D23). -->

Esta skill responde: **quais direções valem explorar?** Ela produz opções fundamentadas, não
requisitos nem plano de implementação.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/subagents.json`,
`../../contracts/model-routing.json`, `references/contrato-ideacao.md` e
`schemas/avaliacao-ideias.schema.json`.

## Bloqueio de entrada

- Exija `05_execucao/checks/check-input.md` aprovado.
- Exija `04_plano/proposta/proposta.md`.
- Se `04_plano/proposta/direcoes.md` já existir, atualize somente quando o input mudou ou quando
  o consultor pediu nova rodada. Preserve decisões anteriores e registre o motivo da revisão.

## Processo

1. **Grounding antes de gerar:** leia proposta, folha de rosto, bloqueadores, raios-X, baseline,
   materiais citados e precedentes estruturados relevantes. Passe caminhos aos subagents; não
   replique documentos grandes no prompt.
2. **Decomponha o problema em 3–5 eixos** derivados das fontes. Eixos genéricos que não mudam a
   busca são proibidos.
3. **Gere muitas candidatas:** no mínimo três por eixo, variando mecanismo, sequência, recorte,
   reuso, redução de risco e maior valor. Inclua ao menos uma inversão ou alternativa que reduza
   substancialmente a complexidade.
4. **Rode o painel `idear-direcoes`:**
   - `minerador-de-contexto` confirma evidências, restrições e oportunidades;
   - `critico-de-ideias` tenta eliminar ideias genéricas, duplicadas, frágeis ou caras;
   - `pesquisador-de-precedentes` entra quando houver acervo/repo acessível ou quando a direção
     depender de prática externa já conhecida.
5. **Critique todas as candidatas antes de ranquear.** Registre rejeição explícita para ideias
   sem evidência, fora do objetivo, com manutenção desproporcional, dependentes de acesso não
   confirmado ou equivalentes a outra opção.
6. **Verifique a base das sobreviventes:** cada direção precisa citar fonte, declarar hipótese,
   ganho, custo, risco, reversibilidade e o que precisaria ser confirmado.
7. **Escreva `04_plano/proposta/direcoes.md`:**
   - contexto e eixos lidos;
   - candidatas consideradas;
   - 3–5 direções sobreviventes, ranqueadas;
   - ideias rejeitadas e motivo;
   - incertezas e decisões humanas;
   - recomendação de quais direções seguem para `definir-requisitos`.
8. Atualize `changelog.md` e informe o próximo passo:
   `/adapta:definir-requisitos`.

## Limites

- Não cria requisito final, fase, arquitetura, SPEC ou task.
- Não transforma preferência do agente em decisão do consultor.
- Não usa pesquisa ou precedente como autoridade maior que a evidência do cliente.
- O agente principal é o único escritor; subagents são read-only.
