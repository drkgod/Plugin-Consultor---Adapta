#!/usr/bin/env node
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { redactSensitive } from "./redact-sensitive.mjs"
import { PLAN_PATHS, resolvePlanRoot } from "./workspace-layout.mjs"

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const CONTRACT = JSON.parse(fs.readFileSync(path.join(SCRIPT_DIR, "..", "contracts", "skill-mind.json"), "utf8"))
const COMPATIBILITY = JSON.parse(fs.readFileSync(path.join(SCRIPT_DIR, "..", "contracts", "compatibility.json"), "utf8"))
const TERMINAL_STAGES = new Set(["completed", "skipped"])
const OUTCOMES = new Set(["completed", "blocked", "failed"])
const STEP_STATUSES = new Set(["completed", "skipped", "blocked", "failed"])
const LEARNING_STATUSES = new Set(["captured", "not-reusable"])

function safe(value, max = 2000) {
  return redactSensitive(String(value || "")).slice(0, max)
}

function normalizeJob(requested) {
  const value = safe(requested, 100).trim().toLowerCase()
  if (CONTRACT.routes[value]) return value
  const alias = COMPATIBILITY.aliases[value]
  if (alias?.target && CONTRACT.routes[alias.target]) return alias.target
  throw new Error(`Job desconhecido: ${requested}`)
}

export function buildRunPlan({ job, variant }) {
  const normalizedJob = normalizeJob(job)
  const route = CONTRACT.routes[normalizedJob]
  const selectedVariant = variant || route.defaultVariant
  const stages = route.variants[selectedVariant]
  if (!stages) throw new Error(`Variante invalida para ${normalizedJob}: ${selectedVariant}`)
  return {
    schemaVersion: "adapta-skill-mind-plan/v1",
    requestedJob: safe(job, 100),
    normalizedJob,
    variant: selectedVariant,
    stages: stages.map((stage, index) => ({ index, ...stage, status: "pending", evidence: [] })),
    finalizers: CONTRACT.finalizers
  }
}

function newRunId() {
  const stamp = new Date().toISOString().replace(/[-:.]/g, "").replace("Z", "Z")
  return `${stamp}-${crypto.randomBytes(4).toString("hex")}`
}

function orchestrationRoot(planRoot) {
  return path.join(planRoot, PLAN_PATHS.orchestration)
}

function runFile(planRoot, runId) {
  if (!/^[A-Za-z0-9._-]{8,100}$/.test(runId)) throw new Error("run-id invalido")
  return path.join(orchestrationRoot(planRoot), "runs", `${runId}.json`)
}

function assertSafeDirectory(directory, planRoot) {
  const resolved = path.resolve(directory)
  const root = path.resolve(planRoot)
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) throw new Error("Destino fora do plano")
  const relativeParts = path.relative(root, resolved).split(path.sep).filter(Boolean)
  let cursor = root
  for (const part of relativeParts) {
    cursor = path.join(cursor, part)
    if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`Link simbolico proibido: ${cursor}`)
  }
}

function writeJsonAtomic(file, data, planRoot) {
  const directory = path.dirname(file)
  assertSafeDirectory(directory, planRoot)
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 })
  assertSafeDirectory(directory, planRoot)
  const temporary = path.join(directory, `.${path.basename(file)}.${crypto.randomUUID()}.tmp`)
  fs.writeFileSync(temporary, `${JSON.stringify(data, null, 2)}\n`, { flag: "wx", mode: 0o600 })
  try {
    fs.renameSync(temporary, file)
  } catch (error) {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary)
    throw error
  }
  fs.chmodSync(file, 0o600)
}

function readRun(planRoot, runId) {
  const file = runFile(planRoot, runId)
  if (!fs.existsSync(file) || fs.lstatSync(file).isSymbolicLink() || !fs.lstatSync(file).isFile()) {
    throw new Error(`Run ausente ou inseguro: ${runId}`)
  }
  const run = JSON.parse(fs.readFileSync(file, "utf8"))
  if (run.schemaVersion !== "adapta-skill-mind-run/v1" || run.runId !== runId || run.workspace !== planRoot) {
    throw new Error(`Ledger invalido: ${runId}`)
  }
  return { file, run }
}

function addEvent(run, type, details = {}) {
  run.updatedAt = new Date().toISOString()
  run.events.push({ at: run.updatedAt, type, ...details })
}

