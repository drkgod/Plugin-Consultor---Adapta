import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import { renderEthosMemory } from "../adapta/scripts/build-ethos-memory.mjs"
import { buildRunPlan, finishRun, recoverRuns, startRun, updateStage } from "../adapta/scripts/skill-mind-run.mjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const PLUGIN = path.join(ROOT, "adapta")

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "adapta-skill-mind-"))
  const plan = path.join(root, "Plano — teste")
  fs.mkdirSync(path.join(plan, "03-Projeto"), { recursive: true })
  fs.writeFileSync(path.join(plan, "STATUS.md"), "# STATUS\n", "utf8")
  fs.writeFileSync(path.join(plan, "changelog.md"), "# Changelog\n", "utf8")
  return plan
}

test("contrato do SkillMind cobre todas as skills especializadas", () => {
  const contract = JSON.parse(fs.readFileSync(path.join(PLUGIN, "contracts", "skill-mind.json"), "utf8"))
  const skills = fs.readdirSync(path.join(PLUGIN, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "skill-mind")
    .map((entry) => entry.name)
    .sort()
  assert.deepEqual(Object.keys(contract.routes).sort(), skills)
  for (const route of Object.values(contract.routes)) {
    for (const stages of Object.values(route.variants)) {
      for (const stage of stages) assert.ok(skills.includes(stage.job), `Etapa sem skill: ${stage.job}`)
    }
  }
})

test("skills especializadas exigem envelope e redirecionam ao SkillMind", () => {
  const skillsRoot = path.join(PLUGIN, "skills")
  for (const entry of fs.readdirSync(skillsRoot, { withFileTypes: true }).filter((item) => item.isDirectory() && item.name !== "skill-mind")) {
    const body = fs.readFileSync(path.join(skillsRoot, entry.name, "SKILL.md"), "utf8")
    assert.match(body, /SKILLMIND_ENVELOPE v1/, entry.name)
    assert.match(body, /\.\.\/skill-mind\/SKILL\.md/, entry.name)
  }
})

test("rota profunda de analise critica expande dependencias antes da sintese", () => {
  const plan = buildRunPlan({ job: "analise-critica", variant: "profunda" })
  assert.deepEqual(plan.stages.map((stage) => stage.job), [
    "gerar-escopo",
    "aprendizado-continuo",
    "idear-direcoes",
    "definir-requisitos",
    "revisar-escopo",
    "conselho-de-decisao",
    "analise-critica"
  ])
  assert.equal(plan.stages.at(-1).mode, "synthesize")
})

test("aliases antigos sao normalizados pelo orquestrador", () => {
  const plan = buildRunPlan({ job: "gerar-proposta" })
  assert.equal(plan.normalizedJob, "gerar-escopo")
})

test("ledger recusa conclusao sem aprendizado e sem teste humano", () => {
  const workspace = fixture()
  const started = startRun({ workspace, job: "gerar-escopo", humanTestRequired: true, runId: "run-test-001" })
  updateStage({ workspace, runId: started.run.runId, stageIndex: 0, status: "completed", evidence: ["03-Projeto/01-Escopo.md"] })
  assert.throws(() => finishRun({ workspace, runId: started.run.runId, outcome: "completed" }), /learning-status/)
  assert.throws(() => finishRun({
    workspace,
    runId: started.run.runId,
    outcome: "completed",
    learningStatus: "not-reusable",
    reason: "Apenas geracao rotineira sem causa raiz nova."
  }), /Teste humano explicito/)
  const finished = finishRun({
    workspace,
    runId: started.run.runId,
    outcome: "completed",
    learningStatus: "not-reusable",
    reason: "Apenas geracao rotineira sem causa raiz nova.",
    humanTest: "confirmed"
  })
  assert.equal(finished.run.status, "completed")
  assert.equal(finished.run.learning.status, "not-reusable")
})

test("ledger aceita referencia capturada somente na area de aprendizados", () => {
  const workspace = fixture()
  const invalid = startRun({ workspace, job: "gerar-escopo", runId: "run-learning-bad" })
  updateStage({ workspace, runId: invalid.run.runId, stageIndex: 0, status: "completed" })
  assert.throws(() => finishRun({
    workspace,
    runId: invalid.run.runId,
    outcome: "completed",
    learningStatus: "captured",
    learningRef: "STATUS.md"
  }), /\.adapta\/aprendizados/)

  const valid = startRun({ workspace, job: "gerar-escopo", runId: "run-learning-good" })
  updateStage({ workspace, runId: valid.run.runId, stageIndex: 0, status: "completed" })
  const candidate = path.join(workspace, ".adapta", "aprendizados", "candidatos", "AP-001.json")
  fs.mkdirSync(path.dirname(candidate), { recursive: true })
  fs.writeFileSync(candidate, "{}\n", "utf8")
  const finished = finishRun({
    workspace,
    runId: valid.run.runId,
    outcome: "completed",
    learningStatus: "captured",
    learningRef: ".adapta/aprendizados/candidatos/AP-001.json"
  })
  assert.equal(finished.run.learning.reference, ".adapta/aprendizados/candidatos/AP-001.json")
})

test("recover encontra run interrompido e grava relatorio", () => {
  const workspace = fixture()
  startRun({ workspace, job: "debugar", runId: "run-recovery-001" })
  const report = recoverRuns({ workspace, olderThanMinutes: 0, write: true })
  assert.equal(report.pending.length, 1)
  assert.equal(report.pending[0].runId, "run-recovery-001")
  assert.ok(fs.existsSync(path.join(workspace, ".adapta", "orquestracao", "recovery.json")))
})

test("MEMORY.md e gerado do indice real de skills", () => {
  const file = fs.readFileSync(path.join(PLUGIN, "MEMORY.md"), "utf8")
  assert.equal(file, renderEthosMemory())
  assert.match(file, /Regra zero: entrar pelo SkillMind/)
  for (const entry of fs.readdirSync(path.join(PLUGIN, "skills"), { withFileTypes: true }).filter((item) => item.isDirectory())) {
    assert.ok(file.includes("| `" + entry.name + "` |"), entry.name)
  }
})
