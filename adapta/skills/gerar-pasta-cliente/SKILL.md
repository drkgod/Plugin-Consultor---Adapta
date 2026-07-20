---
name: gerar-pasta-cliente
description: Prepara a pasta do cliente a partir do workspace do consultor com allowlist, transformação da fase atual, hashes, validação de privacidade e dry-run; só cria repo ou publica após confirmação explícita.
---

# Gerar Pasta do Cliente (a divisão automatizada)

## Bloqueio de entrada

1. `check-escopo.md` e `check-cliente.md` APROVADOS? Se não → pare (gates 2 e 3 primeiro).
2. Fase atual com SPECs válidas, TDD por SPEC, checklist e critérios de aceite? Se não →
   `/adapta:gerar-specs`.
3. Tasks da fase válidas e sincronizadas na fase, nas SPECs e na matriz de rastreabilidade? Se
   não → `/adapta:gerar-tasks`.
4. A reunião de corte/validação está registrada em `02_reunioes/`, com ajustes incorporados no
   escopo, fase e SPECs e revalidados por CSM/consultor? Se não → pare; pasta cliente seria uma
   fotografia anterior à decisão humana.
5. Registre `05_execucao/checks/recibo-handoff-cliente.md` a partir de
   `references/template-recibo-handoff.md`, com data, caminho relativo da
   `02_ata.md` da reunião de corte, `Ajustes incorporados: SIM`, `Revalidacao: APROVADA` e os
   hashes SHA-256 atuais de PRD, escopo, fase, conjunto ordenado de SPECs com seus blocos TDD e
   projeções de tasks.
   O script compara os hashes declarados com os arquivos reais, sela o recibo, os dois checks e a
   ata no dry-run e revalida tudo antes da escrita. Alteração posterior exige novo recibo.
6. Pergunte/conforme: nome do repo (`<cliente>-projeto`), onde criar a pasta local, e o
   usuário GitHub do champion (Tier A) — Tier B não recebe acesso, o repo é só do consultor.

## Passos

1. **Gere primeiro um plano sem escrita**, usando:
   `node <metodologia>/plugins/adapta/scripts/preparar-handoff-cliente.mjs --consultor <workspace> --cliente <destino> --template <metodologia>/06_template-cliente --fase <N> --dry-run`.
   O comando salva `05_execucao/checks/handoff-plan-fase-N.json`, mostra seu digest, allowlist,
   classificação e hashes ao consultor.
2. **Após aprovação do dry-run**, execute o mesmo comando sem `--dry-run`. A execução consome o
   plano selado anterior em vez de recalculá-lo; se qualquer origem mudou, falha e exige novo
   dry-run. O script formaliza
   `04_plano/fases/fase-N.md → 04_fase-atual/fase.md`, inclui somente as SPECs da fase (com TDD)
   e gera `handoff-manifest.json`.
3. **Complete APENAS o que o cliente deve ver:**
   - `CLAUDE.md` do cliente: preencher os `[PREENCHER]` com objetivo, contexto, champion,
     consultor. **Zero referência à metodologia interna.**
   - `01_projeto/objetivo.md` ← objetivo + critério de sucesso + fora de escopo (do PRD, em
     linguagem de cliente)
   - `01_projeto/visao-do-projeto.md` ← objetivo/processo/métrica + o arco das 5 fases em uma
     linha cada (o cliente tem o arco; o detalhe chega fase a fase — D18)
   - `01_projeto/constituicao.md` ← papéis, stack permitida, limites do champion, linha
     vermelha e formato da dívida (preencher todos os `[PREENCHER]` — D18)
   - `06_notas/` ← inicializada vazia (com `debug/`) — a memória do projeto é do cliente
   - `04_fase-atual/` ← `fase.md` com a seção `## Tasks` + `specs/` da fase atual (somente uma —
     decisão D3)
   - `02_reunioes/` ← atas das reuniões com o cliente (kickoff, corte)
   - `03_documentos/` ← documentos que são dele (os que ele mandou + o que produzimos para ele)
   - `STATUS.md` e `changelog.md` inicializados
4. **O que NUNCA vai** (confira antes de publicar): proposta bruta e análise crítica
   (`04_plano/proposta/`), fases 2–5, baseline/análises internas de vídeo, checklist de
   bloqueadores, folha de rosto, qualquer arquivo da metodologia. Se achar algo assim no
   destino, remova e avise.
5. **Valide a exportação antes de publicar** usando o script do plugin do consultor:
   ```bash
   node <caminho-metodologia>/plugins/adapta/scripts/validar-exportacao-cliente.mjs <destino-repo-cliente>
   ```
   Falha nesse script bloqueia publicação: corrija o conteúdo, rode de novo, e só então siga.
6. **Confirme o plugin do cliente:** `.claude/settings.json` e a configuração Codex/AGENTS
   precisam indicar `adapta-cliente`; nunca copie o plugin inteiro para dentro do repo.
   (o template já traz; confirme o marketplace).
7. **Publique somente com nova confirmação:** `git init` + commit inicial +
   `gh repo create <org>/<cliente>-projeto --private --source . --push`. Tier A: convide o
   champion (`gh api` ou instrua o consultor). **Confirme com o consultor antes de criar o repo
   remoto** — é ação externa.
8. **Amarre os dois lados:** registre o caminho/URL do repo do cliente no CLAUDE.md do
   workspace do consultor (campo "Repo do cliente") e no `changelog.md`. A partir daqui,
   `/adapta:sincronizar-cliente` é o canal.

## Extras de celebração (decisão D2)

Ao publicar, deixe preparada a primeira surpresa além das tasks programadas (ex.: uma skill
bônus específica do negócio dele em `.claude/skills/`, um material extra em `03_documentos/`).
A cada fase fechada, `/adapta:liberar-fase` lembra de desbloquear o próximo extra.
