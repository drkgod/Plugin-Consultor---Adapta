import assert from "node:assert/strict"
import crypto from "node:crypto"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import { buildContextBrief } from "../adapta/scripts/context-brief.mjs"
import { buildCheckpoint } from "../adapta/scripts/context-checkpoint.mjs"
import { buildHandoffPlan, executeHandoff } from "../adapta/scripts/preparar-handoff-cliente.mjs"
import { buildPhaseReleasePlan, snapshotActivePhase } from "../adapta/scripts/preparar-liberacao-fase.mjs"
import { buildMethodReport } from "../adapta/scripts/relatorio-metodo.mjs"
import { writeMeetingBundle } from "../adapta/scripts/tldv-sync.mjs"
import { PLAN_PATHS, phasePaths, resolvePlanRoot } from "../adapta/scripts/workspace-layout.mjs"

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "adapta-layout-"))
}

function write(file, body = "") {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, body, "utf8")
}

function hash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")
}

function digestFiles(root, files) {
  const inventory = files
    .map((file) => ({ path: path.relative(root, file).replaceAll(path.sep, "/"), sha256: hash(file) }))
    .sort((left, right) => left.path.localeCompare(right.path))
  return crypto.createHash("sha256").update(JSON.stringify(inventory)).digest("hex")
}

function approvedCheck(label) {
  return `# Check: ${label}\n\n**Data:** 2026-08-10\n**Validadores:** Consultor e CSM\n**O que foi validado:** artefatos atuais\n\n## Resultado\n- [x] APROVADO — pode avançar\n- [ ] APROVADO COM RESSALVAS — avançar tratando pendências\n- [ ] REPROVADO — voltar\n\n## O que foi conferido\n- Evidência concreta revisada\n\n## Pendências geradas\n- Nenhuma\n`
}

function phaseTasks() {
  return `# Fase 1 — Tarefas gerais\n\n## Tasks\n\n| ID | Task | Dono | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições | Status |\n|---|---|---|---|---|---|---|---|---|\n| F1-T01 | Executar fluxo | Champion | SPEC-001 | Fluxo registrado | principal | captura | acesso | aberta |\n`
}

function fixture() {
  const root = tempDir()
  const client = path.join(root, "Cliente")
  const plan = path.join(client, "Plano — abc123")
  const phase = phasePaths(plan, 1)
  write(path.join(plan, PLAN_PATHS.status), "# STATUS\n\n**Fase:** 1\n**Próxima ação segura:** gerar SPECs\n")
  write(path.join(plan, PLAN_PATHS.changelog), "# Changelog\n")
  write(path.join(plan, PLAN_PATHS.baseScope), "# Escopo base\n")
  write(path.join(plan, PLAN_PATHS.definitiveScope), "# Escopo definitivo\n")
  write(phase.tasks, phaseTasks())
  write(phase.taskList, "# Fase 1 — Tarefas\n\n- [ ] Executar fluxo <!-- id:11111111-1111-1111-1111-111111111111 -->\n")
  write(phase.specIndex, "# Índice de SPECs\n")
  const spec = path.join(phase.specs, "spec-001.md")
  write(spec, "# SPEC-001\n\n## TDD da SPEC\n\n## Tasks vinculadas\n")
  const meetingRelative = "02-Reuniao/Consultoria Call/01. 10.08.2026 - Corte/02_ata.md"
  const meeting = path.join(plan, ...meetingRelative.split("/"))
  write(meeting, "# Ata de corte\n")
  const checks = path.join(plan, PLAN_PATHS.checks)
  write(path.join(checks, "check-escopo.md"), approvedCheck("escopo"))
  write(path.join(checks, "check-cliente.md"), approvedCheck("cliente"))
  const receipt = `# Recibo\n\n**Data:** 2026-08-10\n**Reuniao de corte:** ${meetingRelative}\n**Ajustes incorporados:** SIM\n**Revalidacao:** APROVADA\n\n## Versões revalidadas\n\n- Escopo base: sha256=${hash(path.join(plan, PLAN_PATHS.baseScope))}\n- Escopo definitivo: sha256=${hash(path.join(plan, PLAN_PATHS.definitiveScope))}\n- Tasks fase 1: sha256=${hash(phase.tasks)}\n- SPECs fase 1: sha256-set=${digestFiles(plan, [spec])}\n`
  write(path.join(checks, "recibo-handoff-cliente.md"), receipt)
  const template = path.join(root, "template")
  write(path.join(template, "README.md"), "# Cliente\n")
  return { root, client, plan, phase, template }
}

test("resolve a raiz quando o cwd e o plano ou a pasta do cliente", () => {
  const data = fixture()
  assert.equal(resolvePlanRoot(data.plan), data.plan)
  assert.equal(resolvePlanRoot(data.client), data.plan)
})

