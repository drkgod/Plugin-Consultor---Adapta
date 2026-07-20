---
name: analise-critica
description: Orquestra, com cerimonia proporcional, ideacao fundamentada, definicao de requisitos e revisao multipersona; sintetiza o resultado e cria o espaco de autoria humana antes do escopo final. Use como entrada guiada do fluxo ou depois das skills especializadas.
---

# Análise crítica e autoria do consultor

<!-- Orquestra capacidades reempacotadas de ce-ideate, ce-brainstorm e revisão crítica (D6/D23). -->

Carregue `../../personas/consultor-adapta.md`, `../../contracts/consultor-workflows.json`,
`../../contracts/model-routing.json`, `../../contracts/context-policy.json`,
`references/synthesis.md` e `references/template-analise-do-consultor.md`.

## Bloqueio de entrada

- Existe `04_plano/proposta/proposta.md`? Se não, rode `/adapta:gerar-proposta`.
- Exija `05_execucao/checks/check-input.md` aprovado.
- Artefato especializado existente só pode ser reutilizado se for posterior aos inputs que o
  alimentam. Se estiver obsoleto, regenere pela skill proprietária e registre o motivo.

## Roteamento proporcional

Classifique o caso antes de abrir painéis:

- **Leve:** proposta clara, um caminho dominante, requisitos observáveis e baixo risco. Rode
  `/adapta:revisar-proposta` diretamente.
- **Padrão:** espaço de solução delimitado, mas comportamento, limites ou sucesso ainda precisam
  ser fechados. Rode `/adapta:definir-requisitos` e depois `/adapta:revisar-proposta`.
- **Profundo:** existem caminhos materialmente diferentes, alto custo de reversão, território
  pouco conhecido ou decisão que muda promessa/recorte. Rode `/adapta:idear-direcoes`,
  `/adapta:definir-requisitos` e `/adapta:revisar-proposta`.

O consultor pode chamar qualquer skill especializada isoladamente. `analise-critica` não duplica
seus contratos: ela decide quais são necessárias, confere os handoffs e sintetiza.

## Síntese

1. Leia proposta, `direcoes.md`, `requisitos.md` e `revisao-da-proposta.md` quando aplicáveis,
   além da folha de rosto, bloqueadores e fontes citadas.
2. Confirme a cadeia:
   `fonte → direção → requisito → achado/decisão`. Item sem ligação explícita fica como risco
   residual, não como fato consolidado.
3. Consulte `aprendizado-continuo` quando houver sinal relevante. Traga somente precedentes com
   proveniência; não promova aprendizado nesta skill.
4. Convoque `conselho-de-decisao` somente quando restarem dois ou mais caminhos defensáveis e a
   escolha mudar promessa, recorte, ordem ou valor de uma fase. Passe pergunta, restrições e
   evidências compactas; não passe a posição preferida como fato. Pergunta factual, correção óbvia
   ou simples achado crítico não aciona conselho.
5. Consolide em `04_plano/proposta/analise-critica.md`, seguindo `references/synthesis.md`:
   - rota executada e por que foi leve, padrão ou profunda;
   - achados graves e moderados, com evidência e cenário de falha;
   - decisões humanas e alternativas defensáveis;
   - conselho, quando acionado;
   - aprendizados aplicáveis e riscos residuais;
   - o que foi verificado e está sólido.
6. Crie `04_plano/proposta/analise-do-consultor.md` a partir de
   `references/template-analise-do-consultor.md`, sem responder pelo humano:
   - um bloco para cada ID de achado ou decisão;
   - novas ideias e riscos percebidos pelo consultor;
   - mudanças que ele quer levar ao escopo final;
   - checklist de decisões obrigatórias pendentes.
7. Atualize `changelog.md` e informe o checkpoint: o consultor preenche sua análise; só então
   roda `/adapta:escopo-final`.

## O que esta skill não faz

- Não preenche `analise-do-consultor.md` nem corrige a proposta em nome do humano.
- Não aprova nada; análise crítica não é gate.
- Não transforma as quatro capacidades em cerimônia obrigatória: a rota é proporcional.
- Não escreve `fase-N.md`. `escopo-final` recompõe exatamente cinco fases; nunca nasce uma fase 6.
