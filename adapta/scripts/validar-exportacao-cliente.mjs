#!/usr/bin/env node
import fs from "node:fs"
import crypto from "node:crypto"
import path from "node:path"
import process from "node:process"
import { redactSensitive } from "./redact-sensitive.mjs"

const target = process.argv[2]
const errors = []
const warnings = []

if (!target) {
  console.error("Uso: node plugins/adapta/scripts/validar-exportacao-cliente.mjs <repo-cliente>")
  process.exit(2)
}

const root = path.resolve(target)

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/")
}

function exists(file) {
  return fs.existsSync(file)
}

function inside(base, candidate) {
  const relative = path.relative(path.resolve(base), path.resolve(candidate))
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")
}

function listFiles(dir) {
  const out = []
  if (!exists(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue
    const full = path.join(dir, entry.name)
    const stat = fs.lstatSync(full)
    if (stat.isSymbolicLink()) {
      errors.push(`Link simbolico proibido na exportacao: ${rel(full)}`)
    } else if (entry.isDirectory()) {
      out.push(...listFiles(full))
    } else {
      out.push(full)
    }
  }
  return out
}

if (!exists(root) || !fs.statSync(root).isDirectory()) {
  console.error(`Destino nao existe ou nao e pasta: ${root}`)
  process.exit(2)
}

const requiredPaths = [
  "CLAUDE.md",
  "AGENTS.md",
  "STATUS.md",
  "changelog.md",
  "handoff-manifest.json",
  "01_projeto",
  "02_reunioes",
  "03_documentos",
  "04_fase-atual",
  "04_fase-atual/fase.md",
  "05_entregas",
  "06_notas",
  ".claude/settings.json"
]

const requiredDirectories = new Set([
  "01_projeto",
  "02_reunioes",
  "03_documentos",
  "04_fase-atual",
  "05_entregas",
  "06_notas"
])

for (const entry of requiredPaths) {
  const file = path.join(root, entry)
  if (!exists(file)) {
    errors.push(`Obrigatorio ausente no repo do cliente: ${entry}`)
  } else {
    const stat = fs.lstatSync(file)
    if (stat.isSymbolicLink()) errors.push(`Obrigatorio nao pode ser link simbolico: ${entry}`)
    else if (requiredDirectories.has(entry) && !stat.isDirectory()) errors.push(`Obrigatorio deve ser pasta: ${entry}`)
    else if (!requiredDirectories.has(entry) && !stat.isFile()) errors.push(`Obrigatorio deve ser arquivo: ${entry}`)
  }
}

const settingsPath = path.join(root, ".claude", "settings.json")
if (exists(settingsPath)) {
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"))
    if (!settings.enabledPlugins?.["adapta-cliente@adapta-native"]) {
      errors.push(".claude/settings.json deve habilitar adapta-cliente@adapta-native")
    }
  } catch (error) {
    errors.push(`.claude/settings.json invalido: ${error.message}`)
  }
}

const manifestPath = path.join(root, "handoff-manifest.json")
const manifestSeen = new Set()
if (exists(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    if (manifest.schemaVersion !== "adapta-cliente-handoff/v1") {
      errors.push("handoff-manifest.json usa schemaVersion invalida")
    }
    if (!Number.isInteger(manifest.phase) || manifest.phase < 1 || manifest.phase > 5) {
      errors.push("handoff-manifest.json precisa declarar fase entre 1 e 5")
    }
    if (!/^\d+\.\d+\.\d+$/.test(manifest.versions?.adapta || "") || !/^\d+\.\d+\.\d+$/.test(manifest.versions?.adaptaCliente || "")) {
      errors.push("handoff-manifest.json precisa registrar versoes semver dos plugins")
    }
    if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
      errors.push("handoff-manifest.json precisa registrar arquivos e hashes")
    } else {
      const seen = new Set()
      const seenResolved = new Set()
      const allowedClassifications = new Set(["template-publico", "fase-atual", "spec-fase-atual"])
      for (const entry of manifest.files) {
        if (!entry || typeof entry.path !== "string" || path.isAbsolute(entry.path) || entry.path.includes("\\")) {
          errors.push("handoff-manifest.json contem path invalido")
          continue
        }
        const canonical = path.posix.normalize(entry.path)
        if (canonical !== entry.path || canonical.startsWith("../") || canonical.includes("/../")) {
          errors.push(`handoff-manifest.json contem path nao canonico: ${entry.path}`)
          continue
        }
        if (!allowedClassifications.has(entry.classification)) {
          errors.push(`handoff-manifest.json usa classificacao invalida: ${entry.path}`)
        }
        if (entry.classification === "fase-atual" && entry.path !== "04_fase-atual/fase.md") {
          errors.push(`Classificacao fase-atual incoerente: ${entry.path}`)
        }
        if (entry.classification === "spec-fase-atual" && (!entry.path.startsWith("04_fase-atual/specs/") || path.extname(entry.path).toLowerCase() !== ".md")) {
          errors.push(`Classificacao spec-fase-atual incoerente: ${entry.path}`)
        }
        const file = path.resolve(root, entry.path)
        if (!inside(root, file)) {
          errors.push(`handoff-manifest.json tenta escapar do repo: ${entry.path}`)
          continue
        }
        if (seen.has(entry.path)) errors.push(`handoff-manifest.json repete path: ${entry.path}`)
        if (seenResolved.has(file)) errors.push(`handoff-manifest.json repete destino resolvido: ${entry.path}`)
        seen.add(entry.path)
        seenResolved.add(file)
        manifestSeen.add(entry.path)
        if (!exists(file) || !fs.lstatSync(file).isFile() || fs.lstatSync(file).isSymbolicLink()) {
          errors.push(`Arquivo do manifesto ausente ou invalido: ${entry.path}`)
          continue
        }
        if (!/^[a-f0-9]{64}$/.test(entry.sha256 || "") || sha256(file) !== entry.sha256) {
          errors.push(`Hash divergente no manifesto: ${entry.path}`)
        }
      }
      for (const required of ["04_fase-atual/fase.md"]) {
        if (!seen.has(required)) errors.push(`Manifesto nao sela artefato obrigatorio: ${required}`)
      }
      if (![...seen].some((entry) => entry.startsWith("04_fase-atual/specs/"))) {
        errors.push("Manifesto precisa selar pelo menos uma SPEC da fase atual")
      }
    }
  } catch (error) {
    errors.push(`handoff-manifest.json invalido: ${error.message}`)
  }
}

