#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const STATUSES = ["aprovada", "reprovada", "bloqueada"]
const RECEIPT_TITLE = "adapta-task-result/v1"

function resolveWorkspace(workspace) {
  const root = path.resolve(workspace)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Workspace invalido: ${root}`)
  }
  return root
}

function assertString(value, label, file) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Recibo invalido em ${file}: ${label} precisa ser texto nao vazio`)
  }
}

function validateReceipt(receipt, file) {
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) {
    throw new Error(`Recibo invalido em ${file}: esperado objeto JSON`)
  }
  assertString(receipt.taskId, "taskId", file)
  if (!STATUSES.includes(receipt.status)) {
    throw new Error(`Recibo invalido em ${file}: status invalido`)
  }
  if (!Array.isArray(receipt.criteria) || receipt.criteria.length === 0) {
    throw new Error(`Recibo invalido em ${file}: criteria precisa ter pelo menos um item`)
  }
  for (const criterion of receipt.criteria) {
    assertString(criterion?.criterion, "criterion", file)
    if (typeof criterion.passed !== "boolean") {
      throw new Error(`Recibo invalido em ${file}: passed precisa ser booleano`)
    }
    assertString(criterion.proof, "proof", file)
  }
  if (!Array.isArray(receipt.evidence) || receipt.evidence.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`Recibo invalido em ${file}: evidence precisa ser lista de textos`)
  }
  if (!Array.isArray(receipt.residualRisks) || receipt.residualRisks.some((item) => typeof item !== "string")) {
    throw new Error(`Recibo invalido em ${file}: residualRisks precisa ser lista de textos`)
  }
  if (receipt.status === "aprovada" && receipt.criteria.some((criterion) => !criterion.passed)) {
    throw new Error(`Recibo invalido em ${file}: task aprovada possui criterio reprovado`)
  }
  if (receipt.status === "reprovada" && !receipt.criteria.some((criterion) => !criterion.passed)) {
    throw new Error(`Recibo invalido em ${file}: task reprovada nao possui criterio reprovado`)
  }
  if (receipt.status === "bloqueada") {
    const blocker = receipt.blocker
    for (const field of ["reason", "owner", "nextAction"]) assertString(blocker?.[field], `blocker.${field}`, file)
  }
  return receipt
}

function readReceipts(workspace) {
  const directory = path.join(workspace, "05_execucao", "checks", "tasks")
  if (!fs.existsSync(directory)) return []
  if (!fs.statSync(directory).isDirectory()) throw new Error(`Pasta de recibos invalida: ${directory}`)
  return fs.readdirSync(directory)
    .filter((name) => name.toLowerCase().endsWith(".json"))
    .sort((left, right) => left.localeCompare(right))
    .map((name) => {
      const file = path.join(directory, name)
      let receipt
      try {
        receipt = JSON.parse(fs.readFileSync(file, "utf8"))
      } catch (error) {
        throw new Error(`Recibo invalido em ${file}: JSON nao parseavel (${error.message})`)
      }
      return { file, name, receipt: validateReceipt(receipt, file) }
    })
}

function extractPhase(name, taskId) {
  const source = `${name} ${taskId}`.toLowerCase()
  const match = source.match(/(?:^|[^a-z])(?:fase[-_ ]?|f)([1-5])(?:$|[^0-9])/i)
  return match?.[1] || "nao-informada"
}

function readDebtLedger(workspace) {
  const file = path.join(workspace, "05_execucao", "dividas.md")
  if (!fs.existsSync(file)) return { exists: false, total: 0, entries: [], file }
  const entries = fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /adapta-divida:/i.test(line))
  return { exists: true, total: entries.length, entries, file }
}

function emptyPhase() {
  return { total: 0, aprovada: 0, reprovada: 0, bloqueada: 0, failedCriteria: 0, residualRisks: [] }
}

