---
name: medir-resultado
description: Fecha o projeto medindo o antes/depois com evidências comparáveis, gera a comparação e prepara a entrevista de case. Use ao fim da fase 5 ou quando o usuário pedir para medir o resultado ou fechar o projeto.
---

# Medir resultado

## Porta de entrada SkillMind

Sem `SKILLMIND_ENVELOPE v1` autorizando `medir-resultado`, não execute este job. Carregue
`../skill-mind/SKILL.md` e entregue a ele o pedido original. Com envelope válido, execute somente
a etapa autorizada e preserve o run até os finalizadores.

Carregue `../../references/runtime-paths.md` para executar scripts sem depender do pacote externo
da metodologia.

## Entradas

- `.adapta/checks/check-fase-5.md` precisa estar aprovado.
- As SPECs da fase 5 precisam conter e concluir a matriz de validação das fases 1–4. Item sem
  evidência mantém o fechamento bloqueado, mesmo quando nenhum erro foi relatado.
- Evidência “depois” fica em `.adapta/resultado/videos_depois/` e deve repetir processo, roteiro
  ou métrica do baseline. Sem comparação válida, não estime resultado.

## Passos

1. Receba a análise “depois” em `.adapta/resultado/analises/`, no mesmo formato do baseline.
2. Monte os inputs do prompt de comparação configurado na metodologia:
   - `<baseline>`: evidência congelada citada por `03-Projeto/01-Escopo.md` ou por
     `04-Mapeamento-Processos/00-Contexto/`;
   - `<raio_x_depois>`: análise do passo 1;
   - `<plano>`: `03-Projeto/02-Escopo-Definitivo.md`;
   - `<contexto_financeiro>`: somente números com fonte explícita.
3. Salve `.adapta/resultado/comparacao.md`, com contas explícitas e também métricas que pioraram.
   Diferencie prova de funcionamento (fase 5) de resultado de negócio (comparação antes/depois).
4. Prepare `.adapta/resultado/case.md`; a entrevista de percepção ocorre depois da comparação.
5. Atualize `STATUS.md` e `changelog.md`.
6. Rode `../../scripts/relatorio-metodo.mjs`, resolvido a partir desta skill. Passe em
   `--workspace` a raiz do plano já resolvida e, em `--out`, o arquivo
   `.adapta/resultado/custo-do-metodo.md` dentro desse plano. O script lê recibos em
   `.adapta/checks/tasks/*.json` e `.adapta/dividas.md`.
7. Devolva sinais anonimizados ao finalizador de aprendizado do SkillMind. Publicação de
   comparação ou case no repo do cliente exige
   `sincronizar-cliente` e confirmação explícita.
