# Contrato de SPEC + TDD por fase

Uma SPEC é o contrato executável de uma unidade verificável. Ela transforma uma decisão do
escopo em resultado observável, entradas, fluxo, limites, dependências, checklist, critério de
aceite, TDD e evidência. A SPEC define o que construir; o TDD acoplado define como provar que a
construção atende a SPEC.

Cada SPEC deve declarar:

- resultado palpável e requisito/fase de origem;
- contexto atual, estado desejado e decisões já fechadas;
- incluído, fora de escopo e dono;
- atores, permissões, entradas, saídas e pré-condições;
- dados, fonte de verdade, campos/mapeamentos e regras de qualidade quando aplicável;
- fluxo principal e caminhos de erro/recuperação;
- regras de negócio, integrações, segurança, idempotência e rollback;
- superfícies, arquivos, repositórios ou configurações afetadas quando forem conhecidos;
- instruções de execução, limites e pontos de parada para o Ethos;
- checklist operacional binário;
- critérios de aceite observáveis, com evidência esperada;
- TDD da SPEC, com RED/GREEN/REFACTOR, comandos, fixtures ou cenários verificáveis;
- seção reservada para tasks vinculadas, preenchida depois por `gerar-tasks`.

O TDD é obrigatório dentro da SPEC quando a entrega envolver software, automação, integração,
dados, planilha automatizada, script ou qualquer comportamento executável pelo agente do cliente.
Para entregas não técnicas, o bloco TDD vira um roteiro de verificação: cenário, dado/condição,
resultado esperado, evidência objetiva e regressão manual. Não mantenha matriz ou arquivo TDD
paralelo; a rastreabilidade vive no próprio arquivo da SPEC e em
`02-Plano_de_acao/matriz-de-rastreabilidade.md`.

Nas fases 1–3, “detalhado” é um critério observável: uma pessoa ou agente que tenha os acessos
declarados consegue executar sem escolher arquitetura, inventar regra, adivinhar campo, ampliar
permissão ou definir o próprio aceite. `A definir`, `etc.`, `conforme necessário` e equivalentes
são bloqueios quando afetam a execução. A SPEC pode citar uma fonte de verdade em vez de duplicar
conteúdo, desde que informe arquivo/seção exatos.

Na fase 4, a SPEC inclui a configuração completa do loop/agente/conector. Na fase 5, a SPEC é um
contrato de validação transversal e rastreia as entregas das fases 1–4. O TDD da fase 5 prova o
conjunto integrado e não repete apenas testes unitários já executados.

Para a fase 1, o resultado palpável é obrigatório: uma tela, fluxo, automação, artefato ou decisão
operacional que o cliente consiga demonstrar e usar no primeiro ciclo. Fundação sem demonstração
não satisfaz o escopo.
