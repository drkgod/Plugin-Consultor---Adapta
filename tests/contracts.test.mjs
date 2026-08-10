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
  assert.equal(claude.version, "0.8.0")
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
  assert.equal(layout.artifacts.meetings, "02-Reuniao/")
  assert.equal(layout.artifacts.phaseTasks, "03-Projeto/02-Plano_de_acao/0N.Fase_N/00-Tasks_Gerais.md")
  assert.equal(layout.internal.checks, ".adapta/checks/")
  assert.equal(layout.internal.orchestration, ".adapta/orquestracao/")
  assert.ok(layout.removed.includes("check-input.md"))
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