const forbiddenFragments = [
  "00_metodologia/",
  "01_playbooks/",
  "02_prompts/",
  "03_templates/",
  "04_governanca/",
  "05_template-consultor/",
  "06_template-cliente/",
  "plugins/adapta/",
  "04_plano/proposta/",
  "03_discovery/",
  "05_execucao/checks/check-escopo",
  "05_execucao/checks/check-cliente"
]

const forbiddenNamePatterns = [
  /(^|\/)proposta[^/]*\.md$/i,
  /(^|\/)analise-critica\.md$/i,
  /(^|\/)baseline\.md$/i,
  /bloqueadores/i,
  /folha-de-rosto/i,
  /\.(mp4|mov|webm|m4a|mp3|wav)$/i,
  /(^|\/)\.env(\.|$)/i,
  /\.(pem|key|p12|pfx|zip|tar|gz|tgz|7z|rar|sqlite|db)$/i,
  /(senha|credencial|secret|token)/i
]

const textExtensions = new Set([
  "",
  ".css",
  ".csv",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".sh",
  ".txt",
  ".xml",
  ".yaml",
  ".yml"
])

const maxTextScanBytes = 2 * 1024 * 1024

function shouldScanText(file) {
  return textExtensions.has(path.extname(file).toLowerCase())
}

const files = listFiles(root)
for (const file of files) {
  const relative = rel(file)
  const normalized = `${relative.toLowerCase()}/`
  for (const fragment of forbiddenFragments) {
    if (normalized.includes(fragment.toLowerCase())) {
      errors.push(`Artefato interno proibido no repo do cliente: ${relative}`)
      break
    }
  }
  for (const pattern of forbiddenNamePatterns) {
    if (pattern.test(relative)) {
      errors.push(`Arquivo sensivel/interno exige revisao manual antes de publicar: ${relative}`)
      break
    }
  }
  if (!relative.startsWith("05_entregas/") && /(^|\/)fase-[2-5]\.md$/i.test(relative)) {
    errors.push(`Fase futura fora de 05_entregas nao deve ir ao cliente: ${relative}`)
  }
  if (shouldScanText(relative)) {
    const stat = fs.statSync(file)
    if (stat.size > maxTextScanBytes) {
      errors.push(`Arquivo textual grande exige revisao fora do export automatizado: ${relative}`)
    } else {
      const body = fs.readFileSync(file, "utf8")
      if (body.includes("[PREENCHER]")) {
        errors.push(`Placeholder [PREENCHER] ainda presente: ${relative}`)
      }
      if (redactSensitive(body) !== body) {
        errors.push(`Possivel segredo encontrado no conteudo: ${relative}`)
      }
    }
  }
}

const specsRoot = path.join(root, "04_fase-atual", "specs")
if (!exists(specsRoot) || fs.lstatSync(specsRoot).isSymbolicLink() || !fs.lstatSync(specsRoot).isDirectory()) {
  errors.push("04_fase-atual/specs/ ausente ou invalida; handoff exige pasta de SPECs da fase atual")
}

const activeRoot = path.join(root, "04_fase-atual")
if (exists(activeRoot) && fs.lstatSync(activeRoot).isDirectory()) {
  for (const file of listFiles(activeRoot)) {
    const relative = rel(file)
    if (!manifestSeen.has(relative)) errors.push(`Arquivo ativo nao selado pelo manifesto: ${relative}`)
  }
}

const currentPhasePath = path.join(root, "04_fase-atual", "fase.md")
if (exists(currentPhasePath) && !/^## Tasks\b/m.test(fs.readFileSync(currentPhasePath, "utf8"))) {
  errors.push("04_fase-atual/fase.md precisa conter a tabela Tasks consumida pelo plugin do cliente")
}

for (const warning of warnings) console.warn(`AVISO: ${warning}`)
if (errors.length > 0) {
  console.error("Exportacao do cliente reprovada:")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Exportacao do cliente validada: ${root}`)