export function startRun({ workspace, job, variant, runtime = "ethos-legacy", humanTestRequired = false, runId }) {
  if (!CONTRACT.runtimeProfiles[runtime]) throw new Error(`Perfil de runtime desconhecido: ${runtime}`)
  const planRoot = resolvePlanRoot(workspace)
  const plan = buildRunPlan({ job, variant })
  const id = runId || newRunId()
  const file = runFile(planRoot, id)
  if (fs.existsSync(file)) throw new Error(`Run ja existe: ${id}`)
  const now = new Date().toISOString()
  const run = {
    schemaVersion: "adapta-skill-mind-run/v1",
    runId: id,
    workspace: planRoot,
    requestedJob: plan.requestedJob,
    normalizedJob: plan.normalizedJob,
    variant: plan.variant,
    runtimeProfile: runtime,
    status: "active",
    startedAt: now,
    updatedAt: now,
    stages: plan.stages,
    humanTest: { required: Boolean(humanTestRequired), status: humanTestRequired ? "pending" : "not-applicable" },
    learning: { status: "pending", reference: null, reason: null },
    events: [{ at: now, type: "run-started" }]
  }
  writeJsonAtomic(file, run, planRoot)
  return { file, run }
}

export function updateStage({ workspace, runId, stageIndex, status, evidence = [] }) {
  if (!STEP_STATUSES.has(status)) throw new Error(`Status de etapa invalido: ${status}`)
  const planRoot = resolvePlanRoot(workspace)
  const { file, run } = readRun(planRoot, runId)
  if (run.status !== "active") throw new Error(`Run nao esta ativo: ${run.status}`)
  const index = Number(stageIndex)
  if (!Number.isInteger(index) || !run.stages[index]) throw new Error(`Indice de etapa invalido: ${stageIndex}`)
  const firstPending = run.stages.findIndex((stage) => !TERMINAL_STAGES.has(stage.status))
  if (index !== firstPending) throw new Error(`Etapas devem ser fechadas em ordem; proxima etapa: ${firstPending}`)
  run.stages[index].status = status
  run.stages[index].evidence = evidence.map((item) => safe(item, 500)).filter(Boolean).slice(0, 20)
  run.stages[index].completedAt = new Date().toISOString()
  addEvent(run, "stage-updated", { stageIndex: index, job: run.stages[index].job, status })
  writeJsonAtomic(file, run, planRoot)
  return { file, run }
}

function resolveLearningReference(planRoot, reference) {
  const relative = safe(reference, 500).replaceAll("/", path.sep)
  const absolute = path.resolve(planRoot, relative)
  const learningRoot = path.resolve(planRoot, PLAN_PATHS.learnings)
  if (absolute !== learningRoot && !absolute.startsWith(`${learningRoot}${path.sep}`)) {
    throw new Error("Referencia capturada deve estar em .adapta/aprendizados/")
  }
  if (!fs.existsSync(absolute) || fs.lstatSync(absolute).isSymbolicLink() || !fs.lstatSync(absolute).isFile()) {
    throw new Error(`Candidato de aprendizado ausente: ${relative}`)
  }
  return path.relative(planRoot, absolute).replaceAll(path.sep, "/")
}

export function finishRun({ workspace, runId, outcome, learningStatus, learningRef, reason, humanTest }) {
  if (!OUTCOMES.has(outcome)) throw new Error(`Resultado invalido: ${outcome}`)
  if (!LEARNING_STATUSES.has(learningStatus)) throw new Error("Fechamento exige learning-status captured ou not-reusable")
  const planRoot = resolvePlanRoot(workspace)
  const { file, run } = readRun(planRoot, runId)
  if (run.status !== "active") throw new Error(`Run nao esta ativo: ${run.status}`)

  if (outcome === "completed" && run.stages.some((stage) => !TERMINAL_STAGES.has(stage.status))) {
    throw new Error("Run concluido ainda possui etapas pendentes, bloqueadas ou falhas")
  }
  const humanStatus = humanTest || run.humanTest.status
  if (run.humanTest.required && outcome === "completed" && humanStatus !== "confirmed") {
    throw new Error("Teste humano explicito e obrigatorio antes da conclusao")
  }
  if (!run.humanTest.required && !["not-applicable", "confirmed"].includes(humanStatus)) {
    throw new Error("Status de teste humano invalido")
  }

  let reference = null
  let learningReason = null
  if (learningStatus === "captured") reference = resolveLearningReference(planRoot, learningRef)
  if (learningStatus === "not-reusable") {
    learningReason = safe(reason, 1000).trim()
    if (learningReason.length < 10) throw new Error("Explique por que o run nao gerou aprendizado reutilizavel")
  }

  run.status = outcome
  run.humanTest.status = humanStatus
  run.learning = { status: learningStatus, reference, reason: learningReason }
  run.finishedAt = new Date().toISOString()
  addEvent(run, "run-finished", { outcome, learningStatus, humanTest: humanStatus })
  writeJsonAtomic(file, run, planRoot)
  return { file, run }
}