test("falha com dois planos para nao escolher cliente errado", () => {
  const data = fixture()
  write(path.join(data.client, "Plano — outro", "03-Projeto", "01-Escopo.md"), "# Outro\n")
  assert.throws(() => resolvePlanRoot(data.client), /Mais de um Plano/)
})

test("brief e checkpoint usam STATUS e controles do plano resolvido", () => {
  const data = fixture()
  const brief = buildContextBrief({ workspace: data.client, job: "teste" })
  assert.equal(brief.workspace, data.plan)
  assert.ok(brief.paths.includes("03-Projeto/decisoes-do-projeto.md".replaceAll("/", path.sep)) || brief.paths.includes("03-Projeto/decisoes-do-projeto.md"))
  const checkpoint = buildCheckpoint({ workspace: data.client, reason: "teste" })
  assert.equal(checkpoint.workspace, data.plan)
  assert.ok(checkpoint.sourceOfTruth.some((item) => item.includes(".adapta")))
  assert.equal(checkpoint.gateStates.length, 2)
})

test("tldv grava categoria e nomes reais de manifest e indice", () => {
  const data = fixture()
  const bundle = {
    meeting: { id: "meeting-1", name: "Mapeamento", happenedAt: "2026-08-10T14:00:00.000Z", url: "https://tldv.io/app/meetings/meeting-1" },
    transcript: { meetingId: "meeting-1", data: [{ startTime: 0, speaker: "Ana", text: "Teste" }] },
    highlights: { meetingId: "meeting-1", data: [] },
    notes: { structuredNotes: [], markdownContent: "", topics: [] }
  }
  const result = writeMeetingBundle({ bundle, outputRoot: path.join(data.plan, PLAN_PATHS.meetings), category: "Consultoria Call" })
  assert.equal(result.categoria, "Consultoria Call")
  assert.ok(fs.existsSync(path.join(data.plan, PLAN_PATHS.meetingIndex)))
  const manifest = JSON.parse(fs.readFileSync(path.join(data.plan, PLAN_PATHS.tldvManifest), "utf8"))
  assert.equal(manifest.meetings[0].categoria, "Consultoria Call")
  assert.match(manifest.meetings[0].folder, /^Consultoria Call\/01\./)
})

test("handoff le o escopo e a fase no layout atual", () => {
  const data = fixture()
  const clientRoot = path.join(data.root, "exportado")
  const plan = buildHandoffPlan({ consultantRoot: data.client, clientRoot, templateRoot: data.template, phaseNumber: 1 })
  assert.equal(plan.consultantRoot, data.plan)
  assert.ok(plan.copies.some((copy) => copy.source === data.phase.tasks && copy.target.endsWith(path.join("04_fase-atual", "fase.md"))))
  assert.ok(plan.copies.some((copy) => copy.source.endsWith("spec-001.md")))
})

test("relatorio e liberacao usam controles internos e diretorios da fase atual", () => {
  const data = fixture()
  const receipt = {
    taskId: "F1-T01",
    status: "aprovada",
    criteria: [{ criterion: "Fluxo registrado", passed: true, proof: "captura" }],
    evidence: ["captura"],
    residualRisks: []
  }
  write(path.join(data.plan, PLAN_PATHS.taskReceipts, "fase-1--f1-t01.json"), `${JSON.stringify(receipt)}\n`)
  write(path.join(data.plan, PLAN_PATHS.debtLedger), "# Dívidas\n\n- adapta-divida: exemplo\n")
  const report = buildMethodReport({ workspace: data.client })
  assert.equal(report.total, 1)
  assert.match(report.sources.receipts, /^\.adapta/)

  const clientRoot = path.join(data.root, "exportado")
  executeHandoff(buildHandoffPlan({ consultantRoot: data.client, clientRoot, templateRoot: data.template, phaseNumber: 1 }))
  const activeDigest = snapshotActivePhase(clientRoot).activeDigest
  const phase2 = phasePaths(data.plan, 2)
  write(phase2.tasks, phaseTasks().replaceAll("Fase 1", "Fase 2").replaceAll("F1-", "F2-"))
  write(phase2.specIndex, "# Índice de SPECs\n")
  write(path.join(phase2.specs, "spec-002.md"), "# SPEC-002\n\n## TDD da SPEC\n\n## Tasks vinculadas\n")
  write(path.join(data.plan, PLAN_PATHS.evolutions, "delta-fase-2.md"), "# Delta fase 2\n")
  const phaseCheck = approvedCheck("fase 1").replace("**O que foi validado:** artefatos atuais", `**O que foi validado:** active-sha256=${activeDigest}`)
  write(path.join(data.plan, PLAN_PATHS.checks, "check-fase-1.md"), phaseCheck)
  const release = buildPhaseReleasePlan({ consultantRoot: data.client, clientRoot, fromPhase: 1, toPhase: 2 })
  assert.equal(release.consultantRoot, data.plan)
  assert.equal(release.to, 2)
  assert.ok(release.copies.some((copy) => copy.source === phase2.tasks))
})
