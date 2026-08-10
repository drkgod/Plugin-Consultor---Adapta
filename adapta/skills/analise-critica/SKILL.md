---
name: analise-critica
description: Orquestra, com cerimônia proporcional, ideação fundamentada, definição de requisitos e revisão multipersona do escopo base; sintetiza o resultado e cria o espaço de autoria humana antes do escopo definitivo.
---

# Análise crítica e autoria do consultor

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `analise-critica`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a etapa autorizada e preserve o run até os finalizadores.

Carregue `../../personas/consultor-adapta.md`, `../../contracts/consultor-workflows.json`,
`../../contracts/workspace-layout.json`, `../../contracts/model-routing.json`,
`../../contracts/context-policy.json`, `references/synthesis.md` e
`references/template-analise-do-consultor.md`.

## Entradas

- Exija `03-Projeto/01-Escopo.md`. Se não existir, devolva a etapa como pendente ao SkillMind; ele
  deve executar `gerar-escopo` antes de autorizar novamente esta síntese.
- Não procure nem crie `check-input.md` ou folha de rosto. Confirme a suficiência das fontes por
  rastreabilidade no próprio escopo, nas reuniões e no mapeamento de processos.
- Artefato especializado só pode ser reutilizado se for posterior aos inputs que o alimentam. Se
  estiver obsoleto, regenere pela skill proprietária e registre o motivo.

## Roteamento proporcional

O SkillMind classifica e executa a rota. Nesta etapa, valide os recibos/artefatos da variante no
envelope; não substitua a cadeia por uma leitura superficial nem reinvoque dependências já feitas.

- **Leve:** escopo base claro, um caminho dominante, requisitos observáveis e baixo risco. Exige
  `revisar-escopo` concluído.
- **Padrão:** espaço de solução delimitado, mas comportamento, limites ou sucesso ainda precisam
  ser fechados. Exige `definir-requisitos` e depois `revisar-escopo` concluídos.
- **Profundo:** existem caminhos materialmente diferentes, alto custo de reversão, território
  pouco conhecido ou decisão que muda promessa/recorte. Exige `idear-direcoes`,
  `definir-requisitos` e `revisar-escopo` concluídos.

## Síntese

1. Leia `01-Escopo.md`, `direcoes.md`, `requisitos.md` e `revisao-do-escopo.md` quando aplicáveis,
   além de `00-DMO.md`, reuniões, documentos e mapeamentos citados.
2. Confirme a cadeia `fonte → direção → requisito → achado/decisão`. Item sem ligação explícita
   fica como risco residual, não como fato consolidado.
3. Use o resultado de `aprendizado-continuo consultar` quando o SkillMind tiver executado essa
   etapa condicional. Traga somente precedentes com proveniência; não promova aprendizado aqui.
4. Use o parecer de `conselho-de-decisao` quando a condição da rota tiver disparado. Se o parecer
   necessário estiver ausente, devolva a pendência ao SkillMind em vez de simular o conselho.
5. Consolide em `03-Projeto/analise-critica.md`, seguindo `references/synthesis.md`, com rota,
   achados, decisões, alternativas, riscos residuais e pontos sólidos.
6. Crie `03-Projeto/analise-do-consultor.md` a partir do template, sem responder pelo humano.
7. Atualize `STATUS.md` e `changelog.md`. O consultor preenche sua análise e então roda
   `skill-mind job=escopo-definitivo`.

## Limites

- Não preenche `analise-do-consultor.md` nem corrige intenção em nome do humano.
- Não aprova gate e não escreve fase ou task.
- O escopo definitivo recompõe exatamente cinco fases; nunca nasce uma fase 6.
