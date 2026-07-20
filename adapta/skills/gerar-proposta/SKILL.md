---
name: gerar-proposta
description: Gera ou regenera a proposta do sistema com o prompt 05c quando o handoff não a trouxe ou o input consolidado mudou. A proposta alimenta analise-critica e depois escopo-final; não é o escopo aprovado.
---

# Gerar Proposta de Plano (tempo 1 do D1)

## Bloqueio de entrada

1. `05_execucao/checks/check-input.md` existe e está APROVADO? Se não → **pare e avise**
   (GATE 1 é obrigatório; não contorne).
2. `01_contexto/folha-de-rosto.md` preenchida (objetivo quantificado + tier)? Sem ela o prompt
   não roda (regra do artefato `09`).
3. Existe pelo menos um raio-X em `03_discovery/analises/`? Se não → processe o vídeo no sistema
   e atualize o handoff antes.
4. Já existe proposta em `04_plano/proposta/`? Pergunte se é para regenerar (versione:
   `proposta-v2.md`) — nunca sobrescreva silenciosamente.

## Passos

1. **Monte os inputs** do prompt `02_prompts/05c-prompt-plano.md` (pasta da metodologia — caminho
   no CLAUDE.md do workspace):
   - `<folha_de_rosto>` ← `01_contexto/folha-de-rosto.md`
   - `<raio_x>` ← todas as análises de `03_discovery/analises/`
   - `<bloqueadores>` ← `01_contexto/bloqueadores.md`
   - `<asa_instrucao>` ← bloco de instrução de `02_prompts/06-asa-instrucao.md`
   - `<transcricoes>`, `<dmo>`, `<documentos>` ← `01_contexto/` e `02_reunioes/`
2. **Execute o prompt** e salve a saída inteira em `04_plano/proposta/proposta.md`
   (a proposta fica em UM arquivo — a distribuição em PRD/escopo/fases é papel do
   `/adapta:escopo-final`, depois da análise crítica e da autoria humana).
3. **Autoavalie a proposta antes de entregá-la ao painel** — não substitui a análise crítica
   (D1), evita mandar para lá uma proposta com lacuna óbvia. Note de 1 a 5, **com evidência
   citada** para toda nota abaixo de 5 (mostrar a lacuna, não só nomeá-la):
   <!-- Eixos reempacotados de ECC (github.com/affaan-m/ECC — skill `agent-self-evaluation`), adaptados (D6). -->
   - **Grounding:** toda regra de negócio tem fonte (timestamp/documento)? Inferências marcadas?
   - **Completude:** cobre objetivo, as-is, ASA, 5 fases, fora de escopo? Bloqueadores refletidos?
   - **Clareza:** o consultor entende cada fase sem reler o raio-X?
   - **Acionabilidade:** as fases viram specs sem inventar informação?
   - **Concisão:** há enchimento que o painel vai ter que atravessar?
   Eixo ≤ 3 com causa em **input faltante** → resolva antes (vídeo novo, folha de rosto);
   lacuna de geração → regenere versionando. Nota alta sem evidência é autocongratulação, não
   avaliação.
4. **Atualize** `changelog.md` e informe o próximo passo: `/adapta:analise-critica`.

> A proposta é material de trabalho interno do consultor. Ela **nunca** vai para a pasta do
> cliente (decisão D5).
