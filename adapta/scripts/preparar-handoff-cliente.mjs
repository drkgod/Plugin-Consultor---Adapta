#!/usr/bin/env node
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { parseCheckStatus } from "./check-status.mjs"
import { readPlanEnvelope, writePlanEnvelope } from "./plan-envelope.mjs"
import { assertPopulatedTasksTable } from "./tasks-section.mjs"

const CLIENT_TOP_LEVEL_ALLOWLIST = new Set([
  ".claude",
  "01_projeto",
  "02_reunioes",
  "03_documentos",
  "04_fase-atual",
  "05_entregas",
  "06_notas",
  "AGENTS.md",
  "CLAUDE.md",
  "README.md",
  "STATUS.md",
  "changelog.md"
])

function inside(root, candidate) {
  const relative = path.relative(path.resolve(root), path.resolve(candidate))
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))
}

function assertRealContainment(root, target) {
  const realRoot = fs.realpathSync(root)
  const realTarget = fs.realpathSync(target)
  if (!inside(realRoot, realTarget)) throw new Error(`Origem resolve para fora do workspace: ${target}`)
  const relative = path.relative(path.resolve(root), path.resolve(target))
  let cursor = path.resolve(root)
  if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`Link simbolico nao permitido: ${cursor}`)
  for (const part of relative.split(path.sep)) {
    if (!part) continue
    cursor = path.join(cursor, part)
    if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`Link simbolico nao permitido: ${cursor}`)
  }
}

function assertSafeRegularFile(root, file) {
  if (!inside(root, file) || !fs.existsSync(file)) throw new Error(`Origem obrigatoria ausente ou fora do workspace: ${file}`)
  const stat = fs.lstatSync(file)
  if (stat.isSymbolicLink()) throw new Error(`Link simbolico nao permitido no handoff: ${file}`)
  assertRealContainment(root, file)
  if (!stat.isFile()) throw new Error(`Origem nao e arquivo regular: ${file}`)
}

function assertNoSymlinkAncestors(root, target) {
  if (!inside(root, target)) throw new Error(`Destino fora da pasta cliente: ${target}`)
  const relative = path.relative(path.resolve(root), path.resolve(target))
  let cursor = path.resolve(root)
  if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) {
    throw new Error(`Link simbolico nao permitido no destino: ${cursor}`)
  }
  for (const part of relative.split(path.sep).slice(0, -1)) {
    cursor = path.join(cursor, part)
    if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) {
      throw new Error(`Link simbolico nao permitido no destino: ${cursor}`)
    }
  }
}

function listRegularFiles(root) {
  if (!fs.existsSync(root)) return []
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error(`Link simbolico nao permitido no handoff: ${root}`)
  const files = []
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name)
    const stat = fs.lstatSync(file)
    if (stat.isSymbolicLink()) throw new Error(`Link simbolico nao permitido no handoff: ${file}`)
    if (entry.isDirectory()) files.push(...listRegularFiles(file))
    else if (entry.isFile()) files.push(file)
  }
  return files
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")
}

function digestFiles(root, files) {
  const inventory = [...files]
    .map((file) => ({ path: path.relative(root, file).replaceAll(path.sep, "/"), sha256: sha256(file) }))
    .sort((left, right) => left.path.localeCompare(right.path))
  return crypto.createHash("sha256").update(JSON.stringify(inventory)).digest("hex")
}

function readVersion(file) {
  if (!fs.existsSync(file)) return "nao-detectada"
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")).version || "nao-detectada"
  } catch {
    return "nao-detectada"
  }
}

