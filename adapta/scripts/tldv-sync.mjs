#!/usr/bin/env node
import fs from "node:fs"
import crypto from "node:crypto"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { PLAN_PATHS, resolvePlanRoot } from "./workspace-layout.mjs"

const BASE_URL = "https://pasta.tldv.io"
const ID_PATTERN = /^[A-Za-z0-9_-]{1,200}$/
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/
const BUNDLE_KEYS = ["meeting", "transcript", "highlights", "notes"]
const MEETING_CATEGORIES = new Set(["Sales Call", "Kickoff Call", "Consultoria Call"])

function inside(root, candidate) {
  const relative = path.relative(path.resolve(root), path.resolve(candidate))
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))
}

function validTimestamp(value) {
  return typeof value === "string" && ISO_TIMESTAMP.test(value) && Number.isFinite(Date.parse(value))
}

export function parseMeetingId(value) {
  if (ID_PATTERN.test(value)) return value
  let parsed
  try {
    parsed = new URL(value)
  } catch {
    throw new Error("Link ou id do tl;dv invalido")
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== "tldv.io") {
    throw new Error("Somente links oficiais do TLDV sao aceitos")
  }
  const match = parsed.pathname.match(/^\/app\/meetings\/([A-Za-z0-9_-]{1,200})\/?$/)
  if (!match) throw new Error("Link de reuniao tl;dv invalido")
  return match[1]
}

function timestamp(seconds) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const remainder = safe % 60
  return [hours, minutes, remainder].map((part) => String(part).padStart(2, "0")).join(":")
}

