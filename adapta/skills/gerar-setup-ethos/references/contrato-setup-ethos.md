# Contrato do pacote de setup do Ethos

O pacote traduz contexto aprovado do projeto em configuração operacional. Ele não substitui o
escopo definitivo, as SPECs, a memória do plugin nem a call de setup com o cliente.

## Estrutura canônica

```text
03-Projeto/03-Setup-Ethos/
├── 00-INDICE.md
├── SOUL.md
├── IDENTITY.md
├── USER.md
├── sugestoes-conectores-automacoes.md
├── mapa-de-agentes-e-loops.md
└── loops/
    └── LOOP-NN-<slug>.md
```

## Regras de grounding

- Toda afirmação específica deve apontar para escopo, reunião, mapeamento ou decisão do consultor.
- Diferencie `CONFIRMADO`, `INFERÊNCIA` e `VALIDAR NA CALL DE SETUP`.
- Não coloque análise interna, dissenso do painel ou informação sigilosa nos textos que serão
  colados no assistente do cliente.
- Dados ausentes que mudem permissões, meta, validação ou autonomia bloqueiam a ativação, não a
  criação do rascunho.

## Conteúdo dos arquivos

### SOUL.md

Defina missão, princípios, modo de raciocinar, tom, padrão de profundidade, disciplina de execução
em fases, postura diante de incerteza e limites éticos/operacionais. Não repita dados cadastrais.

### IDENTITY.md

Defina nome ou placeholder, papel, responsabilidades, capacidades, coisas que não faz, quando pede
validação e como se relaciona com o champion e com agentes especializados.

### USER.md

Registre somente contexto útil: empresa, champion, objetivos, processo crítico, ferramentas,
preferências de comunicação, critérios de sucesso, restrições, aprovadores e rotina. Não inclua
segredos ou categorias sensíveis sem necessidade explícita.

### Sugestões de conectores e automações

Use uma tabela com: sugestão, tipo, necessidade, evidência, dado/fonte, permissão mínima,
consumidor, responsável, momento de ativação, risco, alternativa e status. Classifique cada item
como `necessário`, `recomendado` ou `futuro`. Automação agendada precisa declarar gatilho,
frequência, condição de parada e comportamento em erro.

### Mapa de agentes e loops

Mostre qual agente executa cada loop, quais sistemas das fases 1–3 ele usa e qual SPEC da fase 4
configura a integração. Um agente pode operar mais de um loop somente quando missão, acessos e
contexto são compatíveis.

## Índice e gate da call

O `00-INDICE.md` deve listar arquivos, fontes, itens prontos, pendências e um checklist para:

- revisar SOUL, IDENTITY e USER com o cliente;
- conectar apenas contas aprovadas;
- instalar skills necessárias;
- criar loops sem ativar autonomia não aprovada;
- registrar baseline, alvo, cadência e veredito de cada loop;
- confirmar quem valida e quem pode alterar configurações.
