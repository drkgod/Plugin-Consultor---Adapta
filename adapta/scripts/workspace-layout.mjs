import fs from "node:fs"
import path from "node:path"

export const PLAN_PATHS = Object.freeze({
  status: "STATUS.md",
  changelog: "changelog.md",
  documentIndex: path.join("01-documento", "00-sumario.md"),
  meetings: "02-Reuniao",
  meetingIndex: path.join("02-Reuniao", "00-Indice_reunioes.md"),
  tldvManifest: path.join("02-Reuniao", "_tldv_manifest.json"),
  project: "03-Projeto",
  dmo: path.join("03-Projeto", "00-DMO.md"),
  baseScope: path.join("03-Projeto", "01-Escopo.md"),
  directions: path.join("03-Projeto", "direcoes.md"),
  requirements: path.join("03-Projeto", "requisitos.md"),
  scopeReview: path.join("03-Projeto", "revisao-do-escopo.md"),
  criticalAnalysis: path.join("03-Projeto", "analise-critica.md"),
  consultantAnalysis: path.join("03-Projeto", "analise-do-consultor.md"),
  definitiveScope: path.join("03-Projeto", "02-Escopo-Definitivo.md"),
  decisions: path.join("03-Projeto", "decisoes-do-projeto.md"),
  actionPlan: path.join("03-Projeto", "02-Plano_de_acao"),
  traceability: path.join("03-Projeto", "02-Plano_de_acao", "matriz-de-rastreabilidade.md"),
  processMapping: "04-Mapeamento-Processos",
  processContext: path.join("04-Mapeamento-Processos", "00-Contexto"),
  mappedProcesses: path.join("04-Mapeamento-Processos", "02-Processos_mapeados"),
  checks: path.join(".adapta", "checks"),
  taskReceipts: path.join(".adapta", "checks", "tasks"),
  handoff: path.join(".adapta", "handoff"),
  evolutions: path.join(".adapta", "evolucoes"),
  learnings: path.join(".adapta", "aprendizados"),
  debug: path.join(".adapta", "debug"),
  result: path.join(".adapta", "resultado"),
  orchestration: path.join(".adapta", "orquestracao"),
  debtLedger: path.join(".adapta", "dividas.md"),
  memory: path.join(".adapta", "memory", "latest.json")
})

const PLAN_ROOT_PATTERN = /^Plano\s*[—–-]\s*.+$/iu

function isDirectory(directory) {
  return fs.existsSync(directory) && fs.statSync(directory).isDirectory() && !fs.lstatSync(directory).isSymbolicLink()
}

function hasProjectDirectory(directory) {
  return isDirectory(path.join(directory, PLAN_PATHS.project))
}

export function resolvePlanRoot(workspace) {
  const requested = path.resolve(workspace)
  if (!isDirectory(requested)) throw new Error(`Workspace invalido: ${requested}`)
  if (hasProjectDirectory(requested)) return requested

  const candidates = fs.readdirSync(requested, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink() && PLAN_ROOT_PATTERN.test(entry.name))
    .map((entry) => path.join(requested, entry.name))
    .filter(hasProjectDirectory)

  if (candidates.length === 1) return candidates[0]
  if (candidates.length > 1) {
    throw new Error(`Mais de um Plano — <id> encontrado em ${requested}; informe a pasta exata do plano`)
  }
  throw new Error(`Plano atual nao encontrado em ${requested}; esperado 03-Projeto/ ou um unico filho Plano — <id>`)
}

function validPhase(value) {
  const phase = Number(value)
  if (!Number.isInteger(phase) || phase < 1 || phase > 5) throw new Error("A fase deve ser um inteiro entre 1 e 5")
  return phase
}

export function phasePaths(planRoot, phaseNumber) {
  const phase = validPhase(phaseNumber)
  const directoryName = `${String(phase).padStart(2, "0")}.Fase_${phase}`
  const directory = path.join(planRoot, PLAN_PATHS.actionPlan, directoryName)
  return {
    phase,
    directory,
    taskList: path.join(planRoot, PLAN_PATHS.actionPlan, "00.tasks_per_fase", `fase_${phase}.md`),
    tasks: path.join(directory, "00-Tasks_Gerais.md"),
    specs: path.join(directory, "01-SPECs"),
    specIndex: path.join(directory, "01-SPECs", "00-INDICE.md")
  }
}

export function planPath(planRoot, key) {
  const relative = PLAN_PATHS[key]
  if (!relative) throw new Error(`Caminho do plano desconhecido: ${key}`)
  return path.join(planRoot, relative)
}

export function toPlanRelative(planRoot, target) {
  return path.relative(planRoot, target).replaceAll(path.sep, "/")
}
