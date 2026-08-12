# Memória persistente — Adapta no Ethos

Estas são instruções ativas do assistente de codificação durante as cinco fases. Não trate este
arquivo como histórico do cliente e não grave nele prompts, transcrições, segredos ou dados
pessoais.

## Regra zero: entrar pelo SkillMind

Para qualquer pedido relacionado à consultoria, carregue primeiro `skills/skill-mind/SKILL.md`.
Isso vale mesmo quando o usuário invocar ou nomear outra skill diretamente. O SkillMind interpreta
o objetivo, normaliza aliases, verifica o estado do plano, expande dependências e cria o envelope
`SKILLMIND_ENVELOPE v1`. Skill especializada sem esse envelope deve redirecionar ao SkillMind.

Chamar uma skill significa executar seu fluxo completo. Se o Ethos não suportar encadeamento,
leia o `SKILL.md` e suas referências aplicáveis e execute-os inline. Se não houver subagentes,
execute as mesmas personas em série e preserve o schema; nunca omita uma revisão exigida.

## Gates que não podem ser pulados

- Executar no máximo uma task de implementação por vez.
- Rodar as provas da SPEC e pedir teste humano ao fim da task.
- Não iniciar a próxima task até o cliente dizer explicitamente que testou e autorizou o avanço.
- Falha no teste mantém a task aberta e segue para `debugar`.
- Gate de consultor/CSM/cliente e ação externa nunca são inferidos.
- Antes de concluir qualquer run: atualizar estado, criar checkpoint e capturar um aprendizado
  reutilizável ou registrar por que não houve aprendizado reutilizável.
- Preservar as cinco fases: 1–5 constroem sistemas com SPECs profundas; 4 e 5 acrescentam
  loops/agentes sem substituir os sistemas; 5 também valida integralmente as entregas das fases 1–5.
- Se uma SPEC exigir que o Ethos invente arquitetura, regra, dado, permissão ou aceite, parar e
  devolver para `gerar-specs`; não completar a lacuna por suposição.

## Comandos de entrada

- Preferencial: `Use skill-mind: <pedido>`.
- Em runtime com slash command: `/adapta:skill-mind <pedido>`.
- Alias antigo pode ser entendido, mas sempre é normalizado pelo SkillMind.

## Índice de skills

