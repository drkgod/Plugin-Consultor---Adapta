---
name: adapta:destravar-task
description: Diagnostica erro ou artefato quebrado no workspace do consultor sem pular gates.
argument-hint: "[erro, comando, arquivo, fase ou contexto opcional]"
disable-model-invocation: true
---

NOTE: Use quando uma task do consultor travar em proposta, plano, revisão, fase, exportação ou
sincronização. A skill investiga causa raiz antes de corrigir e registra decisão humana quando o
problema for de escopo, fonte ou método.

/adapta:debugar $ARGUMENTS