export function recoverRuns({ workspace, olderThanMinutes = 30, write = false, now = Date.now() }) {
  const planRoot = resolvePlanRoot(workspace)
  const directory = path.join(orchestrationRoot(planRoot), "runs")
  const threshold = Number(olderThanMinutes)
  if (!Number.isFinite(threshold) || threshold < 0) throw new Error("older-than-minutes invalido")
  const pending = []
  if (fs.existsSync(directory)) {
    assertSafeDirectory(directory, planRoot)
    for (const entry of fs.readdirSync(directory).filter((name) => name.endsWith(".json")).sort()) {
      const file = path.join(directory, entry)
      if (fs.lstatSync(file).isSymbolicLink() || !fs.lstatSync(file).isFile()) continue
      try {
        const run = JSON.parse(fs.readFileSync(file, "utf8"))
        const ageMinutes = Math.floor((now - Date.parse(run.updatedAt)) / 60000)
        const unfinished = run.status === "active" || run.learning?.status === "pending"
        if (unfinished && ageMinutes >= threshold) {
          pending.push({
            runId: run.runId,
            job: run.normalizedJob,
            variant: run.variant,
            status: run.status,
            ageMinutes,
            nextStage: run.stages?.find((stage) => !TERMINAL_STAGES.has(stage.status)) || null,
            learning: run.learning,
            humanTest: run.humanTest
          })
        }
      } catch {
        pending.push({ runId: path.basename(entry, ".json"), status: "invalid-ledger", ageMinutes: null })
      }
    }
  }
  const report = {
    schemaVersion: "adapta-skill-mind-recovery/v1",
    generatedAt: new Date(now).toISOString(),
    workspace: planRoot,
    olderThanMinutes: threshold,
    pending
  }
  if (write) writeJsonAtomic(path.join(orchestrationRoot(planRoot), "recovery.json"), report, planRoot)
  return report
}

function parseArgs(argv) {
  const [command, ...rest] = argv
  const args = { command, evidence: [] }
  for (let index = 0; index < rest.length; index += 1) {
    const value = rest[index]
    if (value === "--workspace") args.workspace = rest[++index]
    else if (value === "--job") args.job = rest[++index]
    else if (value === "--variant") args.variant = rest[++index]
    else if (value === "--runtime") args.runtime = rest[++index]
    else if (value === "--run-id") args.runId = rest[++index]
    else if (value === "--stage-index") args.stageIndex = rest[++index]
    else if (value === "--status") args.status = rest[++index]
    else if (value === "--outcome") args.outcome = rest[++index]
    else if (value === "--learning-status") args.learningStatus = rest[++index]
    else if (value === "--learning-ref") args.learningRef = rest[++index]
    else if (value === "--reason") args.reason = rest[++index]
    else if (value === "--human-test") args.humanTest = rest[++index]
    else if (value === "--human-test-required") args.humanTestRequired = true
    else if (value === "--evidence") args.evidence.push(rest[++index])
    else if (value === "--older-than-minutes") args.olderThanMinutes = rest[++index]
    else if (value === "--write") args.write = true
    else throw new Error(`Argumento desconhecido: ${value}`)
  }
  return args
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2))
    const workspace = args.workspace || process.cwd()
    let result
    if (args.command === "plan") result = buildRunPlan(args)
    else if (args.command === "start") result = startRun({ ...args, workspace })
    else if (args.command === "step") result = updateStage({ ...args, workspace })
    else if (args.command === "finish") result = finishRun({ ...args, workspace })
    else if (args.command === "recover") result = recoverRuns({ ...args, workspace })
    else if (args.command === "status") result = readRun(resolvePlanRoot(workspace), args.runId).run
    else throw new Error("Comando esperado: plan, start, step, finish, recover ou status")
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(`[adapta] ${error.message}`)
    process.exitCode = 1
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