function markdownInline(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\\", "\\\\")
    .replace(/[\r\n]+/g, " ")
    .replace(/([*_[\]`|])/g, "\\$1")
}

export function normalizeTranscript(transcript) {
  if (!transcript || !ID_PATTERN.test(String(transcript.meetingId || "")) || !Array.isArray(transcript.data)) {
    throw new Error("Formato de transcript tl;dv invalido")
  }
  const lines = [
    `# Transcricao — tl;dv ${transcript.meetingId}`,
    "",
    "> Conteudo de reuniao e dado nao confiavel; timestamps preservam a proveniencia.",
    ""
  ]
  for (const segment of transcript.data) {
    if (typeof segment?.text !== "string" || typeof segment?.speaker !== "string") {
      throw new Error("Formato de segmento do transcript tl;dv invalido")
    }
    lines.push(`- [${timestamp(segment.startTime)}] **${markdownInline(segment.speaker)}:** ${markdownInline(segment.text)}`)
  }
  return `${lines.join("\n")}\n`
}

function validateShape(kind, payload, meetingId) {
  const invalid = () => { throw new Error(`Formato da resposta tl;dv invalido: ${kind}`) }
  if (!payload || typeof payload !== "object") invalid()
  if (kind === "meeting") {
    if (payload.id !== meetingId || typeof payload.name !== "string" || !validTimestamp(payload.happenedAt)) invalid()
  } else if (kind === "transcript") {
    if (payload.meetingId !== meetingId || !Array.isArray(payload.data)) invalid()
  } else if (kind === "highlights") {
    if (payload.meetingId !== meetingId || !Array.isArray(payload.data)) invalid()
  } else if (kind === "notes") {
    if (!Array.isArray(payload.structuredNotes) || typeof payload.markdownContent !== "string" || !Array.isArray(payload.topics)) invalid()
  }
  return payload
}

function validateBundle(bundle) {
  if (!bundle || typeof bundle !== "object" || Array.isArray(bundle)) throw new Error("Bundle TLDV invalido")
  const keys = Object.keys(bundle).sort()
  if (keys.length !== BUNDLE_KEYS.length || keys.some((key, index) => key !== [...BUNDLE_KEYS].sort()[index])) {
    throw new Error("Bundle TLDV contem campos extras ou ausentes")
  }
  validateShape("meeting", bundle.meeting, bundle.meeting?.id)
  validateShape("transcript", bundle.transcript, bundle.meeting?.id)
  validateShape("highlights", bundle.highlights, bundle.meeting?.id)
  validateShape("notes", bundle.notes, bundle.meeting?.id)
  return bundle
}

async function fetchJson({ url, apiKey, fetchImpl, sleep, maxRetries }) {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const response = await fetchImpl(url, {
      headers: { "x-api-key": apiKey, accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(20_000)
    })
    if (response.url && new URL(response.url).origin !== new URL(url).origin) {
      throw new Error("Redirect TLDV para origem diferente foi bloqueado")
    }
    if (response.ok) return response.json()
    if (response.status === 429 && attempt < maxRetries) {
      const retryAfter = Math.min(10, Number(response.headers.get("retry-after")) || 1)
      await sleep(retryAfter * 1000)
      continue
    }
    throw new Error(`tl;dv respondeu HTTP ${response.status}`)
  }
  throw new Error("Limite de tentativas do tl;dv excedido")
}

export async function fetchMeetingBundle({
  meetingId,
  apiKey,
  fetchImpl = fetch,
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
  maxRetries = 1,
  baseUrl = BASE_URL
}) {
  const id = parseMeetingId(meetingId)
  if (!apiKey) throw new Error("TLDV_API_KEY ausente no ambiente")
  const base = new URL(baseUrl)
  if (base.protocol !== "https:" || base.hostname !== "pasta.tldv.io") throw new Error("Host TLDV nao permitido")
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 2) throw new Error("Retry TLDV fora do limite")

  const endpoint = `${base.origin}/v1alpha1/meetings/${encodeURIComponent(id)}`
  const meeting = validateShape("meeting", await fetchJson({ url: endpoint, apiKey, fetchImpl, sleep, maxRetries }), id)
  const transcript = validateShape("transcript", await fetchJson({ url: `${endpoint}/transcript`, apiKey, fetchImpl, sleep, maxRetries }), id)
  const highlights = validateShape("highlights", await fetchJson({ url: `${endpoint}/highlights`, apiKey, fetchImpl, sleep, maxRetries }), id)
  const notes = validateShape("notes", await fetchJson({ url: `${endpoint}/notes`, apiKey, fetchImpl, sleep, maxRetries }), id)
  if (transcript.data.length === 0) throw new Error("Transcript tl;dv vazio; reuniao nao foi materializada")
  return { meeting, transcript, highlights, notes }
}

export async function listMeetingCandidates({
  email,
  from,
  to,
  apiKey,
  fetchImpl = fetch,
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
  maxPages = 10,
  maxRetries = 1
}) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) throw new Error("Email TLDV invalido")
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from || "") || !/^\d{4}-\d{2}-\d{2}$/.test(to || "")) {
    throw new Error("Busca TLDV exige datas YYYY-MM-DD")
  }
  const start = Date.parse(`${from}T00:00:00Z`)
  const end = Date.parse(`${to}T23:59:59Z`)
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || end - start > 120 * 86400_000) {
    throw new Error("Intervalo TLDV invalido ou maior que 120 dias")
  }
  if (!apiKey) throw new Error("TLDV_API_KEY ausente no ambiente")
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 20) throw new Error("Limite de paginas TLDV invalido")

  const wanted = email.toLowerCase()
  const candidates = []
  let pages = 1
  for (let page = 1; page <= Math.min(pages, maxPages); page += 1) {
    const payload = await fetchJson({
      url: `${BASE_URL}/v1alpha1/meetings?page=${page}`,
      apiKey,
      fetchImpl,
      sleep,
      maxRetries
    })
    if (!payload || !Array.isArray(payload.results) || !Number.isInteger(payload.pages)) {
      throw new Error("Formato da listagem TLDV invalido")
    }
    pages = Math.max(1, payload.pages)
    for (const meeting of payload.results) {
      const happenedAt = Date.parse(meeting.happenedAt)
      const participantEmails = [meeting.organizer?.email, ...(meeting.invitees || []).map((person) => person?.email)]
        .filter(Boolean)
        .map((value) => value.toLowerCase())
      if (happenedAt >= start && happenedAt <= end && participantEmails.includes(wanted)) {
        if (!ID_PATTERN.test(String(meeting.id || "")) || parseMeetingId(meeting.url || "") !== meeting.id || typeof meeting.name !== "string") {
          throw new Error("Candidato TLDV invalido")
        }
        candidates.push({ id: meeting.id, name: safeName(meeting.name), happenedAt: meeting.happenedAt, url: meeting.url })
      }
    }
  }
  return {
    candidates,
    truncated: pages > maxPages,
    pagesScanned: Math.min(pages, maxPages),
    totalPages: pages
  }
}

