import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

const ROOT = path.resolve(import.meta.dirname, "..")
const PLUGIN = path.join(ROOT, "adapta")

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), "utf8")
}

function listFiles(root) {
  const files = []
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name)
    if (entry.isDirectory()) files.push(...listFiles(file))
    else files.push(file)
  }
  return files
}

test("manifests usam a mesma versao e o nome da pasta", () => {
  const claude = JSON.parse(read("adapta/.claude-plugin/plugin.json"))
  const codex = JSON.parse(read("adapta/.codex-plugin/plugin.json"))
  const marketplace = JSON.parse(read(".claude-plugin/marketplace.json"))
  assert.equal(claude.name, "adapta")
  assert.equal(codex.name, "adapta")
  assert.match(claude.version, /^0\.9\.5$/)
  assert.equal(codex.version, claude.version)
  assert.equal(marketplace.metadata.version, claude.version)
  assert.equal(codex.skills, "./skills/")
})

test("skills canonicas usam o nome do diretorio", () => {
  const skillsRoot = path.join(PLUGIN, "skills")
  for (const entry of fs.readdirSync(skillsRoot, { withFileTypes: true }).filter((item) => item.isDirectory())) {
    const file = path.join(skillsRoot, entry.name, "SKILL.md")
    assert.ok(fs.existsSync(file), `SKILL.md ausente: ${entry.name}`)
    const body = fs.readFileSync(file, "utf8")
    assert.match(body, new RegExp(`^name: ${entry.name}$`, "m"))
  }
  for (const legacy of ["gerar-proposta", "revisar-proposta", "escopo-final"]) {
    assert.equal(fs.existsSync(path.join(skillsRoot, legacy)), false, `skill antiga ainda existe: ${legacy}`)
  }
})