export function buildHandoffPlan({ consultantRoot, clientRoot, templateRoot, phaseNumber }) {
  const phase = Number(phaseNumber)
  if (!Number.isInteger(phase) || phase < 1 || phase > 5) {
    throw new Error("A fase deve ser um inteiro entre 1 e 5")
  }

  const roots = {
    consultant: path.resolve(consultantRoot),
    client: path.resolve(clientRoot),
    template: path.resolve(templateRoot)
  }
  for (const [name, root] of Object.entries({ consultant: roots.consultant, template: roots.template })) {
    if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`Pasta ${name} invalida: ${root}`)
    if (fs.lstatSync(root).isSymbolicLink()) throw new Error(`Pasta ${name} nao pode ser link simbolico: ${root}`)
  }
  if (inside(roots.consultant, roots.client) || inside(roots.template, roots.client)) {
    throw new Error("Destino do cliente deve ficar fora do workspace do consultor e do template")
  }
  if (fs.existsSync(roots.client) && fs.readdirSync(roots.client).length > 0) {
    throw new Error("Gerar pasta cliente exige destino novo ou vazio; fases seguintes usam sincronizar-cliente")
  }

  const checksRoot = path.join(roots.consultant, "05_execucao", "checks")
  const prerequisites = []
  for (const name of ["check-escopo.md", "check-cliente.md"]) {
    const source = path.join(checksRoot, name)
    assertSafeRegularFile(roots.consultant, source)
    if (!parseCheckStatus(fs.readFileSync(source, "utf8")).canAdvance) throw new Error(`${name} nao permite handoff`)
    prerequisites.push({ source, sha256: sha256(source), classification: "gate-humano" })
  }
  const receipt = path.join(checksRoot, "recibo-handoff-cliente.md")
  assertSafeRegularFile(roots.consultant, receipt)
  const receiptBody = fs.readFileSync(receipt, "utf8")
  const meetingRelative = receiptBody.match(/^\*\*Reuniao de corte:\*\*\s+(.+)$/im)?.[1]?.trim()
  const versionsSection = receiptBody.match(/## Vers(?:ões|oes) revalidadas\s+([\s\S]*?)(?:\n## |$)/i)?.[1] || ""
  if (!/^\*\*Data:\*\*\s+\d{4}-\d{2}-\d{2}\s*$/im.test(receiptBody) || !meetingRelative || path.isAbsolute(meetingRelative) || !/^\*\*Ajustes incorporados:\*\*\s+SIM\s*$/im.test(receiptBody) || !/^\*\*Revalidacao:\*\*\s+APROVADA\s*$/im.test(receiptBody) || versionsSection.includes("[") || (versionsSection.match(/^-\s+.+/gm) || []).length < 4) {
    throw new Error("Recibo de handoff nao comprova reuniao, ajustes e revalidacao")
  }
  const meeting = path.resolve(roots.consultant, meetingRelative)
  assertSafeRegularFile(path.join(roots.consultant, "02_reunioes"), meeting)
  prerequisites.push(
    { source: receipt, sha256: sha256(receipt), classification: "recibo-handoff" },
    { source: meeting, sha256: sha256(meeting), classification: "reuniao-de-corte" }
  )

  const copies = listRegularFiles(roots.template)
    .filter((source) => path.basename(source) !== ".DS_Store")
    .map((source) => {
      const relative = path.relative(roots.template, source)
      const topLevel = relative.split(path.sep)[0]
      if (!CLIENT_TOP_LEVEL_ALLOWLIST.has(topLevel)) {
        throw new Error(`Arquivo fora da allowlist do template cliente: ${relative}`)
      }
      return {
        source,
        sourceRoot: roots.template,
        target: path.join(roots.client, relative),
        classification: "template-publico"
      }
    })

  const phaseSource = path.join(roots.consultant, "04_plano", "fases", `fase-${phase}.md`)
  assertSafeRegularFile(roots.consultant, phaseSource)
  assertPopulatedTasksTable(fs.readFileSync(phaseSource, "utf8"), `Fase ${phase}`)
  copies.push({
    source: phaseSource,
    sourceRoot: roots.consultant,
    target: path.join(roots.client, "04_fase-atual", "fase.md"),
    classification: "fase-atual"
  })

  const nestedSpecs = path.join(roots.consultant, "05_execucao", "specs", `fase-${phase}`)
  const flatSpecs = path.join(roots.consultant, "05_execucao", "specs")
  const specFiles = fs.existsSync(nestedSpecs)
    ? listRegularFiles(nestedSpecs).filter((file) => path.extname(file).toLowerCase() === ".md")
    : listRegularFiles(flatSpecs).filter((file) => path.basename(file).startsWith(`fase-${phase}--spec-`) && path.extname(file).toLowerCase() === ".md")
  if (specFiles.length === 0) throw new Error(`Nenhuma SPEC valida encontrada para a fase ${phase}`)
  const prd = path.join(roots.consultant, "04_plano", "PRD.md")
  const scope = path.join(roots.consultant, "04_plano", "escopo.md")
  assertSafeRegularFile(roots.consultant, prd)
  assertSafeRegularFile(roots.consultant, scope)
  const receiptHashes = {
    PRD: sha256(prd),
    Escopo: sha256(scope),
    Fase: sha256(phaseSource),
    [`SPECs fase ${phase}`]: digestFiles(roots.consultant, specFiles)
  }
  for (const [label, expected] of Object.entries(receiptHashes)) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const recorded = versionsSection.match(new RegExp(`^-\\s+${escaped}:\\s+sha256(?:-set)?=([a-f0-9]{64})\\s*$`, "im"))?.[1]
    if (recorded !== expected) throw new Error(`Recibo de handoff nao corresponde ao hash atual de ${label}`)
  }
  prerequisites.push(
    { source: prd, sha256: receiptHashes.PRD, classification: "artefato-revalidado" },
    { source: scope, sha256: receiptHashes.Escopo, classification: "artefato-revalidado" }
  )

  for (const source of specFiles) {
    assertSafeRegularFile(roots.consultant, source)
    const name = path.basename(source).replace(new RegExp(`^fase-${phase}--`), "")
    copies.push({
      source,
      sourceRoot: roots.consultant,
      target: path.join(roots.client, "04_fase-atual", "specs", name),
      classification: "spec-fase-atual"
    })
  }

  const normalized = copies.map((copy) => {
    if (!inside(roots.client, copy.target)) throw new Error(`Destino fora da pasta cliente: ${copy.target}`)
    return { ...copy, sha256: sha256(copy.source) }
  })

  const methodRoot = path.dirname(roots.template)
  const versions = {
    package: readVersion(path.join(methodRoot, "package.json")),
    adapta: readVersion(path.join(methodRoot, "plugins", "adapta", ".claude-plugin", "plugin.json")),
    adaptaCliente: readVersion(path.join(methodRoot, "plugins", "adapta-cliente", ".claude-plugin", "plugin.json"))
  }

  return {
    schemaVersion: "adapta-cliente-handoff/v1",
    phase,
    versions,
    consultantRoot: roots.consultant,
    templateRoot: roots.template,
    clientRoot: roots.client,
    prerequisites,
    copies: normalized
  }
}