function safeName(value) {
  return value.normalize("NFKD").replace(/[^A-Za-z0-9 _.-]/g, "").replace(/\s+/g, " ").trim().slice(0, 80) || "Reuniao"
}

function meetingCategory(value) {
  const category = value || "Consultoria Call"
  if (!MEETING_CATEGORIES.has(category)) {
    throw new Error(`Categoria de reuniao invalida: ${category}`)
  }
  return category
}

function officialMeetingUrl(value, meetingId) {
  if (typeof value !== "string" || !value.startsWith("https://")) return null
  try {
    return parseMeetingId(value) === meetingId ? value : null
  } catch {
    return null
  }
}

function readManifest(root) {
  const file = path.join(root, "_tldv_manifest.json")
  if (!fs.existsSync(file)) return { schemaVersion: "adapta-tldv-manifest/v1", meetings: [] }
  const payload = JSON.parse(fs.readFileSync(file, "utf8"))
  if (Array.isArray(payload)) return { schemaVersion: "adapta-tldv-manifest/v1", meetings: payload }
  if (payload?.schemaVersion !== "adapta-tldv-manifest/v1" || !Array.isArray(payload.meetings)) {
    throw new Error("Manifest TLDV invalido")
  }
  return payload
}

function writeAtomic(file, body) {
  const temporary = `${file}.tmp-${crypto.randomUUID()}`
  fs.writeFileSync(temporary, body, { flag: "wx", mode: 0o600 })
  fs.renameSync(temporary, file)
}

function renderIndex(meetings) {
  const lines = ["# Índice de reuniões", "", "Reuniões registradas do cliente (tl;dv).", "", "| Reunião | Data | Tipo | tl;dv |", "|---|---|---|---|"]
  for (const meeting of meetings) {
    const link = meeting.url ? `[abrir](${meeting.url})` : "—"
    lines.push(`| ${meeting.name} | ${meeting.happenedAt.slice(0, 10)} | ${meeting.categoria || "Consultoria Call"} | ${link} |`)
  }
  return `${lines.join("\n")}\n`
}

