#!/usr/bin/env node
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { parseCheckStatus } from "./check-status.mjs"
import { readPlanEnvelope, writePlanEnvelope } from "./plan-envelope.mjs"
import { assertPopulatedTasksTable } from "./tasks-section.mjs"
import { phasePaths, planPath, resolvePlanRoot } from "./workspace-layout.mjs"

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
  if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`Link simbolico proibido: ${cursor}`)
  for (const part of relative.split(path.sep)) {
    if (!part) continue
    cursor = path.join(cursor, part)
    if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`Link simbolico proibido: ${cursor}`)
  }
}

function regularFile(root, file) {
  if (!inside(root, file) || !fs.existsSync(file)) throw new Error(`Arquivo obrigatorio ausente ou fora do workspace: ${file}`)
  assertRealContainment(root, file)
  const stat = fs.lstatSync(file)
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`Arquivo inseguro na liberacao: ${file}`)
  return file
}

function listFiles(root, boundary = root) {
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error(`Link simbolico proibido na liberacao: ${root}`)
  assertRealContainment(boundary, root)
  const files = []
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name)
    const stat = fs.lstatSync(file)
    if (stat.isSymbolicLink()) throw new Error(`Link simbolico proibido na liberacao: ${file}`)
    if (entry.isDirectory()) files.push(...listFiles(file, boundary))
    else if (entry.isFile()) files.push(file)
  }
  return files
}

function hash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")
}

function readManifest(clientRoot) {
  const file = regularFile(clientRoot, path.join(clientRoot, "handoff-manifest.json"))
  const manifest = JSON.parse(fs.readFileSync(file, "utf8"))
  if (manifest.schemaVersion !== "adapta-cliente-handoff/v1") throw new Error("Manifesto do cliente invalido")
  return manifest
}

export function snapshotActivePhase(clientRoot) {
  const client = path.resolve(clientRoot)
  if (!fs.existsSync(client) || !fs.statSync(client).isDirectory()) throw new Error("Repo do cliente invalido")
  if (fs.lstatSync(client).isSymbolicLink()) throw new Error("Repo do cliente nao pode ser link simbolico")
  const active = path.join(client, "04_fase-atual")
  if (!fs.existsSync(active) || !fs.statSync(active).isDirectory()) throw new Error("Fase atual do cliente ausente")
  const activeSnapshot = listFiles(active)
    .map((source) => ({ relative: path.relative(active, source).replaceAll(path.sep, "/"), sha256: hash(source) }))
    .sort((left, right) => left.relative.localeCompare(right.relative))
  const activeDigest = crypto.createHash("sha256")
    .update(JSON.stringify(activeSnapshot))
    .digest("hex")
  return { clientRoot: client, active, activeSnapshot, activeDigest }
}

function compareManifestWithActive(manifest, activeSnapshot) {
  const current = new Map(activeSnapshot.map((entry) => [`04_fase-atual/${entry.relative}`, entry.sha256]))
  const sealed = new Set()
  const drift = []
  for (const entry of Array.isArray(manifest.files) ? manifest.files : []) {
    if (typeof entry?.path !== "string" || !entry.path.startsWith("04_fase-atual/")) continue
    const normalized = path.posix.normalize(entry.path)
    if (normalized !== entry.path || normalized.includes("..")) {
      drift.push({ path: entry.path, status: "manifest-path-inseguro" })
      continue
    }
    sealed.add(entry.path)
    const currentHash = current.get(entry.path)
    if (!currentHash) drift.push({ path: entry.path, status: "removido-desde-manifesto" })
    else if (currentHash !== entry.sha256) drift.push({ path: entry.path, status: "alterado-desde-manifesto", manifestSha256: entry.sha256, currentSha256: currentHash })
  }
  for (const [file, currentSha256] of current) {
    if (!sealed.has(file)) drift.push({ path: file, status: "novo-desde-manifesto", currentSha256 })
  }
  return drift
}

