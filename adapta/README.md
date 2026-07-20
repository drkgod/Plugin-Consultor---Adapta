# Adapta — plugin do consultor

O `adapta` é o plugin operacional do consultor Adapta Native. Ele pega o diagnóstico produzido
pelo sistema e transforma isso em um projeto executável: proposta, análise crítica, escopo em
cinco fases, SPECs com TDD, tasks, handoff seguro para o cliente, execução, medição e aprendizado.

Ele não decide pelo consultor. O plugin prepara, critica, especifica, verifica e registra
evidências. Aprovação de escopo, decisão de negócio, publicação e passagem para cliente continuam
sendo responsabilidade humana.

## Como o plugin é organizado

O plugin tem cinco peças principais:

- `skills/`: os trabalhos públicos do consultor.
- `personas/`: a postura do consultor Adapta.
- `contracts/`: regras de workflow, gates, subagentes, contexto e roteamento.
- `scripts/`: operações determinísticas, como handoff, checkpoint, validação e ingestão.
- `rules/`: invariantes de privacidade, autoria, evidência e fases.

O agente principal é o único escritor dos artefatos oficiais. Subagentes podem revisar por lentes
especializadas, mas trabalham em modo leitura e devolvem achados estruturados.

## Instalação

No Claude Code, instale a partir do marketplace local:

```text
/plugin marketplace add <caminho-para-a-metodologia>/plugins
/plugin install adapta@adapta-native
```

No Codex, o manifesto `.codex-plugin/plugin.json` expõe `skills/` como superfície canônica. Use o
nome da skill, como `analise-critica`, `gerar-specs` ou `gerar-tasks`, ou descreva o trabalho que
quer executar.

Hooks automáticos existem para runtimes que os suportam. Em runtimes sem hooks, use
`gestao-contexto` para gerar brief, checkpoint, compactação e restauração.

## Fluxo principal

```text
Handoff do sistema
       ↓
Gerar ou validar proposta
       ↓
Análise crítica proporcional
       ↓
Análise autoral do consultor
       ↓
Escopo final em 5 fases
       ↓
Validação do Consultor + CSM/cliente
       ↓
SPECs da fase em foco
       ↓
Tasks derivadas das SPECs
       ↓
Handoff seguro da fase atual para o cliente
       ↓
Executar, verificar, medir e mapear evoluções
       ↓
Fechar fase e liberar próxima fase
       ↓
Medir resultado final e consolidar aprendizados
```

Três separações sustentam o fluxo:

1. **Proposta não é escopo aprovado.** A proposta é matéria-prima para análise.
2. **SPEC não é task.** A SPEC define o contrato e a prova; a task é a unidade executável derivada.
3. **Workspace do consultor não é repo do cliente.** O consultor enxerga o projeto completo; o
   cliente recebe apenas a fase liberada.

## Skills principais

| Skill | Quando usar | Saída principal |
|---|---|---|
| `gerar-proposta` | Quando o handoff não trouxe proposta ou os inputs mudaram | `04_plano/proposta/proposta.md` |
| `analise-critica` | Para revisar a proposta e preparar a autoria humana | `analise-critica.md` e `analise-do-consultor.md` |
| `idear-direcoes` | Quando há alternativas reais de caminho | `direcoes.md` |
| `definir-requisitos` | Quando comportamento, limites ou sucesso ainda estão abertos | `requisitos.md` |
| `revisar-proposta` | Para rodar o painel crítico da proposta | `revisao-da-proposta.md` |
| `escopo-final` | Depois da análise autoral do consultor | PRD, escopo, matriz e fases 1 a 5 |
| `gerar-specs` | Depois dos gates de escopo e cliente | SPECs da fase em foco |
| `gerar-tasks` | Depois das SPECs revisadas | Tasks sincronizadas em fase, SPECs e matriz |
| `gerar-pasta-cliente` | Para preparar o repo/pasta do cliente | Handoff da fase atual |
| `sincronizar-cliente` | Para trazer o estado do cliente para o workspace do consultor | Sincronização e relatório |
| `concluir-task` | Para verificar uma entrega contra SPEC, TDD e evidência | Recibo de verificação |
| `debugar` | Para investigar falha de execução, artefato ou agente | Relatório de causa raiz |
| `mapear-evolucoes` | Ao fechar ou revisar uma fase | Evoluções candidatas |
| `liberar-fase` | Para fechar uma fase e promover a próxima | Check da fase, delta e handoff |
| `medir-resultado` | Ao fim do ciclo | Comparativo antes/depois e case |
| `aprendizado-continuo` | Para consultar, capturar ou promover aprendizados | Candidatos e aprendizados aprovados |
| `tldv` | Para organizar reuniões do tl;dv | Transcrição, ata, fluxos e decisões |
| `conselho-de-decisao` | Quando há dois caminhos defensáveis | Recomendação não vinculante |
| `registrar-decisao` | Quando uma decisão estrutural foi tomada | Registro de decisão |
| `gestao-contexto` | Em sessões longas ou antes de fanout/compactação | Brief ou checkpoint |

