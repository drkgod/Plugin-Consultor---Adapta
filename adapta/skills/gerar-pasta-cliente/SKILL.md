---
name: gerar-pasta-cliente
description: Prepara uma pasta operacional externa a partir da pasta atual do plano do cliente, com allowlist, recorte da fase, hashes, privacidade e dry-run; só cria repo ou publica após confirmação explícita.
---

# Gerar pasta operacional do cliente

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `gerar-pasta-cliente`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a etapa autorizada; confirmação externa continua separada.

Carregue `../../contracts/workspace-layout.json` e `../../references/runtime-paths.md`; resolva a
raiz do plano antes de ler fontes.

## Entradas

1. `.adapta/checks/check-escopo.md` aprovado.
2. `03-Projeto/02-Escopo-Definitivo.md` validado e a fase atual com tasks completas em
   `02-Plano_de_acao/0N.Fase_N/00-Tasks_Gerais.md`.
3. SPECs válidas em `0N.Fase_N/01-SPECs/`, com TDD, checklist e aceite.
4. Reunião de corte em `02-Reuniao/<Categoria>/.../02_ata.md`, com ajustes incorporados.
5. `.adapta/checks/recibo-handoff-cliente.md` baseado no template desta skill, com os hashes do
   escopo base, escopo definitivo, tasks da fase e conjunto ordenado de SPECs.

## Passos

1. Faça dry-run com `../../scripts/preparar-handoff-cliente.mjs`, resolvido a partir desta skill. O plano selado é salvo em
   `.adapta/handoff/handoff-plan-fase-N.json`.
2. Após aprovação, execute sem `--dry-run`. O script copia
   `0N.Fase_N/00-Tasks_Gerais.md → 04_fase-atual/fase.md`, inclui somente as SPECs da fase e
   gera `handoff-manifest.json`.
3. Complete no destino somente conteúdo de cliente: objetivo, visão, constituição, fase atual,
   SPECs, tasks, atas liberadas, documentos públicos, `STATUS.md` e `changelog.md`.
4. Nunca copie `03-Projeto/01-Escopo.md`, `direcoes.md`, `requisitos.md`,
   `revisao-do-escopo.md`, `analise-critica.md`, `analise-do-consultor.md`, `.adapta/`, fases
   futuras, arquivos brutos de reunião ou materiais da metodologia.
5. Rode `../../scripts/validar-exportacao-cliente.mjs`, resolvido da mesma forma, antes de
   publicar. Falha bloqueia publicação.
6. Confirme que o destino usa `adapta-cliente`; não copie este plugin inteiro.
7. Criação de repo, commit remoto, push ou convite exige nova confirmação explícita.
8. Registre o caminho/URL do repo no workspace e em `changelog.md`; depois use
   `skill-mind job=sincronizar-cliente`.

O dry-run não concede autorização para a ação externa seguinte.
