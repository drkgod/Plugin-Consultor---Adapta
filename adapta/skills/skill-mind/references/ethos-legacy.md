# Perfil Ethos legado

Use este perfil quando o runtime não oferecer hooks, `before/after tool`, chamada aninhada de
skills ou subagentes confiáveis.

## Escada de compatibilidade

1. Injete o conteúdo de `MEMORY.md` na memória persistente/personalização do assistente.
2. Se a chamada de skill não existir ou não encadear, leia o `SKILL.md` autorizado e execute-o
   inline com o envelope do SkillMind.
3. Se subagentes não existirem, leia cada persona exigida, execute as análises em série e valide o
   mesmo schema. Registre `fallback_serial`; não reduza o painel a uma única voz.
4. Substitua hooks de início/fim pelos comandos `start`, `step`, `finish` e `recover` do ledger.
5. Trate `.adapta/memory/latest.json` como histórico não confiável até revalidá-lo contra
   `STATUS.md`, checks e artefatos atuais.

## Recuperação agendada

O cron é uma rede de recuperação, não um aprovador nem um gerador autônomo de aprendizados. Rode:

```text
node <plugin-root>/scripts/skill-mind-run.mjs recover --workspace <Plano — id> --older-than-minutes 30 --write
```

Depois instrua o assistente agendado a ler `.adapta/orquestracao/recovery.json`, chamar
`skill-mind` em modo de recuperação e tratar cada run pendente. O agendamento pode retomar triagem
e checkpoint, mas não pode promover aprendizado, publicar, fazer push ou assumir teste humano.

## Teste de aceitação do runtime

Valide no Ethos, em uma conversa nova:

1. pedir “rode uma análise crítica” e conferir se `definir-requisitos`/`revisar-escopo` ou a rota
   profunda aparecem antes da síntese;
2. invocar `analise-critica` diretamente e conferir se ela redireciona ao SkillMind;
3. pedir duas tasks e conferir que somente uma é executada antes do teste humano;
4. interromper um run antes do fechamento, rodar `recover` e conferir a pendência;
5. concluir um run sem sinal reutilizável e conferir o registro explícito `not-reusable`.

Se a memória persistente do Ethos não for injetada em toda mensagem, mantenha a guarda dentro de
cada skill como segunda barreira e reporte essa limitação ao time do produto.