export function buildPhaseReleasePlan({ consultantRoot, clientRoot, fromPhase, toPhase }) {
  const from = Number(fromPhase)
  const to = Number(toPhase)
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to > 5 || to !== from + 1) {
    throw new Error("Liberacao exige fases consecutivas entre 1 e 5")
  }
  const consultant = resolvePlanRoot(consultantRoot)
  const client = path.resolve(clientRoot)
  if (!fs.existsSync(consultant) || !fs.statSync(consultant).isDirectory()) throw new Error("Workspace do consultor invalido")
  if (!fs.existsSync(client) || !fs.statSync(client).isDirectory()) throw new Error("Repo do cliente invalido")
  if (fs.lstatSync(consultant).isSymbolicLink() || fs.lstatSync(client).isSymbolicLink()) throw new Error("Raizes nao podem ser links simbolicos")

  const manifest = readManifest(client)
  const manifestSource = path.join(client, "handoff-manifest.json")
  if (manifest.phase !== from) throw new Error(`Manifesto registra fase ${manifest.phase}, esperado ${from}`)
  const { active, activeSnapshot, activeDigest } = snapshotActivePhase(client)
  const manifestDrift = compareManifestWithActive(manifest, activeSnapshot)
  const archive = path.join(client, "05_entregas", `fase-${from}`)
  const deliveries = path.dirname(archive)
  if (fs.existsSync(deliveries) && fs.lstatSync(deliveries).isSymbolicLink()) throw new Error("05_entregas nao pode ser link simbolico")
  if (fs.existsSync(archive)) throw new Error(`Arquivo da fase ${from} ja existe no cliente`)

  const check = regularFile(consultant, path.join(planPath(consultant, "checks"), `check-fase-${from}.md`))
  const checkBody = fs.readFileSync(check, "utf8")
  if (!parseCheckStatus(checkBody).canAdvance) throw new Error(`check-fase-${from}.md ainda nao foi aprovado`)
  const approvedDigest = checkBody.match(/\*\*O que foi validado:\*\*[^\n]*\bactive-sha256=([a-f0-9]{64})\b/i)?.[1]
  if (approvedDigest !== activeDigest) {
    throw new Error(`check-fase-${from}.md nao aprova o active-sha256 atual (${activeDigest})`)
  }
  const delta = regularFile(consultant, path.join(planPath(consultant, "evolutions"), `delta-fase-${to}.md`))

  const nextPhase = phasePaths(consultant, to)
  const phase = regularFile(consultant, nextPhase.tasks)
  assertPopulatedTasksTable(fs.readFileSync(phase, "utf8"), `Fase ${to}`)
  const specs = fs.existsSync(nextPhase.specs)
    ? listFiles(nextPhase.specs).filter((file) => path.extname(file).toLowerCase() === ".md" && /^spec-/i.test(path.basename(file)))
    : []
  if (specs.length === 0) throw new Error(`Nenhuma SPEC valida encontrada para a fase ${to}`)

  const copies = [
    { source: phase, relative: "fase.md", classification: "fase-atual" },
    ...specs.map((source) => ({
      source,
      relative: path.join("specs", path.basename(source).replace(new RegExp(`^fase-${to}--`), "")),
      classification: "spec-fase-atual"
    }))
  ].map((copy) => ({ ...copy, sha256: hash(copy.source) }))

  return {
    schemaVersion: "adapta-phase-release/v1",
    from,
    to,
    consultantRoot: consultant,
    clientRoot: client,
    active,
    archive,
    versions: manifest.versions,
    prerequisites: [
      ...[check, delta].map((source) => ({ root: consultant, source, sha256: hash(source) })),
      { root: client, source: manifestSource, sha256: hash(manifestSource) }
    ],
    delta: { path: delta, sha256: hash(delta), preview: fs.readFileSync(delta, "utf8").slice(0, 4000) },
    activeSnapshot,
    activeDigest,
    manifestDrift,
    copies
  }
}

