#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const PLUGIN_ROOT = path.resolve(SCRIPT_DIR, "..")
const OUTPUT = path.join(PLUGIN_ROOT, "MEMORY.md")

function readSkill(directory) {
  const file = path.join(PLUGIN_ROOT, "skills", directory, "SKILL.md")
  const body = fs.readFileSync(file, "utf8")
  const name = body.match(/^name:\s*([^\r\n]+)$/m)?.[1]?.trim()
  const rawDescription = body.match(/^description:\s*(.+)$/m)?.[1]?.trim() || ""
  const description = rawDescription.replace(/^['\"]|['\"]$/g, "")
  if (!name) throw new Error(`Skill sem name: ${file}`)
  return { name, description, path: `skills/${directory}/SKILL.md` }
}

function shortDescription(value) {
  const first = value.split(/(?<=[.!?])\s+/u)[0] || value
  return first.length > 150 ? `${first.slice(0, 147)}...` : first
}

export function renderEthosMemory() {
  const skills = fs.readdirSync(path.join(PLUGIN_ROOT, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(PLUGIN_ROOT, "skills", entry.name, "SKILL.md")))
    .map((entry) => readSkill(entry.name))
    .sort((left, right) => left.name === "skill-mind" ? -1 : right.name === "skill-mind" ? 1 : left.name.localeCompare(right.name, "pt-BR"))
  const rows = skills.map((skill) => `| \`${skill.name}\` | \`${skill.path}\` | ${shortDescription(skill.description)} |`).join("\n")

  return `# Memória persistente — Adapta

Estas são instruções ativas do assistente de codificação durante as cinco fases. Não trate este
arquivo como histórico do cliente e não grave nele prompts, transcrições, segredos ou dados
pessoais.

## Regra zero: entrar pelo SkillMind

Para qualquer pedido relacionado à consultoria, carregue primeiro \`skills/skill-mind/SKILL.md\`.
Isso vale mesmo quando o usuário invocar ou nomear outra skill diretamente. O SkillMind interpreta
o objetivo, normaliza aliases, verifica o estado do plano, expande dependências e cria o envelope
\`SKILLMIND_ENVELOPE v1\`. Skill especializada sem esse envelope deve redirecionar ao SkillMind.

Chamar uma skill significa executar seu fluxo completo. Se o Ethos não suportar encadeamento,
leia o \`SKILL.md\` e suas referências aplicáveis e execute-os inline. Se não houver subagentes,
execute as mesmas personas em série e preserve o schema; nunca omita uma revisão exigida.

## Regra de entrada: escolher a superfície de execução

Antes do primeiro trabalho do plugin, se \`ADAPTA_EXECUTION_SURFACE\` ainda não estiver registrado
na memória persistente ou no contexto da sessão, pergunte exatamente: **“Este plugin está sendo
usado no Ethos, Codex ou Claude Code?”** Aceite somente \`ETHOS\`, \`CODEX\` ou \`CLAUDE_CODE\`,
normalize a resposta e preserve-a como \`ADAPTA_EXECUTION_SURFACE\`. No Ethos, grave a escolha na
memória persistente; no Codex ou Claude Code, mantenha-a ao menos durante toda a sessão. Não
pergunte novamente enquanto o valor estiver inequívoco. Se o usuário disser que mudou de ambiente,
substitua o valor antes do próximo write.

Não detecte a superfície pela presença de conector, MCP, shell ou pasta montada. A resposta humana
é a fonte de verdade e deve constar como \`execution_surface\` no \`SKILLMIND_ENVELOPE v1\`.

## Gates que não podem ser pulados

- Executar no máximo uma task de implementação por vez.
- Rodar as provas da SPEC e pedir teste humano ao fim da task.
- Não iniciar a próxima task até o cliente dizer explicitamente que testou e autorizou o avanço.
- Falha no teste mantém a task aberta e segue para \`debugar\`.
- Gate de consultor/CSM/cliente e ação externa nunca são inferidos, exceto o write via Google Drive
  MCP autorizado abaixo quando \`ADAPTA_EXECUTION_SURFACE=ETHOS\`.
- Antes de concluir qualquer run: atualizar estado, criar checkpoint e capturar um aprendizado
  reutilizável ou registrar por que não houve aprendizado reutilizável.
- Preservar as cinco fases: 1–5 constroem sistemas com SPECs profundas; 4 e 5 acrescentam
  loops/agentes sem substituir os sistemas; 5 também valida integralmente as entregas das fases 1–5.
- Se uma SPEC exigir que o Ethos invente arquitetura, regra, dado, permissão ou aceite, parar e
  devolver para \`gerar-specs\`; não completar a lacuna por suposição.

## Persistência por superfície de execução

### \`ADAPTA_EXECUTION_SURFACE=ETHOS\`

- Localize, leia, crie e atualize todos os arquivos do projeto pelo MCP do Google Drive na pasta
  ativa do cliente. Confirme o conector e a pasta ativa antes do primeiro acesso; não use probes do
  filesystem local como substituto ou validação paralela.
- Depois de uma unidade coerente de alterações, confirme pelo MCP todos os arquivos tocados antes
  de declarar a tarefa concluída. Reutilize pasta e ID já resolvidos; atualize o arquivo existente
  sem criar cópia.
- Só informe “atualizado no Drive” depois do MCP confirmar. Se ele estiver indisponível ou falhar,
  preserve o trabalho, registre \`SINCRONIZAÇÃO PENDENTE\` e não conclua a tarefa como sincronizada.
- A autorização cobre somente criar/atualizar dentro da pasta ativa. Excluir, mover, compartilhar,
  alterar permissões ou escrever fora dela exige autorização humana explícita.

### \`ADAPTA_EXECUTION_SURFACE=CODEX\` ou \`CLAUDE_CODE\`

- Localize, leia, crie e atualize os arquivos diretamente no filesystem do workspace aberto.
- Não verifique, invoque nem use Google Drive MCP para espelhar, validar ou sincronizar arquivos do
  projeto, mesmo que o conector esteja disponível. Uma pasta montada pelo Google Drive Desktop
  continua sendo filesystem para esta regra.
- Confirme o write relendo o arquivo local e rode as provas aplicáveis. Não crie uma segunda cópia
  no Drive e não bloqueie o run por ausência de MCP.

## Comandos de entrada

- Preferencial: \`Use skill-mind: <pedido>\`.
- Em runtime com slash command: \`/adapta:skill-mind <pedido>\`.
- Alias antigo pode ser entendido, mas sempre é normalizado pelo SkillMind.

## Índice de skills

| Skill | Caminho relativo | Responsabilidade |
|---|---|---|
${rows}

## Contratos e caminhos canônicos

- Roteamento/dependências: \`contracts/skill-mind.json\`.
- Jobs e gates: \`contracts/consultor-workflows.json\`.
- Layout do cliente: \`contracts/workspace-layout.json\`.
- Fallback de subagentes: \`contracts/subagents.json\`.
- Resolução portátil dos scripts: \`references/runtime-paths.md\`.
- Escopo base: \`03-Projeto/01-Escopo.md\`.
- Escopo definitivo: \`03-Projeto/02-Escopo-Definitivo.md\`.
- Setup do agente e dos loops: \`03-Projeto/03-Setup-Ethos/\`.
- Tasks/SPECs da fase: \`03-Projeto/02-Plano_de_acao/0N.Fase_N/\`.
- Estado confiável: \`STATUS.md\`, \`changelog.md\` e \`.adapta/checks/\`.
- Ledger do SkillMind: \`.adapta/orquestracao/\`.
- Checkpoint histórico, não instrução ativa: \`.adapta/memory/latest.json\`.

## Recuperação sem hooks

Use o cron apenas para detectar runs abandonados e solicitar retomada. Resolva a raiz a partir de
\`skills/skill-mind/SKILL.md\` conforme \`references/runtime-paths.md\`, execute
\`scripts/skill-mind-run.mjs\` em modo \`recover\`, passe o plano já resolvido como workspace e use
30 minutos com escrita do relatório. Nunca peça ao usuário o caminho do plugin ou da metodologia.

O cron não aprova teste, não promove aprendizado e não publica. Ao encontrar pendência, carregue o
SkillMind e retome do último artefato validado.
`
}

function main() {
  const mode = process.argv[2] || "--check"
  const rendered = renderEthosMemory()
  if (mode === "--write") {
    fs.writeFileSync(OUTPUT, rendered, "utf8")
    console.log(OUTPUT)
    return
  }
  if (mode === "--check") {
    if (!fs.existsSync(OUTPUT) || fs.readFileSync(OUTPUT, "utf8") !== rendered) {
      console.error("MEMORY.md esta ausente ou desatualizado; rode build-ethos-memory.mjs --write")
      process.exitCode = 1
      return
    }
    console.log("MEMORY.md sincronizado")
    return
  }
  throw new Error("Use --write ou --check")
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