export function buildMethodReport({ workspace }) {
  const root = resolveWorkspace(workspace)
  const receipts = readReceipts(root)
  const statuses = Object.fromEntries(STATUSES.map((status) => [status, 0]))
  const phases = {}
  const risks = new Set()
  let failedCriteria = 0

  for (const item of receipts) {
    const { receipt } = item
    const phase = extractPhase(item.name, receipt.taskId)
    const phaseReport = phases[phase] || emptyPhase()
    statuses[receipt.status] += 1
    phaseReport.total += 1
    phaseReport[receipt.status] += 1
    const failed = receipt.criteria.filter((criterion) => !criterion.passed).length
    failedCriteria += failed
    phaseReport.failedCriteria += failed
    for (const risk of receipt.residualRisks.filter((item) => item.trim() !== "")) {
      risks.add(risk)
      if (!phaseReport.residualRisks.includes(risk)) phaseReport.residualRisks.push(risk)
    }
    phases[phase] = phaseReport
  }

  const debts = readDebtLedger(root)
  return {
    schemaVersion: "adapta-method-report/v1",
    receipts: receipts.map(({ name, receipt }) => ({ name, taskId: receipt.taskId, phase: extractPhase(name, receipt.taskId), status: receipt.status })),
    total: receipts.length,
    statuses,
    reworkRate: receipts.length === 0 ? 0 : statuses.reprovada / receipts.length,
    failedCriteria,
    residualRisks: [...risks],
    phases,
    debts: { total: debts.total, entries: debts.entries, exists: debts.exists },
    activityWindow: {
      status: "nao-registrada",
      reason: `os recibos ${RECEIPT_TITLE} nao possuem timestamp; nenhuma janela foi estimada`
    },
    sources: {
      receipts: "05_execucao/checks/tasks/*.json",
      debts: debts.exists ? "05_execucao/dividas.md" : "05_execucao/dividas.md (ausente)"
    }
  }
}

function percentage(value) {
  return `${(value * 100).toFixed(1).replace(".", ",")}%`
}

function phaseLabel(phase) {
  return phase === "nao-informada" ? "Não informada" : `Fase ${phase}`
}

export function renderMethodReport(report) {
  const phaseRows = Object.entries(report.phases)
    .sort(([left], [right]) => left.localeCompare(right, "pt-BR", { numeric: true }))
    .map(([phase, value]) => `| ${phaseLabel(phase)} | ${value.total} | ${value.aprovada} | ${value.reprovada} | ${value.bloqueada} | ${value.failedCriteria} |`)
  const risks = report.residualRisks.length > 0
    ? report.residualRisks.map((risk) => `- ${risk}`).join("\n")
    : "- Nenhum risco residual registrado nos recibos."
  const debts = report.debts.total > 0
    ? report.debts.entries.map((entry) => `- ${entry}`).join("\n")
    : "- Nenhuma marca `adapta-divida:` encontrada no ledger."
  const rows = phaseRows.length > 0 ? phaseRows.join("\n") : "| Não informada | 0 | 0 | 0 | 0 | 0 |"

  return `# Custo do método

Relatório determinístico dos recibos de verificação de tasks. Ele mede sinais do processo de execução; não estima horas, tokens ou ganho financeiro.

## Resumo geral

- Recibos lidos: ${report.total}
- Aprovadas: ${report.statuses.aprovada}
- Reprovadas: ${report.statuses.reprovada}
- Bloqueadas: ${report.statuses.bloqueada}
- Taxa de retrabalho observada: ${percentage(report.reworkRate)} (proxy: reprovadas / recibos)
- Critérios reprovados: ${report.failedCriteria}
- Riscos residuais distintos: ${report.residualRisks.length}
- Dívidas deliberadas no ledger: ${report.debts.total}

## Resumo por fase

| Fase | Tasks | Aprovadas | Reprovadas | Bloqueadas | Critérios reprovados |
| --- | ---: | ---: | ---: | ---: | ---: |
${rows}

## Riscos residuais

${risks}

## Dívidas deliberadas

${debts}

## Janela de atividade

- Status: não registrada.
- Motivo: ${report.activityWindow.reason}.

## Lacunas manuais

- Horas de consultor: [PREENCHER]
- Tokens: [PREENCHER]
- Baseline de comparação: [PREENCHER]
- Ganho financeiro ou de tempo: [PREENCHER somente com evidência comparável]

## Fontes

- Recibos: ${report.sources.receipts}
- Ledger: ${report.sources.debts}
`
}

export function writeMethodReport({ report, output }) {
  if (!output) throw new Error("Saida obrigatoria para escrever o relatorio")
  const target = path.resolve(output)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, renderMethodReport(report), { encoding: "utf8" })
  return target
}

function parseArgs(argv) {
  const args = { workspace: process.cwd() }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === "--workspace") args.workspace = argv[++index]
    else if (value === "--out") args.out = argv[++index]
    else throw new Error(`Argumento desconhecido: ${value}`)
  }
  return args
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2))
    const report = buildMethodReport(args)
    if (args.out) {
      const output = writeMethodReport({ report, output: args.out })
      console.log(`Relatorio escrito em ${output}`)
    } else {
      process.stdout.write(renderMethodReport(report))
    }
  } catch (error) {
    console.error(`Relatorio nao gerado: ${error.message}`)
    process.exitCode = 1
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
