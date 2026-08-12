# Territórios canônicos dos painéis de revisão

Antes do dispatch, o agente principal entrega a cada persona apenas seu território. O revisor não
repete a revisão de outro território: quando notar um sinal fora do seu foco, retorna um handoff de
uma linha para a persona indicada, sem abrir um segundo achado. A síntese deduplica por consequência.

## definir-requisitos

| Persona | Revisa | Não revisa | Encaminha para |
|---|---|---|---|
| `analista-de-fluxo` | atores, estados, transições, caminho principal, erros, recuperação e resultado terminal | descoberta de restrições externas e pontos cegos de domínio; escolha de solução | `detector-de-pontos-cegos` |
| `detector-de-pontos-cegos` | premissas ocultas, condição externa, dado/acesso ausente, dependência sem dono e conhecimento de domínio faltante | redesenho do fluxo já descrito; stack, arquitetura ou fases | `analista-de-fluxo` ou agente principal |

## revisar-escopo

| Persona | Revisa | Não revisa | Encaminha para |
|---|---|---|---|
| `revisor-de-plano` | conformidade com método, grounding, objetivo, bloqueadores, ASA e arco das fases | falsificação de premissas, viabilidade profunda, corte por excesso e alternativas | persona territorial correspondente |
| `revisor-adversarial` | premissas contestáveis, cenários de falsificação e custo de reversão | checklist geral do método, implementação detalhada e corte de escopo | `revisor-de-plano`, `revisor-viabilidade` ou `guardiao-de-escopo` |
| `revisor-viabilidade` | realidade técnica/operacional, dependências, dados/acessos, migração, recuperação e prazo | prioridade de negócio, conformidade editorial e geração de alternativas | `guardiao-de-escopo`, `revisor-de-plano` ou `explorador-de-alternativas` |
| `guardiao-de-escopo` | excesso, prioridades concorrentes, recorte de quatro meses, fora de escopo e conexão com objetivo | desenho técnico, prova adversarial e mecanismo alternativo | `revisor-viabilidade`, `revisor-adversarial` ou `explorador-de-alternativas` |
| `explorador-de-alternativas` | caminhos materialmente distintos e trade-offs quando a decisão segue aberta | reavaliar método, viabilidade detalhada ou decisão humana já fechada | `revisor-de-plano`, `revisor-viabilidade` ou consultor |

## escopo-definitivo

| Persona | Revisa | Não revisa | Encaminha para |
|---|---|---|---|
| `revisor-coerencia` | rastreabilidade objetivo→decisão→requisito→fase, contradições, órfãos e arco sistemas/loops/validação | viabilidade, prioridade/corte e falsificação de premissas | `revisor-viabilidade`, `guardiao-de-escopo` ou `revisor-adversarial` |
| `revisor-viabilidade` | exequibilidade técnica/operacional, dados, acessos, dependências, rollback e prazo | coerência documental, prioridade e alternativas estratégicas | `revisor-coerencia`, `guardiao-de-escopo` ou `revisor-adversarial` |
| `guardiao-de-escopo` | tamanho, prioridades, cinco fases, fora de escopo e vazamento de capacidade entre fases | desenho técnico, rastreabilidade fina e falsificação estrutural | `revisor-viabilidade`, `revisor-coerencia` ou `revisor-adversarial` |
| `revisor-adversarial` | falsificação de decisões estruturais, suposições frágeis, alternativas abertas e custo de reversão | checklist rotineiro de coerência, viabilidade ou tamanho | persona territorial correspondente |

## gerar-specs

| Persona | Revisa | Não revisa | Encaminha para |
|---|---|---|---|
| `analista-de-specs` | comportamento, atores, estados, caminhos de erro/recuperação, bordas e resultado terminal | corte geral da SPEC, qualidade do TDD e threat model | `revisor-specs`, `revisor-tdd-da-spec` ou `revisor-risco-seguranca` |
| `revisor-specs` | contrato, limites, dependências, degrau, corte, rastreabilidade, aceite e completude estrutural | execução do TDD, análise profunda de fluxo e segurança especializada | persona territorial correspondente |
| `revisor-tdd-da-spec` | correspondência aceite↔prova, RED/GREEN, comandos, fixtures, erro, regressão e evidência | redesenho do comportamento, corte do escopo e threat model | `analista-de-specs`, `revisor-specs` ou `revisor-risco-seguranca` |
| `revisor-risco-seguranca` | autenticação, autorização, privacidade, input não confiável, dados, idempotência, irreversibilidade e recuperação | revisão geral de fluxo, redação, corte ou cobertura TDD sem risco | persona territorial correspondente |

## gerar-tasks

| Persona | Revisa | Não revisa | Encaminha para |
|---|---|---|---|
| `revisor-decomposicao` | corte por sessão/papel/prova, independência, estado válido, pré-condições e ponto de parada | igualdade das quatro projeções e cobertura da matriz | `revisor-rastreabilidade` |
| `revisor-rastreabilidade` | IDs/status nas quatro projeções, vínculo com SPEC/subseção/critério/prova e ausência de órfãos | qualidade do corte, ordem de implementação e conteúdo da solução | `revisor-decomposicao` |

## Regra para Ethos sem subagentes

O fallback serial preserva os mesmos territórios: execute uma persona por vez, limpe conclusões
anteriores que não sejam evidência de entrada e só depois sintetize. Serial não significa pedir a
cada persona uma revisão geral.