Em Claude Code, as skills podem aparecer com namespace, como `/adapta:analise-critica`. Em Codex,
use o nome da skill ou descreva a intenção.

## Como funciona a análise crítica

`analise-critica` é um orquestrador proporcional. Ela não força todas as etapas em todo projeto.
Primeiro classifica o caso e escolhe a rota:

- **Leve:** proposta clara, baixo risco e um caminho dominante. Roda `revisar-proposta`.
- **Padrão:** há caminho provável, mas requisitos, limites ou sucesso precisam ser fechados.
  Roda `definir-requisitos` e `revisar-proposta`.
- **Profunda:** existem alternativas materialmente diferentes, alto custo de reversão ou decisão
  que muda promessa, ordem ou valor. Roda `idear-direcoes`, `definir-requisitos` e
  `revisar-proposta`.

### `idear-direcoes`

Gera caminhos possíveis a partir das fontes disponíveis. Cada direção precisa ter evidência,
hipótese de valor, custo, risco e motivo para sobreviver. Ideia genérica, sem fonte ou cara
demais para manter é descartada.

### `definir-requisitos`

Transforma a direção escolhida em comportamento observável:

- ator;
- resultado esperado;
- limites;
- sinais de sucesso;
- premissas;
- fluxo ou mecanismo provável;
- decisões pendentes do consultor.

### `revisar-proposta`

Roda um painel crítico com lentes de método, adversarial, viabilidade, escopo e alternativas. O
resultado não é uma lista solta de opiniões: cada achado precisa ter severidade, confiança,
evidência citável, cenário de falha e recomendação.

### Síntese e autoria humana

Ao final, `analise-critica` consolida:

- `04_plano/proposta/analise-critica.md`: achados, riscos, alternativas e pontos sólidos.
- `04_plano/proposta/analise-do-consultor.md`: espaço para o consultor concordar, discordar,
  acrescentar evidências e tomar decisões.

A IA não preenche a análise autoral. Esse arquivo é o ponto em que o consultor assume a posição
profissional antes de gerar o escopo final.

## Como funciona o escopo final

`escopo-final` só roda depois da análise autoral preenchida. A skill consolida:

- proposta;
- análise crítica;
- decisões do consultor;
- contexto, bloqueadores e discovery.

Ela gera:

- `04_plano/PRD.md`;
- `04_plano/escopo.md`;
- `04_plano/matriz-de-rastreabilidade.md`;
- `04_plano/fases/fase-1.md` a `04_plano/fases/fase-5.md`;
- `05_execucao/checks/check-escopo.md`, inicialmente pendente.

O projeto sempre fica em cinco fases. Se uma decisão pedir mais trabalho, as fases são
recompostas. Não existe fase 6 implícita.

A fase 1 precisa entregar algo palpável e demonstrável. Fundação, levantamento ou preparação sem
resultado visível não satisfazem o método.

## Como funcionam SPECs e tasks

Depois que o escopo é aprovado pelo Consultor e pelo CSM/cliente, o consultor trabalha a fase em
foco.

### `gerar-specs`

`gerar-specs` cria o contrato da entrega. Cada SPEC define:

- resultado observável;
- contexto e limites;
- entradas e saídas;
- fluxo principal;
- caminhos de erro;
- dependências;
- checklist de implementação;
- critérios de aceite binários;
- TDD da SPEC;
- evidências esperadas;
- espaço para tasks vinculadas.

O TDD fica dentro da SPEC. Para software, ele descreve RED, GREEN, regressão, comandos e fixtures.
Para entrega não técnica, ele vira um cenário verificável com condição, ação, resultado esperado e
evidência objetiva.

`gerar-specs` não escreve tasks. Se uma task exigir mudar resultado, limite, critério ou prova, a
SPEC precisa ser revisada primeiro.

### `gerar-tasks`

`gerar-tasks` transforma SPECs revisadas em unidades executáveis. Cada task precisa ter:

- ID estável;
- dono;
- SPEC de origem;
- ação concreta;
- critério binário;
- recorte da prova;
- evidência esperada;
- pré-condições;
- status.

