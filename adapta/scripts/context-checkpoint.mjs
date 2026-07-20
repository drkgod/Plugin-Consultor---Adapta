#!/usr/bin/env node
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { parseCheckStatus } from "./check-status.mjs"
import { redactDeep, redactSensitive } from "./redact-sensitive.mjs"

function safeText(value, maxChars) {
  return redactSensitive(value).slice(0, maxChars)
}

function read(file, maxChars, tail = false) {
  if (!fs.existsSync(file) || !fs.lstatSync(file).isFile() || fs.lstatSync(file).isSymbolicLink()) return ""
  const body = safeText(fs.readFileSync(file, "utf8"), maxChars * 2)
  return tail ? body.slice(-maxChars) : body.slice(0, maxChars)
}

function checks(root) {
  const directory = path.join(root, "05_execucao", "checks")
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) return []
  return fs.readdirSync(directory)
    .filter((name) => /^check-[a-z0-9-]+\.md$/i.test(name))
    .sort()
    .map((name) => {
      const body = read(path.join(directory, name), 1200)
      let parsed = { status: "PENDENTE", canAdvance: false }
      try { parsed = parseCheckStatus(body) } catch { /* check incompleto permanece pendente */ }
      return { path: `05_execucao/checks/${name}`, ...parsed }
    })
}

export function buildCheckpoint({ workspace, reason = "manual" }) {
  const root = path.resolve(workspace)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory() || fs.lstatSync(root).isSymbolicLink()) {
    throw new Error("Workspace invalido para checkpoint")
  }
  const status = read(path.join(root, "STATUS.md"), 4000)
  const changelogTail = read(path.join(root, "changelog.md"), 1600, true)
  const gateStates = checks(root)
  const currentGate = [...gateStates].reverse().find((gate) => !gate.canAdvance) || gateStates.at(-1) || null
  const phase = status.match(/(?:fase atual|fase)\s*[:#-]?\s*(\d)/i)?.[1] || null
  const pendingDecisions = status.split("\n").filter((line) => /pend[eê]ncia|decis[aã]o pendente/i.test(line)).slice(0, 20)
  const touchedArtifacts = [...changelogTail.matchAll(/`([^`]+\.[A-Za-z0-9]+)`/g)].map((match) => match[1]).slice(-20)
  const nextSafeAction = status.match(/pr[oó]xima (?:a[cç][aã]o|task)\s*:\s*(.+)/i)?.[1]?.trim() || "Revalidar este checkpoint contra STATUS.md e checks antes de agir."
  return {
    schemaVersion: "adapta-context-checkpoint/v1",
    workspace: root,
    reason,
    timestamp: new Date().toISOString(),
    sourceOfTruth: ["STATUS.md", "changelog.md", "05_execucao/checks/"],
    statusSnapshot: status,
    changelogTail,
    gateStates,
    phase,
    gate: currentGate,
    pendingDecisions,
    touchedArtifacts,
    currentGate,
    nextSafeAction,
    exclusions: ["transcript", "prompt bruto", "segredos", "credenciais", "conteudo integral duplicado"]
  }
}

export function writeCheckpoint(checkpoint, { dryRun = false, ifNeeded = false } = {}) {
  const sanitized = redactDeep(checkpoint)
  if (dryRun) return { ...sanitized, dryRun: true }
  if (ifNeeded && !checkpoint.statusSnapshot && checkpoint.gateStates.length === 0) return { skipped: true, reason: "sem estado estruturado" }
  const root = checkpoint.workspace
  const directory = path.join(root, ".adapta", "memory")
  const file = path.join(directory, "latest.json")
  if (fs.existsSync(path.join(root, ".adapta")) && fs.lstatSync(path.join(root, ".adapta")).isSymbolicLink()) {
    throw new Error(".adapta nao pode ser link simbolico")
  }
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 })
  if (fs.lstatSync(directory).isSymbolicLink()) throw new Error("Pasta de memoria nao pode ser link simbolico")
  const temporary = path.join(directory, `.latest-${crypto.randomUUID()}.tmp`)
  fs.writeFileSync(temporary, `${JSON.stringify(sanitized, null, 2)}\n`, { flag: "wx", mode: 0o600 })
  fs.renameSync(temporary, file)
  fs.chmodSync(file, 0o600)
  return { path: file, timestamp: checkpoint.timestamp }
}

/* node:coverage disable */
function parseArgs(argv) {
  const args = { dryRun: false, ifNeeded: false }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === "--workspace") args.workspace = argv[++index]
    else if (value === "--reason") args.reason = argv[++index]
    else if (value === "--dry-run") args.dryRun = true
    else if (value === "--if-needed") args.ifNeeded = true
    else throw new Error(`Argumento desconhecido: ${value}`)
  }
  return args
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2))
    const checkpoint = buildCheckpoint({ workspace: args.workspace || process.cwd(), reason: args.reason })
    console.log(JSON.stringify(writeCheckpoint(checkpoint, args), null, 2))
  } catch (error) {
    console.warn(`[adapta] Checkpoint nao salvo: ${error.message}`)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
/* node:coverage enable */
