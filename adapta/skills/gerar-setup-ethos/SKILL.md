---
name: gerar-setup-ethos
description: "Gera, depois do escopo definitivo, o pacote de configuração do assistente do cliente no Ethos: SOUL.md, IDENTITY.md, USER.md, sugestões justificadas de conectores e automações, mapa de agentes e fichas de loops prontas para configurar. Use ao preparar a primeira call de setup do Ethos, ao atualizar a persona do agente ou quando o escopo alterar os loops e integrações planejados."
---

# Gerar pacote de setup do Ethos

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `gerar-setup-ethos`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, gere apenas os
artefatos locais; instalar conector, criar loop ou alterar o assistente no Ethos é ação posterior.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/workspace-layout.json`,
`../../contracts/consultor-workflows.json`, `references/contrato-setup-ethos.md`,
`references/template-persona-ethos.md` e `references/template-loop-ethos.md`.

## Entradas e gate

Exija `03-Projeto/02-Escopo-Definitivo.md`, `03-Projeto/analise-critica.md` e
`03-Projeto/analise-do-consultor.md` preenchida. Use reuniões e mapeamentos como evidência. Se uma
informação de persona, acesso, métrica ou autonomia não estiver confirmada, marque
`[VALIDAR NA CALL DE SETUP]`; não invente.

## Processo

1. Crie `03-Projeto/03-Setup-Ethos/` sem sobrescrever decisões humanas já registradas.
2. Gere arquivos separados e prontos para colar nos campos do assistente:
   `SOUL.md`, `IDENTITY.md` e `USER.md`. Não crie outro `MEMORY.md`; use a memória distribuída com
   o plugin.
3. Gere `sugestoes-conectores-automacoes.md`. Para cada sugestão, vincule necessidade, fonte no
   escopo, dado acessado, permissão mínima, responsável, uso pelo sistema/loop e alternativa sem o
   conector. Sugestão não significa disponibilidade ou instalação confirmada.
4. Gere `mapa-de-agentes-e-loops.md`, separando o assistente principal dos agentes especializados.
   Cada agente precisa ter missão, entradas, saídas, skills, conectores, limites e relação com as
   fases. Não duplique um agente quando uma skill no assistente principal resolve o trabalho.
5. Para cada loop candidato da fase 4, gere `loops/LOOP-NN-<slug>.md` pelo template. Um loop persegue
   uma única meta mensurável; não use “concluir o projeto” ou “fazer todas as fases” como meta.
6. Gere `00-INDICE.md` com estado `RASCUNHO`, fontes, pendências da call e checklist de configuração.
7. Confira coerência com as fases 1–5: loops usam ou integram entregas das fases 1–3; a fase 5
   valida sistemas, agentes, conectores e loops. Corrija apenas inconsistência segura; mudança de
   intenção volta ao consultor.
8. Atualize `STATUS.md` e `changelog.md` e devolva o pacote para revisão do consultor.

## Limites

- Não preencher segredo, token, credencial, dado pessoal desnecessário ou transcrição bruta.
- Não afirmar que um conector, skill ou automação existe no Ethos sem evidência.
- Não criar loop, conectar conta, instalar skill ou ativar autonomia por inferência.
- Não transformar a fase 4 em nova construção dos sistemas nem a fase 5 em expansão de escopo.
- Persona desconhecida permanece como pendência explícita; nunca vira perfil genérico inventado.

## Pronto quando

O pacote está completo, rastreável ao escopo, sem placeholders ocultos, com pendências visíveis e
com cada loop preenchível nas cinco telas do Ethos: Meta, Validação, Conectores, Skills e Arranque.
