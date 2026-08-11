# Contrato das cinco fases com sistemas e loops de valor

Este contrato acrescenta a operação no Ethos sem substituir o método atual: continuam existindo
exatamente cinco fases, SPECs em onda, gates humanos, sequência ASA quando aplicável e entrega
visível desde a fase 1.

## Fases 1–3 — construir os sistemas

As três primeiras fases entregam incrementos verticais dos sistemas previstos no escopo. Não use
“levantamento”, “infraestrutura” ou “preparação” como resultado isolado. Cada fase precisa declarar:

- resultado de negócio e demonstração visível;
- capacidades do sistema incluídas e “Fora desta fase”;
- atores, permissões, dados, fontes de verdade e integrações;
- regras de negócio, exceções críticas, riscos e rollback;
- dependências e decisões já fechadas para a geração posterior de SPECs;
- critérios binários e evidências que provam o incremento.

As SPECs continuam sendo geradas em onda. Quando uma fase 1–3 entrar em foco, o detalhamento precisa
ser suficiente para o Ethos executar sem inventar arquitetura, regra, acesso, dado ou aceite.

## Fase 4 — operar e integrar por loops

A fase 4 não refaz os sistemas das fases 1–3. Ela configura a camada operacional no Ethos:

- loops com uma meta mensurável por ciclo;
- assistente principal e agentes especializados somente quando necessários;
- skills e conectores usados por cada loop;
- baseline, alvo, unidade, prazo, cadência, fonte de medição e responsável pelo veredito;
- instruções permanentes, primeiras tarefas, limites de autonomia e recuperação de falhas;
- vínculo explícito entre cada loop e as entregas das fases 1–3 que ele usa ou integra.

Loop sem métrica ou veredito vira rotina/automação candidata, não loop de valor. Conector sugerido
não é conector disponível; a disponibilidade e a permissão são validadas na call de setup.

## Fase 5 — validar o conjunto completo

A fase 5 valida, de ponta a ponta, tudo que foi entregue nas fases 1–4. Ela não serve para adicionar
um novo sistema nem para esconder pendência anterior. O plano precisa cobrir:

- regressão funcional de cada sistema das fases 1–3;
- fluxos integrados entre sistemas, agentes, conectores e loops da fase 4;
- permissões, privacidade, qualidade e integridade dos dados;
- caminhos de falha, timeout, duplicidade, recuperação e rollback;
- baseline, alvo, cadência e confiabilidade da medição dos loops;
- execução assistida pelo champion e aceite humano dos critérios globais;
- pendências, riscos residuais e decisão documentada de go-live/encerramento.

A matriz de rastreabilidade da fase 5 aponta para toda fase, requisito, SPEC, critério e evidência
anterior. Item não testado permanece pendente; não pode ser aprovado por ausência de erro relatado.

## Antipadrões

- criar uma fase 6 para loops ou validação;
- deslocar para a fase 4 uma capacidade de sistema esquecida nas fases 1–3;
- tratar “o cliente valida” como teste sem roteiro e evidência;
- usar velocidade do agente como critério de pronto;
- preencher cinco fases com atividades genéricas para manter o número.
