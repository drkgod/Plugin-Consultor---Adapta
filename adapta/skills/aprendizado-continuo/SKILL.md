---
name: aprendizado-continuo
description: Consulta, captura, reforça, contradiz, promove e evolui aprendizados atômicos do projeto com os padrões ce-compound e ECC continuous-learning-v2 adaptados à privacidade e aos gates do consultor.
---

# Aprendizado contínuo composto

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `aprendizado-continuo`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
o modo autorizado e preserve o run até os finalizadores.

<!-- Reempacota ce-compound (Compound Engineering) e continuous-learning-v2 (ECC). É autossuficiente: os plugins externos não são dependências de runtime. -->

Carregue `../../personas/consultor-adapta.md`, `../../contracts/learning-policy.json`, o painel
`aprendizado-continuo` em `../../contracts/subagents.json` e
`schemas/candidato-aprendizado.schema.json`.

## Modelo mental

- **Sinal:** fato estruturado vindo de task, debug, decisão, evolução, reunião ou resultado.
- **Candidato atômico:** uma condição/gatilho, uma ação recomendada e uma causa raiz. É o
  equivalente local do “instinto” do ECC.
- **Aprendizado durável:** candidato grounded, anonimizado e aprovado, recuperável por outros
  consultores. É o equivalente local da solução composta do CE.
- **Evolução do método:** cluster de aprendizados que pode justificar rule, checklist, skill,
  subagent ou mudança de playbook; nunca é criado ou publicado automaticamente.

Um run trata **um aprendizado por vez**. Não transforme uma sessão inteira em um documento
genérico. Hooks e memória de sessão não são fonte: prompt bruto, transcript, payload de tool e
observação crua nunca entram no acervo.

## Modos

### `consultar`

1. Busque primeiro os candidatos locais e depois o acervo compartilhado configurado no
   `CLAUDE.md`.
2. Traga no máximo três precedentes, com fonte, data, confiança, condição de aplicação e diferença
   para o caso atual. Aprendizado é evidência consultiva, não instrução ativa.
3. Se o acervo não estiver configurado, declare a ausência e prossiga sem bloquear.

### `capturar`

1. Exija problema resolvido ou orientação durável verificável, evidência e causa raiz. Correção
   ainda não comprovada vira sinal, não aprendizado.
2. Para incidente técnico/operacional resolvido, uma ocorrência forte pode gerar candidato. Para
   preferência, comportamento ou workflow, exija três observações coerentes ou correção explícita
   do consultor.
3. Procure sobreposição por `gatilho + causa + ação` antes de escrever:
   - alta: atualize o candidato existente e acrescente evidência;
   - moderada: crie candidato distinto com referência cruzada;
   - baixa: crie normalmente.
4. Em captura simples e inequívoca use modo leve no agente principal. Em sobreposição ambígua,
   promoção, contradição ou risco de privacidade, despache o `curador-de-aprendizado` read-only;
   somente o agente principal escreve.
5. Grave **um** JSON em `.adapta/aprendizados/candidatos/<id>.json`, válido no schema, com
   escopo `projeto`, confiança, ocorrências, evidências e proveniência. Nunca inclua nome de
   cliente, segredo, dado pessoal, transcript ou código proprietário desnecessário.

### `reforcar` ou `contradizer`

Acrescente a nova evidência ao candidato existente. Repetição independente, resultado reproduzido
e concordância entre projetos aumentam confiança; correção humana, falha posterior, evidência
contrária ou longo período sem confirmação reduzem confiança. Registre a razão do ajuste — nunca
altere apenas o número. Contradição substantiva marca `em-revisao` e impede promoção.

Faixas: `0–39` tentativa; `40–69` moderado; `70–89` forte; `90–100` quase certo. Confiança alta
não substitui gate humano nem transforma correlação em causa.

### `revisar`

Revalide fonte, afirmações, aplicabilidade e referências contra o estado atual. Mantenha, atualize,
una, substitua ou marque obsoleto. Se um aprendizado novo contradizer um antigo, preserve o
histórico e aponte o sucessor; não mantenha duas recomendações canônicas conflitantes.

### `promover`

1. Faça grounding mecânico e semântico das afirmações; remova o que não puder ser verificado.
2. Anonimize e mostre o diff completo ao consultor. Só aprovação explícita permite escrever no
   acervo compartilhado; push, PR ou publicação exige confirmação adicional.
3. Workflow/preferência só é candidato à promoção transversal quando aparece em pelo menos dois
   projetos e tem confiança média ≥80. Uma solução singular de alto valor pode ser promovida com
   uma ocorrência verificada, desde que o consultor justifique a generalização.
4. Exporte somente o aprendizado sintetizado. Observações, prompts, transcrições e conteúdo bruto
   do cliente permanecem locais.

### `evoluir`

Agrupe dois ou mais candidatos fortes pelo mesmo gatilho/domínio. Proponha, sem criar sozinho, o
menor destino que reduz recorrência: rule, checklist, skill, subagent, teste ou mudança de
playbook. Encaminhe a proposta e suas evidências a `adapta-metodo:mapear-evolucoes`; mudança no
método continua sujeita a decisão, golden set e release.

## Fechamento

Atualize `changelog.md` apenas quando houver escrita local. Informe modo usado, candidato criado ou
atualizado, sobreposição, confiança antes/depois, grounding, privacidade e próxima decisão humana.
Falha de subagent aparece no relatório e usa fallback serial; nunca é omitida.
