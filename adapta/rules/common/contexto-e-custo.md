# Contexto e custo

- Passe caminhos, fase, gate e pergunta; carregue conteúdo integral apenas quando necessário.
- Extração e consistência usam tier econômico; geração estruturada usa equilibrado; arquitetura,
  adversarial, segurança e causa raiz usam profundo.
- Resultado completo de revisor fica em `/tmp/adapta/<job>/<run-id>/`; ao pai volta resumo curto.
- A 60% de pressão, faça checkpoint; a 75%, compacte na próxima fronteira lógica; após 80%, não
  abra novo painel antes de compactar.
- Memória de sessão não contém transcript, prompt bruto, segredo nem arquivo do cliente duplicado.