export function executeHandoff(plan, { dryRun = false } = {}) {
  if (dryRun) return plan
  const parent = path.dirname(plan.clientRoot)
  if (fs.existsSync(plan.clientRoot)) {
    if (fs.lstatSync(plan.clientRoot).isSymbolicLink()) throw new Error("Destino nao pode ser link simbolico")
    listRegularFiles(plan.clientRoot)
    if (fs.readdirSync(plan.clientRoot).length > 0) {
      throw new Error("Destino deixou de estar vazio depois do dry-run; gere um novo plano")
    }
  }
  for (const copy of plan.copies) {
    if (!inside(plan.clientRoot, copy.target)) throw new Error(`Destino inseguro: ${copy.target}`)
    assertSafeRegularFile(copy.sourceRoot, copy.source)
    if (sha256(copy.source) !== copy.sha256) throw new Error(`Origem mudou depois do dry-run: ${copy.source}`)
  }
  for (const prerequisite of plan.prerequisites || []) {
    assertSafeRegularFile(path.dirname(prerequisite.source), prerequisite.source)
    if (sha256(prerequisite.source) !== prerequisite.sha256) throw new Error(`Gate ou recibo mudou depois do dry-run: ${prerequisite.source}`)
  }
  fs.mkdirSync(parent, { recursive: true })
  if (fs.lstatSync(parent).isSymbolicLink()) throw new Error("Pasta pai do destino nao pode ser link simbolico")
  const staging = path.join(parent, `.${path.basename(plan.clientRoot)}.staging-${crypto.randomUUID()}`)
  fs.mkdirSync(staging, { mode: 0o700 })
  let manifest
  try {
    for (const copy of plan.copies) {
      const relative = path.relative(plan.clientRoot, copy.target)
      const stagedTarget = path.join(staging, relative)
      assertNoSymlinkAncestors(staging, stagedTarget)
      fs.mkdirSync(path.dirname(stagedTarget), { recursive: true })
      fs.copyFileSync(copy.source, stagedTarget, fs.constants.COPYFILE_EXCL)
      if (sha256(stagedTarget) !== copy.sha256) throw new Error(`Copia divergente no staging: ${relative}`)
    }
  manifest = {
    schemaVersion: plan.schemaVersion,
    phase: plan.phase,
    versions: plan.versions,
    generatedAt: new Date().toISOString(),
    files: plan.copies
      .filter((copy) => copy.classification !== "template-publico" || path.relative(plan.clientRoot, copy.target).startsWith(`04_fase-atual${path.sep}`))
      .map((copy) => ({
      path: path.relative(plan.clientRoot, copy.target).replaceAll(path.sep, "/"),
      sha256: copy.sha256,
      classification: copy.classification
      }))
  }
    fs.writeFileSync(path.join(staging, "handoff-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" })
    if (fs.existsSync(plan.clientRoot)) fs.rmdirSync(plan.clientRoot)
    fs.renameSync(staging, plan.clientRoot)
  } catch (error) {
    if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true, force: true })
    throw error
  }
  return manifest
}

