# Contrato de SPEC + TDD por fase

Uma SPEC é o contrato executável de uma unidade verificável. Ela transforma uma decisão do
escopo em resultado observável, entradas, fluxo, limites, dependências, checklist, critério de
aceite, TDD e evidência. A SPEC define o que construir; o TDD acoplado define como provar que a
construção atende a SPEC.

Cada SPEC deve declarar:

- resultado palpável e requisito/fase de origem;
- incluído, fora de escopo e dono;
- entradas, saídas e pré-condições;
- fluxo principal e caminhos de erro/recuperação;
- regras de negócio, integrações, segurança e rollback;
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

Para a fase 1, o resultado palpável é obrigatório: uma tela, fluxo, automação, artefato ou decisão
operacional que o cliente consiga demonstrar e usar no primeiro ciclo. Fundação sem demonstração
não satisfaz o escopo.