test("workflows apontam para skills existentes e usam somente o layout atual", () => {
  const contract = JSON.parse(read("adapta/contracts/consultor-workflows.json"))
  const defaults = JSON.parse(read("adapta/.codex-plugin/plugin.json")).interface.defaultPrompt.join("\n")
  assert.equal(contract.schemaVersion, "adapta-consultor-workflows/v2")
  assert.ok(fs.existsSync(path.join(PLUGIN, contract.orchestrator)))
  assert.ok(fs.existsSync(path.join(PLUGIN, contract.routing)))
  assert.match(defaults, /skill-mind/i)
  assert.match(defaults, /SKILLMIND_ENVELOPE v1/)
  assert.match(defaults, /ADAPTA_EXECUTION_SURFACE/)
  assert.match(defaults, /Ethos, Codex ou Claude Code/)
  assert.match(defaults, /Nos perfis Codex e Claude Code.*nunca verifique ou use Google Drive MCP/i)
  for (const [name, job] of Object.entries(contract.jobs)) {
    assert.ok(fs.existsSync(path.join(PLUGIN, job.skill)), `${name}: skill ausente`)
    assert.ok(job.outputs.length > 0, `${name}: outputs ausentes`)
  }
  const serialized = JSON.stringify(contract)
  for (const legacy of ["01_contexto/", "02_reunioes/", "03_discovery/", "04_plano/", "05_execucao/", "07_resultado/", "check-input"]) {
    assert.doesNotMatch(serialized, new RegExp(legacy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `path legado no workflow: ${legacy}`)
  }
})

test("contrato de layout reflete a arvore Plano atual", () => {
  const layout = JSON.parse(read("adapta/contracts/workspace-layout.json"))
  assert.equal(layout.schemaVersion, "adapta-workspace-layout/v2")
  assert.equal(layout.artifacts.baseScope, "03-Projeto/01-Escopo.md")
  assert.equal(layout.artifacts.definitiveScope, "03-Projeto/02-Escopo-Definitivo.md")
  assert.equal(layout.artifacts.ethosSetup, "03-Projeto/03-Setup-Ethos/")
  assert.equal(layout.artifacts.ethosSoul, "03-Projeto/03-Setup-Ethos/SOUL.md")
  assert.equal(layout.artifacts.ethosIdentity, "03-Projeto/03-Setup-Ethos/IDENTITY.md")
  assert.equal(layout.artifacts.ethosUser, "03-Projeto/03-Setup-Ethos/USER.md")
  assert.equal(layout.artifacts.meetings, "02-Reuniao/")
  assert.equal(layout.artifacts.phaseTasks, "03-Projeto/02-Plano_de_acao/0N.Fase_N/00-Tasks_Gerais.md")
  assert.equal(layout.internal.checks, ".adapta/checks/")
  assert.equal(layout.internal.orchestration, ".adapta/orquestracao/")
  assert.ok(layout.removed.includes("check-input.md"))
})

test("contratos preservam o metodo e acrescentam a arquitetura Ethos", () => {
  const workflow = read("adapta/contracts/consultor-workflows.json")
  const scope = read("adapta/skills/escopo-definitivo/references/contrato-fases-ethos.md")
  const specs = read("adapta/skills/gerar-specs/references/contrato-spec.md")
  assert.match(workflow, /gerar-setup-ethos/)
  assert.match(scope, /Fases 1–5 — evoluir os sistemas/)
  assert.match(scope, /Fases 4 e 5 — acrescentar loops de valor/)
  assert.match(scope, /Fase 5 — concluir sistemas, loops e validação/)
  assert.match(read("adapta/skills/gerar-specs/SKILL.md"), /ao menos uma\s+SPEC de sistema/)
  assert.match(specs, /escolher arquitetura, inventar regra, adivinhar campo, ampliar/)
})

test("paineis compartilham calibracao de gravidade e territorios exclusivos", () => {
  const subagents = JSON.parse(read("adapta/contracts/subagents.json"))
  const calibration = read(path.join("adapta", subagents.severityCalibration))
  const territories = read(path.join("adapta", subagents.territoryContract))
  const template = read("adapta/references/subagent-template.md")
  assert.match(calibration, /Gravidade mede o\s+impacto/)
  for (const severity of ["grave", "moderado", "baixo"]) assert.ok(calibration.includes(`| \`${severity}\` |`))
  for (const panelName of ["definir-requisitos", "revisar-escopo", "escopo-definitivo", "gerar-specs", "gerar-tasks"]) {
    const panel = subagents.panels[panelName]
    assert.equal(panel.territorySection, panelName)
    assert.match(territories, new RegExp(`## ${panelName}\\b`))
    for (const member of panel.members) assert.ok(territories.includes(`| \`${member.id}\` |`), `${panelName}: território ausente para ${member.id}`)
  }
  assert.match(template, /\{\{territory\}\}/)
  assert.match(template, /\{\{exclusions\}\}/)
  assert.match(template, /\{\{handoff_to\}\}/)
  const schemas = [
    "adapta/skills/definir-requisitos/schemas/revisao-requisitos.schema.json",
    "adapta/skills/escopo-definitivo/schemas/revisao-escopo.schema.json",
    "adapta/skills/gerar-specs/schemas/revisao-spec.schema.json",
    "adapta/skills/gerar-tasks/schemas/revisao-tasks.schema.json",
    "adapta/skills/revisar-escopo/schemas/achado-revisao-escopo.schema.json"
  ].map((file) => JSON.parse(read(file)))
  function severityEnums(node, found = []) {
    if (!node || typeof node !== "object") return found
    for (const [key, value] of Object.entries(node)) {
      if (["severity", "gravidade"].includes(key) && Array.isArray(value?.enum)) found.push(value.enum)
      severityEnums(value, found)
    }
    return found
  }
  for (const schema of schemas) {
    const enums = severityEnums(schema)
    assert.ok(enums.length > 0)
    for (const values of enums) assert.deepEqual(new Set(values), new Set(["grave", "moderado", "baixo"]))
  }
})

test("runtime resolve scripts pelo bundle sem pedir caminho da metodologia", () => {
  const runtimePaths = read("adapta/references/runtime-paths.md")
  assert.match(runtimePaths, /Parta do caminho real do `SKILL\.md`/)
  assert.match(runtimePaths, /contracts\/skill-mind\.json/)
  assert.match(runtimePaths, /scripts\/skill-mind-run\.mjs/)

  const runtimeText = [
    "adapta/MEMORY.md",
    "adapta/README.md",
    "adapta/skills/skill-mind/SKILL.md",
    "adapta/skills/skill-mind/references/ethos-legacy.md",
    "adapta/skills/liberar-fase/SKILL.md",
    "adapta/skills/sincronizar-cliente/SKILL.md"
  ].map(read).join("\n")
  const oldPluginRootPlaceholder = "<" + "plugin-root>"
  const oldMethodPathPlaceholder = "<" + "caminho-metodologia>"
  assert.ok(!runtimeText.includes(oldPluginRootPlaceholder))
  assert.ok(!runtimeText.includes(oldMethodPathPlaceholder))
  assert.doesNotMatch(runtimeText, /node\s+[^\n]*plugins[\\/]adapta[\\/]scripts/i)
})

test("MEMORY bifurca persistencia entre Ethos, Codex e Claude Code", () => {
  const memory = read("adapta/MEMORY.md")
  const builder = read("adapta/scripts/build-ethos-memory.mjs")
  for (const body of [memory, builder]) {
    assert.match(body, /Regra de entrada: escolher a superfície de execução/)
    assert.match(body, /Este plugin está sendo\s+usado no Ethos, Codex ou Claude Code\?/)
    assert.match(body, /ADAPTA_EXECUTION_SURFACE=ETHOS/)
    assert.match(body, /ADAPTA_EXECUTION_SURFACE=CODEX/)
    assert.match(body, /não verifique, invoque nem use Google Drive MCP para espelhar, validar ou sincronizar arquivos do\s+projeto/i)
    assert.match(body, /SINCRONIZAÇÃO PENDENTE/)
    assert.doesNotMatch(body, /Sincronização obrigatória com Google Drive/)
  }

  const contract = JSON.parse(read("adapta/contracts/skill-mind.json"))
  assert.equal(contract.executionSurfaces.ethos.projectFiles, "google-drive-mcp")
  assert.equal(contract.executionSurfaces.codex.projectFiles, "filesystem")
  assert.equal(contract.executionSurfaces["claude-code"].googleDriveMcpForProjectFiles, false)
  assert.ok(contract.envelope.required.includes("execution_surface"))
})

test("JSON e referencias locais do contrato sao validos", () => {
  for (const file of listFiles(PLUGIN).filter((item) => item.endsWith(".json"))) {
    assert.doesNotThrow(() => JSON.parse(fs.readFileSync(file, "utf8")), path.relative(ROOT, file))
  }
  const subagents = JSON.parse(read("adapta/contracts/subagents.json"))
  for (const panel of Object.values(subagents.panels)) {
    for (const member of panel.members) {
      assert.ok(fs.existsSync(path.join(PLUGIN, member.persona)), member.persona)
      assert.ok(fs.existsSync(path.join(PLUGIN, member.schema)), member.schema)
    }
  }
})
