# Sintese da Analise Critica

## Entrada

A sintese consome os artefatos produzidos pela rota escolhida:

- `direcoes.md`, quando `idear-direcoes` foi executada;
- `requisitos.md`, quando `definir-requisitos` foi executada;
- `revisao-do-escopo.md`, produzida por `revisar-escopo` a partir dos achados no schema
  `achado-revisao-escopo.schema.json`.

A sintese deve juntar esses resultados em um documento humano, sem despejar JSON bruto nem
reexecutar o trabalho das skills especializadas.

## Regras de sintese

1. **Deduplicar por falha, nao por frase.** Se dois revisores apontam a mesma consequencia, vira um
   achado com varios revisores de origem.
2. **Grave exige cenario concreto.** Achado grave precisa dizer como o escopo falha no mundo real
   e qual evidência sustenta isso.
3. **Decisao humana nao e erro.** Quando existem dois caminhos validos, escreva como decisao do
   consultor: opcoes, trade-off e recomendacao se houver.
4. **Aprendizado externo ao caso fica separado.** Segundo cérebro e precedentes entram em secao
   propria; nao misture com evidência observada do cliente.
5. **Solido tambem aparece.** Liste o que foi verificado e parece bom para evitar que o consultor
   gaste energia revisando de novo o que ja passou.

## Template do documento final

```markdown
# Analise Critica do Escopo

**Data:** AAAA-MM-DD
**Escopo analisado:** `03-Projeto/01-Escopo.md`
**Revisores:** revisor-de-plano, revisor-adversarial, revisor-viabilidade, guardiao-de-escopo, explorador-de-alternativas

## Veredito curto

[2-4 linhas: escopo utilizavel / precisa de corte / precisa regenerar / falta fonte]

## Achados graves

### AC-001 — [titulo]

- **Origem:** [revisores]
- **Evidencia:** [arquivo/timestamp/trecho]
- **Cenario de falha:** [como quebra em campo]
- **O que decidir/fazer:** [acao concreta]

## Achados moderados

[Continue a sequência `AC-002`, `AC-003`... no mesmo formato, mais curto. IDs são estáveis e
devem ser usados em `analise-do-consultor.md` e na matriz de rastreabilidade.]

## Decisoes humanas

| Decisao | Opcoes | Recomendacao | Quem decide |
|---|---|---|---|

## Aprendizados aplicaveis do segundo cerebro

[Se nao consultado: "Nao consultado — caminho nao configurado ou validacao adiada."]

## O que esta solido

- [item verificado + evidencia]

## Proximo passo

O consultor lê escopo base + análise crítica, preenche `analise-do-consultor.md` e roda
`/adapta:escopo-definitivo`.
```
