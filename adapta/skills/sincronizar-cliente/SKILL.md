---
name: sincronizar-cliente
description: Sincroniza o workspace do consultor com o repositório do cliente, resume o avanço e publica somente o que foi liberado. Use no início do dia ou após liberar-fase.
---

# Sincronizar com o Repo do Cliente

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `sincronizar-cliente`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a etapa autorizada; publicação continua condicionada a confirmação.

Carregue `../../references/runtime-paths.md`. O plugin é autossuficiente; não procure nem solicite
um pacote externo da metodologia.

## Pré-requisito

- O campo "Repo do cliente" está preenchido no CLAUDE.md do workspace (colocado pelo
  `gerar-pasta-cliente`). Se não há repo ainda, esta skill não se aplica (Tier B sem repo
  compartilhado: o acompanhamento é direto no workspace).

## Passos — puxar (o que o cliente fez)

1. `git pull` no clone local do repo do cliente (clone se ainda não existir localmente).
2. **Resuma as mudanças desde a última sincronização** (changelog do cliente + diff):
   - Tasks concluídas (conferir se o critério binário foi respeitado — abra por amostragem)
   - Dúvidas/anotações do champion (changelog, comentários em tasks)
   - Arquivos novos em `03_documentos/`
   - Notas novas em `06_notas/` (inclui relatórios de debug do champion em `06_notas/debug/`) —
     memória do projeto e insumo do aprendizado (D18)
   - Marcas `adapta-divida:` novas no diff (simplificação deliberada com teto e gatilho — D17)
   - Mudanças órfãs: diff/commits que não se rastreiam a nenhuma task ativa da fase
3. **Reflita no workspace:** atualize o `STATUS.md` do consultor (% da fase, travas) e o
   `changelog.md`. Consolide as marcas `adapta-divida:` novas no ledger `.adapta/dividas.md`
   (teto, gatilho, task e arquivo de origem) — o ledger é insumo de `mapear-evolucoes`,
   `liberar-fase` e de propostas de ciclos novos. Task travada > 3–5 dias → sinalize para o CS
   acionar o champion.
4. **Trate mudanças órfãs (D17):** diff sem task ativa correspondente nunca é aceito em
   silêncio — registre como sinal para `mapear-evolucoes` e decida com o consultor: legitimar
   (vira emenda/task pela via normal) ou reverter. Dívida que toque a linha vermelha já deveria
   ter reprovado a task de origem; se aparecer aqui, trate como falha de verificação.
5. **Responda o que precisa de resposta:** dúvida do champion vira ou orientação registrada no
   repo do cliente, ou ajuste de spec (nunca deixe dúvida sem dono).

## Passos — publicar (o que o consultor libera)

6. Copie para o repo do cliente **apenas** o que foi liberado:
   - Specs/tasks novas ou corrigidas da **fase atual**
   - Na virada de fase (após `skill-mind job=liberar-fase`): mover a unidade fechada para
     `05_entregas/fase-N/` e colocar a nova em `04_fase-atual/` — o cliente continua vendo
     **uma unidade por vez** (decisão D3)
   - Extras de celebração desbloqueados (decisão D2)
7. Antes de commitar, execute, a partir do diretório desta skill,
   `node ../../scripts/validar-exportacao-cliente.mjs`, passando o caminho já resolvido do clone do
   cliente como primeiro argumento.
   Se falhar, não publique; remova o vazamento ou corrija o placeholder primeiro.
8. Atualize o `STATUS.md` do cliente (fase, %, próxima reunião), commit com mensagem clara
   (`fase 2 liberada: <objetivo em 1 frase>`) e push.
9. Registre a sincronização no `changelog.md` do workspace.

## Regra

O repo do cliente é o **canal único** consultor↔cliente para material de projeto. Nada de
mandar spec por WhatsApp/e-mail — se não está no repo, não existe.