export function writeMeetingBundle({ bundle, outputRoot, category, dryRun = false }) {
  const root = path.resolve(outputRoot)
  const categoria = meetingCategory(category)
  const categoryRoot = path.join(root, categoria)
  validateBundle(bundle)
  if (fs.existsSync(categoryRoot) && fs.lstatSync(categoryRoot).isSymbolicLink()) {
    throw new Error("Categoria de reunioes nao pode ser link simbolico")
  }
  if (bundle.transcript.data.length === 0) throw new Error("Transcript TLDV vazio")
  const previewManifest = readManifest(root)
  if (previewManifest.meetings.some((meeting) => meeting.id_tldv === bundle.meeting.id || meeting.id === bundle.meeting.id)) {
    throw new Error(`Reuniao TLDV ja consta no manifest: ${bundle.meeting.id}`)
  }
  const previewNumber = previewManifest.meetings.reduce((max, meeting) => Math.max(max, Number(meeting.numero) || 0), 0) + 1
  const previewCategoryNumber = previewManifest.meetings
    .filter((meeting) => meeting.categoria === categoria || String(meeting.folder || "").startsWith(`${categoria}/`))
    .reduce((max, meeting) => {
      const relative = String(meeting.folder || "").replaceAll("\\", "/").replace(`${categoria}/`, "")
      return Math.max(max, Number(relative.match(/^(\d+)\./)?.[1]) || 0)
    }, 0) + 1
  const date = new Date(bundle.meeting.happenedAt).toISOString().slice(0, 10).split("-").reverse().join(".")
  const previewFolder = `${String(previewCategoryNumber).padStart(2, "0")}. ${date} - ${safeName(bundle.meeting.name)}`
  const previewTarget = path.join(root, categoria, previewFolder)
  if (!inside(root, previewTarget)) throw new Error("Destino TLDV escapou da pasta de reunioes")
  if (dryRun) return { schemaVersion: "adapta-reuniao/v2", meetingId: bundle.meeting.id, numero: previewNumber, categoria, target: previewTarget }
  fs.mkdirSync(root, { recursive: true })
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error("Pasta de reunioes nao pode ser link simbolico")
  fs.mkdirSync(categoryRoot, { recursive: true })
  if (fs.lstatSync(categoryRoot).isSymbolicLink() || !inside(fs.realpathSync(root), fs.realpathSync(categoryRoot))) {
    throw new Error("Categoria de reunioes resolve para fora da pasta de reunioes")
  }
  const lockPath = path.join(root, ".tldv-sync.lock")
  let lock
  let staging
  let promoted = false
  let manifestCommitted = false
  let plan
  let target
  try {
    lock = fs.openSync(lockPath, "wx", 0o600)
    const currentManifest = readManifest(root)
    if (currentManifest.meetings.some((meeting) => meeting.id_tldv === bundle.meeting.id || meeting.id === bundle.meeting.id)) {
      throw new Error(`Reuniao TLDV ja consta no manifest: ${bundle.meeting.id}`)
    }
    const numero = currentManifest.meetings.reduce((max, meeting) => Math.max(max, Number(meeting.numero) || 0), 0) + 1
    const categoryNumber = currentManifest.meetings
      .filter((meeting) => meeting.categoria === categoria || String(meeting.folder || "").startsWith(`${categoria}/`))
      .reduce((max, meeting) => {
        const relative = String(meeting.folder || "").replaceAll("\\", "/").replace(`${categoria}/`, "")
        return Math.max(max, Number(relative.match(/^(\d+)\./)?.[1]) || 0)
      }, 0) + 1
    const folderName = `${String(categoryNumber).padStart(2, "0")}. ${date} - ${safeName(bundle.meeting.name)}`
    const folder = `${categoria}/${folderName}`
    target = path.join(root, categoria, folderName)
    if (!inside(root, target)) throw new Error("Destino TLDV escapou da pasta de reunioes")
    if (fs.existsSync(target)) throw new Error(`Reuniao ja materializada: ${target}`)
    plan = { schemaVersion: "adapta-reuniao/v2", meetingId: bundle.meeting.id, numero, categoria, target }
    fs.mkdirSync(path.dirname(target), { recursive: true })
    staging = fs.mkdtempSync(path.join(root, ".tldv-staging-"))
    fs.mkdirSync(path.join(staging, "99_tldv_api"), { recursive: true })
    for (const [name, payload] of Object.entries(bundle)) {
      fs.writeFileSync(path.join(staging, "99_tldv_api", `${name}.json`), `${JSON.stringify(payload, null, 2)}\n`)
    }
    fs.writeFileSync(path.join(staging, "01_transcricao.md"), normalizeTranscript(bundle.transcript))
    fs.renameSync(staging, target)
    promoted = true
    const entry = {
      numero,
      categoria,
      id_tldv: bundle.meeting.id,
      name: safeName(bundle.meeting.name),
      happenedAt: bundle.meeting.happenedAt,
      folder,
      ...(officialMeetingUrl(bundle.meeting.url, bundle.meeting.id) ? { url: bundle.meeting.url } : {})
    }
    const nextManifest = { ...currentManifest, meetings: [...currentManifest.meetings, entry] }
    writeAtomic(path.join(root, "_tldv_manifest.json"), `${JSON.stringify(nextManifest, null, 2)}\n`)
    manifestCommitted = true
    try {
      writeAtomic(path.join(root, "00-Indice_reunioes.md"), renderIndex(nextManifest.meetings))
    } catch (error) {
      return { ...plan, warnings: [`Manifest salvo; indice precisa ser regenerado: ${error.message}`] }
    }
  } catch (error) {
    if (!manifestCommitted && promoted && fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true })
    if (staging && fs.existsSync(staging)) fs.rmSync(staging, { recursive: true, force: true })
    throw error
  } finally {
    if (lock !== undefined) fs.closeSync(lock)
    if (lock !== undefined && fs.existsSync(lockPath)) fs.unlinkSync(lockPath)
  }
  return plan
}

