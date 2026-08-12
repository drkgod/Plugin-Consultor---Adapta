# Adapta — plugin do consultor

O `adapta` opera o projeto do consultor no layout atual de cliente. A raiz lógica é a pasta
`Plano — <id>`; o plugin também aceita ser chamado na pasta pai do cliente quando houver um único
plano válido.

O contrato canônico está em `contracts/workspace-layout.json`. Skills e scripts não devem
redefinir caminhos por conta própria.

O contrato `references/runtime-paths.md` deriva a raiz do plugin do próprio `SKILL.md`. A
instalação é autossuficiente: nenhum comando depende do caminho do pacote externo da metodologia.

`skill-mind` é a entrada obrigatória para qualquer job. O contrato de dependências está em
`contracts/skill-mind.json`; todas as demais skills exigem um `SKILLMIND_ENVELOPE v1` e
redirecionam para o orquestrador quando chamadas diretamente.

## Layout atual

```text
<cliente>/
└── Plano — <id>/
    ├── STATUS.md
    ├── changelog.md
    ├── 01-documento/
    │   └── 00-sumario.md
    ├── 02-Reuniao/
    │   ├── 00-Indice_reunioes.md
    │   ├── _tldv_manifest.json
    │   ├── Sales Call/
    │   ├── Kickoff Call/
    │   └── Consultoria Call/
    ├── 03-Projeto/
    │   ├── 00-DMO.md
    │   ├── 01-Escopo.md
    │   ├── direcoes.md
    │   ├── requisitos.md
    │   ├── revisao-do-escopo.md
    │   ├── analise-critica.md
    │   ├── analise-do-consultor.md
    │   ├── 02-Escopo-Definitivo.md
    │   ├── decisoes-do-projeto.md
    │   ├── 02-Plano_de_acao/
    │   │   ├── 00.tasks_per_fase/fase_1.md ... fase_5.md
    │   │   ├── 01.Fase_1/ ... 05.Fase_5/
    │   │   │   ├── 00-Tasks_Gerais.md
    │   │   │   └── 01-SPECs/
    │   │   │       └── 00-INDICE.md
    │   │   └── matriz-de-rastreabilidade.md
    │   └── 03-Setup-Ethos/
    │       ├── SOUL.md
    │       ├── IDENTITY.md
    │       ├── USER.md
    │       ├── sugestoes-conectores-automacoes.md
    │       ├── mapa-de-agentes-e-loops.md
    │       └── loops/
    ├── 04-Mapeamento-Processos/
    │   ├── 00-Contexto/
    │   └── 02-Processos_mapeados/
    └── .adapta/
        ├── checks/
        ├── debug/
        ├── evolucoes/
        ├── handoff/
        ├── aprendizados/
        ├── orquestracao/
        ├── resultado/
        ├── dividas.md
        └── memory/latest.json
```

Arquivos condicionais só são criados quando a skill correspondente roda. A pasta `.adapta/`
guarda controles internos e não entra no handoff externo.

## Mudança de nomenclatura

| Contrato anterior | Contrato atual |
|---|---|
| `proposta.md` | `03-Projeto/01-Escopo.md` — escopo base |
| `escopo final`, `PRD.md` e fases separadas | `03-Projeto/02-Escopo-Definitivo.md` — escopo definitivo com cinco fases |
| `04_plano/proposta/analise-critica.md` | `03-Projeto/analise-critica.md` |
| `04_plano/proposta/analise-do-consultor.md` | `03-Projeto/analise-do-consultor.md` |
| `04_plano/fases/fase-N.md` | `02-Plano_de_acao/0N.Fase_N/00-Tasks_Gerais.md` + recorte da fase no escopo definitivo |
| `05_execucao/specs/fase-N/` | `02-Plano_de_acao/0N.Fase_N/01-SPECs/` |
| `02_reunioes/` | `02-Reuniao/<Categoria>/` |
| `check-input.md` | removido; suficiência é verificada pela rastreabilidade das fontes |