export function executePhaseRelease(plan, { dryRun = false } = {}) {
  if (dryRun) return plan
  const lockPath = path.join(plan.clientRoot, ".adapta-phase-release.lock")
  let lock
  try {
    lock = fs.openSync(lockPath, "wx", 0o600)
    fs.writeFileSync(lock, `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), from: plan.from, to: plan.to })}\n`)
  for (const prerequisite of plan.prerequisites || []) {
    regularFile(prerequisite.root || plan.consultantRoot, prerequisite.source)
    if (hash(prerequisite.source) !== prerequisite.sha256) throw new Error(`Gate ou delta mudou depois do dry-run: ${prerequisite.source}`)
  }
  const currentFiles = snapshotActivePhase(plan.clientRoot).activeSnapshot
  if (JSON.stringify(currentFiles) !== JSON.stringify(plan.activeSnapshot)) throw new Error("Fase ativa mudou depois do dry-run")
  if (fs.existsSync(path.dirname(plan.archive)) && fs.lstatSync(path.dirname(plan.archive)).isSymbolicLink()) throw new Error("05_entregas virou link simbolico")
  for (const copy of plan.copies) {
    regularFile(plan.consultantRoot, copy.source)
    if (hash(copy.source) !== copy.sha256) throw new Error(`Origem mudou depois do dry-run: ${copy.source}`)
  }
  if (fs.existsSync(plan.archive)) throw new Error("Destino do arquivo da fase deixou de estar vazio")
  const staging = path.join(plan.clientRoot, `.fase-staging-${crypto.randomUUID()}`)
  const stagedActive = path.join(staging, "04_fase-atual")
  fs.mkdirSync(stagedActive, { recursive: true, mode: 0o700 })
  try {
    for (const copy of plan.copies) {
      const target = path.join(stagedActive, copy.relative)
      if (!inside(stagedActive, target)) throw new Error(`Destino inseguro: ${copy.relative}`)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.copyFileSync(copy.source, target, fs.constants.COPYFILE_EXCL)
      if (hash(target) !== copy.sha256) throw new Error(`Copia divergente: ${copy.relative}`)
    }
    const nextManifest = {
      schemaVersion: "adapta-cliente-handoff/v1",
      phase: plan.to,
      versions: plan.versions,
      generatedAt: new Date().toISOString(),
      files: plan.copies.map((copy) => ({
        path: `04_fase-atual/${copy.relative.replaceAll(path.sep, "/")}`,
        sha256: copy.sha256,
        classification: copy.classification
      }))
    }
    fs.writeFileSync(path.join(staging, "handoff-manifest.json"), `${JSON.stringify(nextManifest, null, 2)}\n`, { flag: "wx" })
    fs.mkdirSync(path.dirname(plan.archive), { recursive: true })
    fs.renameSync(plan.active, plan.archive)
    const closureManifest = path.join(plan.archive, "phase-closure-manifest.json")
    try {
      fs.writeFileSync(closureManifest, `${JSON.stringify({
        schemaVersion: "adapta-phase-closure/v1",
        phase: plan.from,
        closedAt: new Date().toISOString(),
        activeDigest: plan.activeDigest,
        files: plan.activeSnapshot,
        checkSha256: plan.prerequisites[0]?.sha256,
        manifestDrift: plan.manifestDrift
      }, null, 2)}\n`, { flag: "wx" })
      fs.renameSync(stagedActive, plan.active)
      fs.renameSync(path.join(staging, "handoff-manifest.json"), path.join(plan.clientRoot, "handoff-manifest.json"))
    } catch (error) {
      if (fs.existsSync(plan.active)) fs.renameSync(plan.active, stagedActive)
      if (fs.existsSync(closureManifest)) fs.unlinkSync(closureManifest)
      if (fs.existsSync(plan.archive)) fs.renameSync(plan.archive, plan.active)
      throw error
    }
    fs.rmdirSync(staging)
    return nextManifest
  } catch (error) {
    if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true, force: true })
    throw error
  }
  } finally {
    if (lock !== undefined) fs.closeSync(lock)
    if (lock !== undefined && fs.existsSync(lockPath)) fs.unlinkSync(lockPath)
  }
}

/* node:coverage disable */
function parseArgs(argv) {
  const args = { dryRun: false, digestActive: false }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === "--consultor") args.consultantRoot = argv[++index]
    else if (value === "--cliente") args.clientRoot = argv[++index]
    else if (value === "--de") args.fromPhase = argv[++index]
    else if (value === "--para") args.toPhase = argv[++index]
    else if (value === "--dry-run") args.dryRun = true
    else if (value === "--digest-ativo") args.digestActive = true
    else if (value === "--plano") args.planFile = argv[++index]
    else throw new Error(`Argumento desconhecido: ${value}`)
  }
  return args
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2))
    if (args.digestActive) {
      if (!args.clientRoot) throw new Error("Argumento obrigatorio ausente: clientRoot")
      console.log(JSON.stringify(snapshotActivePhase(args.clientRoot), null, 2))
      return
    }
    for (const key of ["consultantRoot", "clientRoot", "fromPhase", "toPhase"]) {
      if (!args[key]) throw new Error(`Argumento obrigatorio ausente: ${key}`)
    }
    const consultantPlanRoot = resolvePlanRoot(args.consultantRoot)
    const planFile = path.resolve(args.planFile || path.join(planPath(consultantPlanRoot, "handoff"), `release-plan-fase-${args.fromPhase}-${args.toPhase}.json`))
    if (!inside(consultantPlanRoot, planFile)) throw new Error("Plano selado precisa ficar dentro do plano do consultor")
    fs.mkdirSync(path.dirname(planFile), { recursive: true })
    assertRealContainment(consultantPlanRoot, path.dirname(planFile))
    if (args.dryRun) {
      const plan = buildPhaseReleasePlan(args)
      const sealed = writePlanEnvelope(plan, planFile)
      console.log(JSON.stringify({ ...sealed, plan }, null, 2))
      return
    }
    const sealed = readPlanEnvelope(planFile, "adapta-phase-release/v1")
    if (consultantPlanRoot !== sealed.plan.consultantRoot || path.resolve(args.clientRoot) !== sealed.plan.clientRoot || Number(args.fromPhase) !== sealed.plan.from || Number(args.toPhase) !== sealed.plan.to) {
      throw new Error("Argumentos nao correspondem ao plano de liberacao aprovado")
    }
    console.log(JSON.stringify(executePhaseRelease(sealed.plan), null, 2))
  } catch (error) {
    console.error(`Liberacao reprovada: ${error.message}`)
    process.exitCode = 1
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
/* node:coverage enable */