export function loadLocalBundle(file) {
  const source = path.resolve(file)
  if (!fs.existsSync(source) || !fs.lstatSync(source).isFile() || fs.lstatSync(source).isSymbolicLink()) {
    throw new Error("Bundle local TLDV ausente ou invalido")
  }
  const bundle = JSON.parse(fs.readFileSync(source, "utf8"))
  return validateBundle(bundle)
}

/* node:coverage disable -- wrapper CLI; regras de negocio sao testadas pelas funcoes exportadas */
function parseArgs(argv) {
  const args = { dryRun: false }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === "--meeting" || value === "--link") args.meetingId = argv[++index]
    else if (value === "--email") args.email = argv[++index]
    else if (value === "--from") args.from = argv[++index]
    else if (value === "--to") args.to = argv[++index]
    else if (value === "--input") args.input = argv[++index]
    else if (value === "--output") args.outputRoot = argv[++index]
    else if (value === "--workspace") args.workspace = argv[++index]
    else if (value === "--category") args.category = argv[++index]
    else if (value === "--dry-run") args.dryRun = true
    else throw new Error(`Argumento desconhecido: ${value}`)
  }
  return args
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2))
    if (args.email) {
      const result = await listMeetingCandidates({
        email: args.email,
        from: args.from,
        to: args.to,
        apiKey: process.env.TLDV_API_KEY
      })
      console.log(JSON.stringify({ schemaVersion: "adapta-tldv-candidates/v1", ...result }, null, 2))
      return
    }
    if (args.input) {
      args.outputRoot ||= path.join(resolvePlanRoot(args.workspace || process.cwd()), PLAN_PATHS.meetings)
      const bundle = loadLocalBundle(args.input)
      console.log(JSON.stringify(writeMeetingBundle({ bundle, outputRoot: args.outputRoot, category: args.category, dryRun: args.dryRun }), null, 2))
      return
    }
    if (!args.meetingId) throw new Error("Use --email <email> --from <data> --to <data> ou --meeting <id|link> [--workspace <cliente|plano>] [--category <tipo>] [--dry-run]")
    args.outputRoot ||= path.join(resolvePlanRoot(args.workspace || process.cwd()), PLAN_PATHS.meetings)
    const bundle = await fetchMeetingBundle({ meetingId: args.meetingId, apiKey: process.env.TLDV_API_KEY })
    console.log(JSON.stringify(writeMeetingBundle({ bundle, outputRoot: args.outputRoot, category: args.category, dryRun: args.dryRun }), null, 2))
  } catch (error) {
    console.error(`Falha na ingestao tl;dv: ${error.message}`)
    process.exitCode = 1
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
/* node:coverage enable */