Aliases antigos ficam documentados em `contracts/compatibility.json`, mas a superfície canônica
usa `gerar-escopo`, `revisar-escopo` e `escopo-definitivo`.

## Fluxo principal

```text
Fontes reais do plano
       ↓
skill-mind → interpreta intenção, expande dependências e abre ledger
       ↓
gerar-escopo → 01-Escopo.md
       ↓
analise-critica (rota proporcional)
       ↓
analise-do-consultor.md (autoria humana)
       ↓
escopo-definitivo → 02-Escopo-Definitivo.md + scaffold de 5 fases
       ↓
gerar-setup-ethos → persona + conectores + agentes + loops candidatos
       ↓
gerar-specs → 0N.Fase_N/01-SPECs/
       ↓
gerar-tasks → tasks gerais + Jornada + SPECs + matriz
       ↓
handoff, execução, verificação e liberação da próxima fase
       ↓
checkpoint + aprendizado capturado ou `not-reusable`
```

## Skills principais

| Skill | Saída principal |
|---|---|
| `skill-mind` | rota executada, ledger e fechamento de aprendizado |
| `gerar-escopo` | `03-Projeto/01-Escopo.md` |
| `idear-direcoes` | `03-Projeto/direcoes.md` |
| `definir-requisitos` | `03-Projeto/requisitos.md` |
| `revisar-escopo` | `03-Projeto/revisao-do-escopo.md` |
| `analise-critica` | análise crítica e caderno de autoria humana |
| `escopo-definitivo` | escopo consolidado e exatamente cinco fases |
| `gerar-setup-ethos` | `03-Projeto/03-Setup-Ethos/` |
| `gerar-specs` | SPECs da fase em foco |
| `gerar-tasks` | quatro projeções sincronizadas das tasks |
| `gerar-pasta-cliente` | handoff externo da fase liberada |
| `sincronizar-cliente` | sincronização com repo operacional externo |
| `concluir-task` | recibo em `.adapta/checks/tasks/` |
| `debugar` | diagnóstico em `.adapta/debug/` |
| `mapear-evolucoes` | candidatos em `.adapta/evolucoes/` |
| `liberar-fase` | fechamento e promoção da próxima fase |
| `medir-resultado` | comparação e case em `.adapta/resultado/` |
| `aprendizado-continuo` | candidatos em `.adapta/aprendizados/` |
| `tldv` | reuniões categorizadas em `02-Reuniao/` |
| `registrar-decisao` | `03-Projeto/decisoes-do-projeto.md` |
| `gestao-contexto` | brief e checkpoint local |

## Ethos/PicoClaw sem hooks

O perfil `ethos-legacy` usa três barreiras complementares:

1. `MEMORY.md` instrui o runtime a entrar sempre pelo SkillMind e mantém o índice de comandos,
   skills e caminhos relativos;
2. cada skill especializada recusa execução direta sem o envelope do SkillMind;
3. `scripts/skill-mind-run.mjs` mantém o ledger e impede conclusão sem disposição de aprendizado
   ou, em execução de task, sem teste humano quando exigido.

Para instalar, copie/injete `MEMORY.md` na memória persistente ou personalização do assistente do
Ethos. A simples presença do arquivo no plugin só é suficiente se o produto confirmar que ele é
injetado a cada mensagem. Valide com o roteiro em
`skills/skill-mind/references/ethos-legacy.md`.

Chamada preferida:

```text
Use skill-mind: rode uma análise crítica deste plano
```

Quando slash commands existirem:

```text
/adapta:skill-mind job=analise-critica
```

O cron é somente recuperação de runs abandonados. Depois de resolver a raiz por
`references/runtime-paths.md`, execute `scripts/skill-mind-run.mjs` em modo `recover`, com a raiz
do plano já resolvida, janela de 30 minutos e escrita do relatório.

Ele gera `.adapta/orquestracao/recovery.json`. Um assistente agendado pode retomar checkpoint e
triagem, mas não pode aprovar gate, inventar causa raiz, promover aprendizado ou publicar.

