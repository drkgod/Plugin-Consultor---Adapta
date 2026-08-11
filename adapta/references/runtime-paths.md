# Resolução portátil dos caminhos do plugin

O plugin é autossuficiente. Nunca dependa do pacote externo da metodologia e nunca peça ao usuário
o caminho de instalação do plugin.

## Resolver a raiz do plugin

1. Parta do caminho real do `SKILL.md` que o runtime acabou de carregar.
2. Para uma skill em `skills/<nome>/SKILL.md`, suba dois diretórios. O resultado é a raiz do
   plugin.
3. Valide a raiz exigindo estes três marcadores:
   - `contracts/skill-mind.json`;
   - `scripts/skill-mind-run.mjs`;
   - `skills/skill-mind/SKILL.md`.
4. Se o runtime não expuser o caminho da skill, procure esses marcadores somente no bundle
   instalado e no workspace atual. Aceite uma única raiz válida; com zero ou mais de uma, reporte
   a limitação técnica e os candidatos encontrados. Não transfira a descoberta ao usuário.

## Executar scripts

- Quando a instrução usar `../../scripts/arquivo.mjs`, interprete o caminho em relação ao diretório
  da skill carregada, nunca em relação ao diretório corrente do shell.
- Preferencialmente configure o `workdir` do shell como o diretório da skill e execute o caminho
  relativo. Se o shell não oferecer `workdir`, componha o caminho absoluto a partir da raiz já
  validada.
- Resolva a raiz `Plano — <id>` separadamente por `contracts/workspace-layout.json`. A raiz do
  projeto e a raiz do plugin não são a mesma coisa, mesmo quando o instalador copiou ambos para o
  mesmo workspace.
- Argumentos de workspace, clone do cliente, fase e job vêm do estado já validado pelo SkillMind.
  Pergunte somente quando a informação de projeto estiver realmente ausente; nunca pergunte onde
  o plugin ou o pacote da metodologia foi instalado.

## Mapa de scripts

| Operação | Caminho relativo à raiz do plugin |
|---|---|
| Ledger e recuperação | `scripts/skill-mind-run.mjs` |
| Handoff inicial | `scripts/preparar-handoff-cliente.mjs` |
| Liberação de fase | `scripts/preparar-liberacao-fase.mjs` |
| Validação da fronteira | `scripts/validar-exportacao-cliente.mjs` |
| Brief/checkpoint | `scripts/context-brief.mjs` e `scripts/context-checkpoint.mjs` |
| Medição do método | `scripts/relatorio-metodo.mjs` |
| Ingestão tl;dv | `scripts/tldv-sync.mjs` |