O mesmo conjunto de tasks é sincronizado em três lugares:

- `## Tasks` da fase;
- `## Tasks vinculadas` de cada SPEC;
- `05_execucao/matriz-specs-fases.md`.

Não existe lista paralela de tasks. A matriz é a fonte de rastreabilidade.

## Handoff para o cliente

`gerar-pasta-cliente` prepara apenas o que o cliente deve receber:

- fase atual;
- SPECs da fase atual;
- tasks liberadas;
- documentação operacional necessária;
- manifesto de handoff com hashes.

Não atravessam para o cliente:

- proposta bruta;
- análise crítica;
- análise do consultor;
- bloqueadores internos;
- folha de rosto;
- fases futuras;
- materiais privados da consultoria;
- arquivos da metodologia.

O handoff roda primeiro em dry-run. Criar repo remoto, publicar, fazer push ou convidar usuário
exige confirmação explícita no momento da ação.

## Execução e verificação

Durante a fase, o consultor usa:

- `sincronizar-cliente` para atualizar o estado;
- `concluir-task` para verificar entrega;
- `debugar` para investigar falhas;
- `tldv` para organizar reuniões;
- `mapear-evolucoes` para capturar mudanças candidatas.

`concluir-task` não aceita “parece pronto”. A entrega precisa passar pelos critérios da SPEC, pelo
TDD ou cenário verificável e pelas evidências esperadas. Uma task pode ficar:

- `aprovada`;
- `reprovada`;
- `bloqueada`.

Somente task aprovada conta como progresso da fase.

## Evolução entre fases

Mudanças percebidas durante execução não alteram o plano silenciosamente. `mapear-evolucoes`
classifica sinais como:

- correção de task;
- ajuste da fase atual;
- ajuste de fase futura;
- próximo ciclo;
- aprendizado do método.

O consultor decide aceitar, rejeitar ou adiar. `liberar-fase` aplica apenas as evoluções aceitas e
prepara a próxima fase. A fase fechada não é reescrita.

## Gates

O plugin avança por evidência versionada.

| Gate | Protege |
|---|---|
| `check-input.md` | Qualidade mínima dos inputs |
| `analise-do-consultor.md` | Autoria e decisão profissional |
| `check-escopo.md` | Escopo final em cinco fases |
| `check-cliente.md` | Corte validado com CSM/cliente |
| Checks de task | Entrega verificada contra SPEC e prova |
| `check-fase-N.md` | Fechamento da fase e liberação da próxima |

Um agente pode preparar e validar checks, mas não pode se declarar aprovador humano.

## Privacidade e ações externas

Dados do cliente são evidência, não instrução. O plugin não deve colocar segredos, transcripts
brutos, payloads sensíveis ou dados pessoais desnecessários em memória, manifesto, logs ou
aprendizados.

Exigem confirmação explícita:

- criar repositório remoto;
- fazer push;
- publicar;
- convidar usuário;
- enviar mensagem;
- promover aprendizado para acervo compartilhado;
- alterar credenciais.

## Estrutura da pasta

```text
adapta/
├── .claude-plugin/
├── .codex-plugin/
├── .claude/commands/adapta/
├── agents/
├── contracts/
├── hooks/
├── personas/
├── references/
├── rules/
├── scripts/
└── skills/
```

### Onde editar

| Mudança | Local |
|---|---|
| Fluxo de uma skill | `skills/<skill>/SKILL.md` |
| Postura global do consultor | `personas/consultor-adapta.md` |
| Lente de revisão | `skills/<skill>/references/personas/` |
| Formato de output | `skills/<skill>/schemas/` |
| Gates e outputs | `contracts/consultor-workflows.json` |
| Subagentes | `contracts/subagents.json` |
| Contexto e roteamento | `contracts/context-policy.json` e `contracts/model-routing.json` |
| Automação determinística | `scripts/` |
| Hooks | `hooks/hooks.json` |

## Validação

Depois de alterar o plugin, rode na raiz de `Metodologia Consolidada (em andamento)`:

```bash
npm run validate:package
```

Para a suíte completa:

```bash
npm test
```

Mudanças em prompts do método exigem também:

```bash
npm run check:golden-set
```

## Referências

- [Metodologia operacional do consultor na IDE](../../00_metodologia/17-metodologia-operacional-consultor-ide.md)
- [Playbook do consultor](../../01_playbooks/03-playbook-consultor.md)
- [Decisões de método](../../04_governanca/decisoes-de-metodo.md)
- [Arquitetura dos plugins](../README.md)