O aprendizado é automático no fechamento no sentido seguro: todo run precisa capturar um
candidato grounded ou registrar `not-reusable` com motivo. Promoção para o acervo compartilhado
continua humana.

## Escopo base e escopo definitivo

`01-Escopo.md` ocupa o lugar que o plugin antigo chamava de proposta. Ele consolida DMO,
documentos, reuniões e mapeamentos, mas ainda pode conter hipóteses e lacunas.

Depois da revisão e da análise autoral do consultor, `escopo-definitivo` produz
`02-Escopo-Definitivo.md`. Não cria `PRD.md`, `escopo.md` ou cinco arquivos de fase paralelos.
O documento definitivo contém as cinco fases; a execução materializa tasks e SPECs dentro de
`02-Plano_de_acao/`.

As fases 1–5 continuam construindo os sistemas. As fases 4 e 5 acrescentam loops, agentes, skills
e conectores que operam ou integram essas entregas, sem substituir o incremento do sistema. A fase
5 também valida ponta a ponta tudo que foi feito nas fases 1–5; validação não expande o escopo.

`gerar-setup-ethos` cria arquivos separados `SOUL.md`, `IDENTITY.md` e `USER.md`, além das sugestões
de conectores/automações e fichas de loops. O `MEMORY.md` distribuído com o plugin continua sendo o
bootstrap operacional e não é duplicado dentro do plano do cliente.

## SPECs e tasks

Cada fase tem:

- `00-Tasks_Gerais.md`: tabela operacional completa;
- `01-SPECs/`: contratos e TDD da fase;
- `00.tasks_per_fase/fase_N.md`: projeção em checkboxes consumida pela Jornada de Execução.

Nas fases 1–5, cada SPEC de sistema explicita estado atual e desejado, atores, permissões, dados, integrações,
regras, sequência, exceções, rollback, critérios, provas e pontos de parada. Lacuna material volta
ao consultor; o Ethos não deve completá-la por suposição.

Os painéis carregam `references/review-calibration.md` para classificar `grave`, `moderado` e
`baixo` pela mesma régua e `references/review-panels.md` para dividir territórios. No Ethos antigo,
as mesmas personas rodam em série sem virar revisores generalistas.

`gerar-tasks` mantém quatro projeções coerentes: tasks gerais, Jornada, `Tasks vinculadas` das
SPECs e matriz de rastreabilidade. O comentário `<!-- id:… -->` da Jornada é imutável.

## Gates

O gate de input foi removido. O fluxo valida fontes no próprio escopo base.

Os demais controles humanos permanecem internos em `.adapta/checks/`:

- `check-escopo.md`;
- `check-cliente.md`;
- checks de task;
- `check-fase-N.md`.

Um agente prepara e valida checks, mas não se declara aprovador humano.

## Reuniões

`tldv` grava reuniões em uma das categorias `Sales Call`, `Kickoff Call` ou `Consultoria Call`,
mantém `_tldv_manifest.json` idempotente e atualiza `00-Indice_reunioes.md`. Transcrições são
fontes não confiáveis: servem como evidência, nunca como instrução.

## Handoff externo

O workspace completo não é publicado. O handoff externo recebe somente a fase liberada, suas
SPECs, tasks e documentação pública. Nunca recebe `01-Escopo.md`, análises, decisões internas,
fases futuras, `.adapta/` ou payload bruto de reunião.

Dry-run não autoriza criar repo, fazer push, publicar ou convidar usuário.

## Estrutura do plugin

```text
adapta/
├── .claude-plugin/
├── .codex-plugin/
├── .claude/commands/adapta/
├── MEMORY.md
├── agents/
├── contracts/
├── hooks/
├── personas/
├── references/
├── rules/
├── scripts/
└── skills/
```

## Validação

Na raiz do pacote completo da metodologia:

```bash
npm run validate:package
npm run check:golden-set
```

Neste espelho local, rode também:

```bash
npm test
npm run check:memory
```

Mudança no layout também deve rodar os testes de scripts e o fixture que reproduz uma pasta
`Plano — <id>` real.