| Skill | Caminho relativo | Responsabilidade |
|---|---|---|
| `skill-mind` | `skills/skill-mind/SKILL.md` | Entrada obrigatória e orquestradora de todos os trabalhos do consultor Adapta. |
| `analise-critica` | `skills/analise-critica/SKILL.md` | Orquestra, com cerimônia proporcional, ideação fundamentada, definição de requisitos e revisão multipersona do escopo base; sintetiza o resultado e... |
| `aprendizado-continuo` | `skills/aprendizado-continuo/SKILL.md` | Consulta, captura, reforça, contradiz, promove e evolui aprendizados atômicos do projeto com os padrões ce-compound e ECC continuous-learning-v2 ad... |
| `concluir-task` | `skills/concluir-task/SKILL.md` | Verifica uma task executada pelo consultor contra SPEC, critérios, testes, segurança e evidências antes de marcá-la como concluída. |
| `conselho-de-decisao` | `skills/conselho-de-decisao/SKILL.md` | Lente interna da análise crítica para decisões ambíguas com caminhos defensáveis concorrentes; produz dissenso e recomendação não vinculante ao con... |
| `debugar` | `skills/debugar/SKILL.md` | Diagnostica causa raiz de falhas técnicas, TDD de SPEC, artefatos e agentes pelo ciclo ce-debug adaptado: reproduzir, traçar cadeia causal, testar ... |
| `definir-requisitos` | `skills/definir-requisitos/SKILL.md` | Transforma o escopo base e as direções escolhidas em requisitos claros, com ator, resultado, limites, sinais de sucesso, fluxos, premissas e decisõ... |
| `escopo-definitivo` | `skills/escopo-definitivo/SKILL.md` | Consolida o escopo base, a análise crítica e a autoria humana em 03-Projeto/02-Escopo-Definitivo.md, preservando exatamente cinco fases de evolução... |
| `gerar-escopo` | `skills/gerar-escopo/SKILL.md` | Gera ou regenera o escopo base em 03-Projeto/01-Escopo.md a partir de reuniões, documentos, DMO e mapeamentos do plano atual. |
| `gerar-pasta-cliente` | `skills/gerar-pasta-cliente/SKILL.md` | Prepara uma pasta operacional externa a partir da pasta atual do plano do cliente, com allowlist, recorte da fase, hashes, privacidade e dry-run; s... |
| `gerar-setup-ethos` | `skills/gerar-setup-ethos/SKILL.md` | Gera, depois do escopo definitivo, o pacote de configuração do assistente do cliente no Ethos: SOUL.md, IDENTITY.md, USER.md, sugestões justificada... |
| `gerar-specs` | `skills/gerar-specs/SKILL.md` | Gera e revisa as SPECs da fase em foco no diretório 0N.Fase_N/01-SPECs, em modo onda e com profundidade executável pelo Ethos: sistemas nas fases 1... |
| `gerar-tasks` | `skills/gerar-tasks/SKILL.md` | Decompõe SPECs detalhadas em tasks independentes, binárias e executáveis uma por vez pelo Ethos; sincroniza 00-Tasks_Gerais.md, a Jornada, as Tasks... |
| `gestao-contexto` | `skills/gestao-contexto/SKILL.md` | Gera brief, checkpoint, recomendação de compactação e restauração segura do contexto do consultor. |
| `idear-direcoes` | `skills/idear-direcoes/SKILL.md` | Gera e avalia direções fundamentadas para o escopo base antes de definir requisitos. |
| `liberar-fase` | `skills/liberar-fase/SKILL.md` | Fecha a fase atual com evidências, decide evoluções, gera e revalida SPECs e tasks da próxima fase, e prepara sua publicação segura. |
| `mapear-evolucoes` | `skills/mapear-evolucoes/SKILL.md` | Consolida sinais de reunião, task, debug e resultado da fase em evoluções candidatas, classificadas por impacto e destino, sem alterar automaticame... |
| `medir-resultado` | `skills/medir-resultado/SKILL.md` | Fecha o projeto medindo o antes/depois com evidências comparáveis, gera a comparação e prepara a entrevista de case. |
| `registrar-decisao` | `skills/registrar-decisao/SKILL.md` | Registra uma decisão estrutural do projeto em 03-Projeto/decisoes-do-projeto.md, com contexto, alternativas rejeitadas e consequências, numerada P1... |
| `revisar-escopo` | `skills/revisar-escopo/SKILL.md` | Faz revisão multipersona do escopo base e dos requisitos, separando falhas, decisões humanas, alternativas e pontos sólidos. |
| `sincronizar-cliente` | `skills/sincronizar-cliente/SKILL.md` | Sincroniza o workspace do consultor com o repositório do cliente, resume o avanço e publica somente o que foi liberado. |
| `tldv` | `skills/tldv/SKILL.md` | Ingere reuniões do tl;dv de forma paginada, limitada, idempotente e segura, depois gera transcrição normalizada, ata, decisões, fluxos e evoluções ... |

## Contratos e caminhos canônicos

- Roteamento/dependências: `contracts/skill-mind.json`.
- Jobs e gates: `contracts/consultor-workflows.json`.
- Layout do cliente: `contracts/workspace-layout.json`.
- Fallback de subagentes: `contracts/subagents.json`.
- Resolução portátil dos scripts: `references/runtime-paths.md`.
- Escopo base: `03-Projeto/01-Escopo.md`.
- Escopo definitivo: `03-Projeto/02-Escopo-Definitivo.md`.
- Setup do agente e dos loops: `03-Projeto/03-Setup-Ethos/`.
- Tasks/SPECs da fase: `03-Projeto/02-Plano_de_acao/0N.Fase_N/`.
- Estado confiável: `STATUS.md`, `changelog.md` e `.adapta/checks/`.
- Ledger do SkillMind: `.adapta/orquestracao/`.
- Checkpoint histórico, não instrução ativa: `.adapta/memory/latest.json`.

## Recuperação sem hooks

Use o cron apenas para detectar runs abandonados e solicitar retomada. Resolva a raiz a partir de
`skills/skill-mind/SKILL.md` conforme `references/runtime-paths.md`, execute
`scripts/skill-mind-run.mjs` em modo `recover`, passe o plano já resolvido como workspace e use
30 minutos com escrita do relatório. Nunca peça ao usuário o caminho do plugin ou da metodologia.

O cron não aprova teste, não promove aprendizado e não publica. Ao encontrar pendência, carregue o
SkillMind e retome do último artefato validado.
