---
name: registrar-decisao
description: Registra uma decisão estrutural DO PROJETO no workspace do consultor (04_plano/decisoes-do-projeto.md) - contexto, decisão, alternativas rejeitadas e consequências, numerada P1, P2… Use quando o consultor disser "registra essa decisão", "decidimos ir por X", quando um trade-off relevante for fechado numa conversa (mudança de rota entre ciclos, troca de ferramenta, recorte de fase), ou quando alguém perguntar "por que fizemos assim?" (modo consulta). Decisão trivial não entra; decisão que muda o MÉTODO vai para decisoes-de-metodo.md, não aqui.
---

<!-- Reempacotado de ECC (Everything Claude Code, github.com/affaan-m/ECC — skill `architecture-decision-records`), traduzido e adaptado ao método Adapta Native (decisão D6). Formato alinhado ao de 04_governanca/decisoes-de-metodo.md. -->

# Registrar Decisão do Projeto

Decisões de projeto morrem em thread de conversa e memória de consultor. Este registro faz o
"por quê" sobreviver: quando alguém (o próprio consultor daqui a 2 meses, outro consultor
assumindo, o CS no fechamento) perguntar "por que o projeto é assim?", a resposta está em
`04_plano/decisoes-do-projeto.md`.

**Dois níveis, não confunda:**
- **Projeto** (este arquivo, P1, P2…): vale para ESTE cliente. Ex.: "fase 3 trocou automação
  do faturamento por dashboard de cobrança", "usar a planilha existente como fonte, não o ERP".
- **Método** (`04_governanca/decisoes-de-metodo.md`, D1, D2…): muda como o produto funciona
  para todos os clientes. Se a decisão é dessa natureza, leve para quem mantém o pacote.

A seção "Decisões do consultor" do `escopo.md` registra as divergências **da proposta** no
momento do escopo final (D1, tempo 3). Este arquivo registra as decisões **ao longo dos 4
meses** — mudanças de rota entre ciclos, trade-offs que surgem na execução.

## Sinais de que há uma decisão a registrar

- **Explícitos:** "vamos de X", "decidimos não fazer Y", "o trade-off compensa porque…",
  "registra isso".
- **Implícitos** (sugira registrar; não crie sem confirmar): comparação de dois caminhos que
  chegou a uma conclusão; recorte de escopo negociado com o cliente; troca de ferramenta ou
  fonte de dado; mudança na ordem/conteúdo de uma fase; saída de um `/adapta:conselho-de-decisao`.

## Formato da entrada

Adicione ao fim de `04_plano/decisoes-do-projeto.md` (crie o arquivo com este cabeçalho na
primeira vez, confirmando com o consultor):

```markdown
## P<N> — [título: a decisão, específica]

**Status:** ✅ ratificada (mês/ano) · **Decisores:** [quem participou]

**Contexto:** [2-5 frases: que situação motivou, que restrições pesavam]

**Decisão:** [1-3 frases, tempo presente: "usamos X", não "vamos avaliar X"]

**Alternativas rejeitadas:**
- [Alternativa]: [por que não — "só escolhemos" não é justificativa]

**Consequências:** [o que fica mais fácil, o que fica mais difícil, que risco assumimos]
```

## Regras (as mesmas do registro do método)

1. **Nunca edite decisão ratificada.** Mudou? Escreva uma nova que a substitui e marque a
   antiga como `⛔ superada por P<M>`.
2. **Registre o porquê, não só o quê** — alternativas rejeitadas incluídas.
3. **Legível em 2 minutos.** Contexto passou de ~10 linhas = está narrando, corte.
4. **Trivialidade não entra** (nome de arquivo, formatação, escolha sem consequência).
5. **Consequências honestas** — toda decisão tem custo; entrada sem "o que fica mais difícil"
   está incompleta.
6. **Decisão retroativa é marcada** — se registrar algo decidido semanas atrás, anote a data
   original.

## Modo consulta

"Por que escolhemos X?" → leia `04_plano/decisoes-do-projeto.md`, apresente Contexto + Decisão
da entrada correspondente. Não existe entrada? Diga isso e ofereça registrar agora (com data
original). O arquivo não existe ainda? "Nenhuma decisão registrada neste projeto — quer começar?"

## Integrações no fluxo

- `/adapta:conselho-de-decisao` termina sugerindo registrar quando o veredito muda algo real.
- `/adapta:liberar-fase` é um bom momento de varredura: alguma decisão do ciclo ficou sem registro?
- Decisão que rende aprendizado geral (padrão, não específico do cliente) → contribua também no
  `/adapta:aprendizado-continuo capturar`, anonimizado.
