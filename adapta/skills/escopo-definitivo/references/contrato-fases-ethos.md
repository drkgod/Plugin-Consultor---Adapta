# Contrato das cinco fases com sistemas e loops de valor

Este contrato acrescenta a operação no Ethos sem substituir o método atual: continuam existindo
exatamente cinco fases, SPECs em onda, gates humanos, sequência ASA quando aplicável e entrega
visível desde a fase 1.

## Fases 1–5 — evoluir os sistemas

As cinco fases entregam incrementos verticais dos sistemas previstos no escopo. Não use
“levantamento”, “infraestrutura” ou “preparação” como resultado isolado. Cada fase precisa declarar:

- resultado de negócio e demonstração visível;
- capacidades do sistema incluídas e “Fora desta fase”;
- atores, permissões, dados, fontes de verdade e integrações;
- regras de negócio, exceções críticas, riscos e rollback;
- dependências e decisões já fechadas para a geração posterior de SPECs;
- critérios binários e evidências que provam o incremento.

As SPECs continuam sendo geradas em onda. Quando qualquer fase entrar em foco, o detalhamento precisa
ser suficiente para o Ethos executar sem inventar arquitetura, regra, acesso, dado ou aceite.

## Fases 4 e 5 — acrescentar loops de valor

Além do incremento de sistema da própria fase, as fases 4 e 5 configuram a camada operacional no
Ethos. Loop nunca substitui objetivo, SPEC, task ou critério de aceite do sistema:

- loops com uma meta mensurável por ciclo;
- assistente principal e agentes especializados somente quando necessários;
- skills e conectores usados por cada loop;
- baseline, alvo, unidade, prazo, cadência, fonte de medição e responsável pelo veredito;
- instruções permanentes, primeiras tarefas, limites de autonomia e recuperação de falhas;
- vínculo explícito entre cada loop e as entregas dos sistemas que ele usa ou integra.

Loop sem métrica ou veredito vira rotina/automação candidata, não loop de valor. Conector sugerido
não é conector disponível; a disponibilidade e a permissão são validadas na call de setup.

## Fase 5 — concluir sistemas, loops e validação

A fase 5 entrega o último incremento previsto dos sistemas, acrescenta ou amadurece os loops
planejados e valida, de ponta a ponta, tudo que foi entregue nas fases 1–5. A validação não pode
ser usada para esconder pendência anterior. O plano precisa cobrir:

- entrega e aceite das capacidades de sistema previstas para a fase 5;
- regressão funcional de cada sistema das fases 1–5;
- fluxos integrados entre sistemas, agentes, conectores e loops das fases 4 e 5;
- permissões, privacidade, qualidade e integridade dos dados;
- caminhos de falha, timeout, duplicidade, recuperação e rollback;
- baseline, alvo, cadência e confiabilidade da medição dos loops;
- execução assistida pelo champion e aceite humano dos critérios globais;
- pendências, riscos residuais e decisão documentada de go-live/encerramento.

A matriz de rastreabilidade da fase 5 aponta para toda fase, requisito, SPEC, critério e evidência
anterior. Item não testado permanece pendente; não pode ser aprovado por ausência de erro relatado.

## Antipadrões

- criar uma fase 6 para loops ou validação;
- transformar a fase 4 em uma fase somente de loops, sem incremento de sistema;
- transformar a fase 5 em uma fase somente de validação, sem incremento de sistema;
- esconder capacidade de sistema dentro de uma SPEC ou task de loop;
- tratar “o cliente valida” como teste sem roteiro e evidência;
- usar velocidade do agente como critério de pronto;
- preencher cinco fases com atividades genéricas para manter o número.
