---
name: skill-mind
description: Entrada obrigatória e orquestradora de todos os trabalhos do consultor Adapta. Use antes de qualquer skill do plugin, inclusive quando o usuário citar diretamente análise crítica, escopo, SPECs, tasks, debug, reunião, handoff, fase, decisão, contexto ou aprendizado; interpreta a intenção, expande dependências, aplica gates, executa a cadeia completa e fecha o run com checkpoint e triagem de aprendizado. Em runtimes antigos como Ethos/PicoClaw, substitui hooks e chamadas aninhadas por execução explícita e fallback serial.
---

# SkillMind — orquestrador do consultor

Carregue `../../contracts/skill-mind.json`, `../../contracts/consultor-workflows.json`,
`../../contracts/compatibility.json`, `../../contracts/workspace-layout.json`,
`../../contracts/subagents.json`, `../../contracts/context-policy.json` e
`../../personas/consultor-adapta.md`. Se o runtime não tiver hooks ou subagentes, carregue também
`references/ethos-legacy.md`.

## 1. Interpretar antes de executar

1. Preserve o pedido original. Identifique objetivo, job provável, artefatos, fase, ação externa e
   se há execução de código/task.
2. Normalize aliases pelo contrato de compatibilidade. Não escolha uma skill apenas porque o
   usuário pronunciou seu nome: confira o resultado que ele quer e o estado real do plano.
3. Resolva a raiz `Plano — <id>` e valide pré-condições. Faça pergunta somente quando uma decisão
   humana muda materialmente a rota; ausência de artefato com produtor conhecido vira etapa do
   plano, não pergunta.
4. Se houver mais de um job plausível, apresente a leitura em uma frase e escolha o caminho
   reversível. Não execute ação externa por inferência.

## 2. Abrir o run e expandir a cadeia

1. Se houver shell/Node, gere a rota com:
   `node <plugin-root>/scripts/skill-mind-run.mjs plan --job <job> --variant <variante>`.
2. Abra o ledger com `start`; use `--human-test-required` quando o pedido implementar uma task ou
   alterar comportamento que o cliente precisa experimentar.
3. Emita e preserve este envelope em toda delegação:

```text
SKILLMIND_ENVELOPE v1
run_id: <id do ledger>
requested_job: <job normalizado>
authorized_skill: <skill desta etapa>
stage_index: <índice>
runtime_profile: <ethos-legacy|agentic>
```

4. Expanda a variante inteira descrita em `contracts/skill-mind.json`. Para `analise-critica`,
   classifique `leve`, `padrao` ou `profunda` e execute todas as skills listadas antes da síntese.
   Carregar apenas `analise-critica/SKILL.md` não conclui o pedido.

## 3. Executar cada etapa de verdade

- Quando houver invocação nativa de skills, invoque uma etapa por vez com o envelope.
- Quando não houver, leia integralmente o `SKILL.md` autorizado e execute suas instruções inline.
  Leia referências condicionais quando a condição ocorrer.
- Quando subagentes não existirem, execute as mesmas personas em série no agente principal,
  preserve schemas e registre `fallback_serial`; nunca omita o painel.
- Marque a etapa no ledger somente depois de produzir/validar seu artefato. Skill carregada,
  intenção narrada ou plano exibido não equivalem a etapa concluída.
- Pare em gate humano. O SkillMind coordena a decisão, mas não responde pelo consultor, CSM ou
  cliente.

## 4. Disciplina de execução no Ethos

Quando o pedido executar tasks ou código:

1. Selecione somente uma task elegível e leia sua SPEC, critérios e TDD.
2. Implemente apenas esse recorte; não comece a próxima task na mesma resposta.
3. Rode as provas automatizáveis e explique ao cliente o resultado observável esperado.
4. Peça o teste humano. Só avance depois de confirmação explícita equivalente a “testei, pode
   seguir”. Silêncio, ausência de erro relatado ou pedido em lote não aprovam o gate.
5. Se o teste falhar, mantenha a task aberta e roteie para `debugar`; depois repita o mesmo gate.

## 5. Fechar sem perder aprendizado

Antes de declarar o run concluído:

1. Confirme artefatos, evidências, gates e estágio do ledger.
2. Rode `gestao-contexto checkpoint` ou `context-checkpoint.mjs` e atualize o estado versionado
   exigido pela skill executada.
3. Faça triagem obrigatória de aprendizado usando somente artefatos estruturados do run:
   - se houver causa raiz ou orientação reutilizável verificada, execute
     `aprendizado-continuo capturar` e guarde a referência do candidato;
   - se não houver, registre `not-reusable` com motivo concreto;
   - nunca grave prompt, transcript bruto, payload de tool, segredo ou dado pessoal.
4. Feche o ledger com `skill-mind-run.mjs finish`. O script deve recusar conclusão sem disposição
   de aprendizado e, quando aplicável, sem teste humano confirmado.
5. Promoção para acervo compartilhado, push, publicação ou criação de repo continuam exigindo
   confirmação explícita; o fechamento automático nunca concede essa autorização.

## 6. Recuperar runs interrompidos

Use o modo `recover` descrito em `references/ethos-legacy.md`. Retome a partir do último artefato
validado; não repita ação externa e não invente aprendizado para limpar uma pendência.

## Saída mínima

Informe job/variante escolhidos, etapas realmente executadas, artefatos e provas, gate atual,
disposição de aprendizado e próxima ação segura. Se algo falhou, mostre a etapa e o fallback usado.
