# Plugin Consultor — Adapta Native

Este repositório publica o plugin `adapta`, usado pelo consultor Adapta Native no Claude Code,
Codex e no perfil legado do Ethos/PicoClaw. O `SkillMind` é a entrada canônica: interpreta o
pedido, expande as dependências e executa o fluxo completo mesmo quando o runtime não oferece
hooks, chamadas aninhadas ou subagentes.

O plugin transforma as fontes reais de `Plano — <id>` em um projeto executável: escopo base,
análise crítica, escopo definitivo em cinco fases, SPECs com TDD, tasks, handoff seguro, execução,
medição e aprendizado.

O conteúdo aqui é um espelho de publicação do plugin mantido em
`Metodologia Consolidada (em andamento)/plugins/adapta` no pacote da metodologia Adapta Native.
Alterações no plugin devem ser feitas lá e republicadas aqui — não edite os arquivos deste repo
diretamente como fonte da verdade.

## Instalação

No Claude Code:

```text
/plugin marketplace add drkgod/Plugin-Consultor---Adapta
/plugin install adapta@adapta-consultor
```

Isso adiciona este repositório como marketplace (`adapta-consultor`) e instala o plugin `adapta`
a partir dele. Qualquer consultor com acesso ao Claude Code pode rodar esses dois comandos sem
precisar clonar o pacote completo da metodologia.

Para atualizar depois de uma nova versão publicada:

```text
/plugin marketplace update adapta-consultor
/plugin update adapta
```

No Ethos, instale o bundle conforme o mecanismo disponível e injete
[`adapta/MEMORY.md`](adapta/MEMORY.md) na memória persistente/personalização do assistente. O
arquivo contém a regra de entrada pelo SkillMind, o índice de skills e o fallback sem hooks. Não
presuma que o Ethos descobre esse arquivo apenas por ele existir no repositório.

## O que o plugin faz

- `skills/`: o SkillMind e os trabalhos públicos do consultor (escopo, análise crítica, SPECs,
  tasks, handoff, debug, aprendizado, TLDV, gestão de contexto, entre outros).
- `personas/`: a postura do consultor Adapta.
- `contracts/`: regras de workflow, gates, subagentes, contexto e roteamento por capacidade.
- `scripts/`: operações determinísticas (handoff, checkpoint, validação, ingestão).
- `rules/`: invariantes de privacidade, autoria, evidência e fases.
- `MEMORY.md`: bootstrap portátil para a memória persistente do Ethos.

Veja o guia completo em [`adapta/README.md`](adapta/README.md).
O mapa de quebra de compatibilidade desta versão está em
[`MIGRATION-0.8.0.md`](MIGRATION-0.8.0.md).

## Regras centrais

- Toda solicitação entra por `skill-mind`; skill especializada sem envelope redireciona para ele.
- `03-Projeto/01-Escopo.md` é o escopo base; não é o escopo aprovado.
- A análise autoral do consultor não é preenchida pela IA.
- `03-Projeto/02-Escopo-Definitivo.md` tem exatamente cinco fases.
- SPEC define contrato e prova; task executa um recorte desse contrato.
- O cliente recebe apenas a fase atual.
- Execução de código trata uma task por vez e só avança após teste humano explícito.
- Todo run concluído registra um candidato de aprendizado ou o motivo de não haver aprendizado
  reutilizável.
- Ação externa exige confirmação explícita.
