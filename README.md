# Plugin Consultor — Adapta Native

Este repositório publica o plugin `adapta`, usado pelo consultor Adapta Native no Claude Code.
Ele transforma o diagnóstico de um cliente em um projeto executável: proposta, análise crítica,
escopo em cinco fases, SPECs com TDD, tasks, handoff seguro, execução, medição e aprendizado.

O conteúdo aqui é um espelho de publicação do plugin mantido em
`Metodologia Consolidada (em andamento)/plugins/adapta` no pacote da metodologia Adapta Native.
Alterações no plugin devem ser feitas lá e republicadas aqui — não edite os arquivos deste repo
diretamente como fonte da verdade.

## Instalação

No Claude Code:

```text
/plugin marketplace add kimberlyPrest/Plugin-Consultor---Adapta
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

## O que o plugin faz

- `skills/`: os trabalhos públicos do consultor (proposta, análise crítica, escopo, SPECs,
  tasks, handoff, debug, aprendizado, TLDV, gestão de contexto, entre outros).
- `personas/`: a postura do consultor Adapta.
- `contracts/`: regras de workflow, gates, subagentes, contexto e roteamento por capacidade.
- `scripts/`: operações determinísticas (handoff, checkpoint, validação, ingestão).
- `rules/`: invariantes de privacidade, autoria, evidência e fases.

Veja o guia completo em [`adapta/README.md`](adapta/README.md).

## Regras centrais

- A proposta não é escopo aprovado.
- A análise autoral do consultor não é preenchida pela IA.
- O escopo final tem exatamente cinco fases.
- SPEC define contrato e prova; task executa um recorte desse contrato.
- O cliente recebe apenas a fase atual.
- Ação externa exige confirmação explícita.