/* node:coverage disable -- wrapper CLI; regras de negocio sao testadas pelas funcoes exportadas */
function parseArgs(argv) {
  const args = { dryRun: false }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === "--dry-run") args.dryRun = true
    else if (value === "--consultor") args.consultantRoot = argv[++index]
    else if (value === "--cliente") args.clientRoot = argv[++index]
    else if (value === "--template") args.templateRoot = argv[++index]
    else if (value === "--fase") args.phaseNumber = argv[++index]
    else if (value === "--plano") args.planFile = argv[++index]
    else throw new Error(`Argumento desconhecido: ${value}`)
  }
  return args
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2))
    const required = ["consultantRoot", "clientRoot", "templateRoot", "phaseNumber"]
    for (const key of required) if (!args[key]) throw new Error(`Argumento obrigatorio ausente: ${key}`)
    const planFile = path.resolve(args.planFile || path.join(args.consultantRoot, "05_execucao", "checks", `handoff-plan-fase-${args.phaseNumber}.json`))
    if (!inside(args.consultantRoot, planFile)) throw new Error("Plano selado precisa ficar dentro do workspace do consultor")
    assertRealContainment(args.consultantRoot, path.dirname(planFile))
    if (args.dryRun) {
      const plan = buildHandoffPlan(args)
      const sealed = writePlanEnvelope(plan, planFile)
      console.log(JSON.stringify({ ...sealed, plan }, null, 2))
      return
    }
    const sealed = readPlanEnvelope(planFile, "adapta-cliente-handoff/v1")
    if (path.resolve(args.consultantRoot) !== sealed.plan.consultantRoot || path.resolve(args.templateRoot) !== sealed.plan.templateRoot || path.resolve(args.clientRoot) !== sealed.plan.clientRoot || Number(args.phaseNumber) !== sealed.plan.phase) {
      throw new Error("Argumentos nao correspondem ao plano de handoff aprovado")
    }
    console.log(JSON.stringify(executeHandoff(sealed.plan), null, 2))
  } catch (error) {
    console.error(`Handoff reprovado: ${error.message}`)
    process.exitCode = 1
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
/* node:coverage enable */
