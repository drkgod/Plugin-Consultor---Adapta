const TASKS_HEADING = /^## Tasks\b.*$/m
const NEXT_SECTION = /^##\s+\S.*$/m
const SEPARATOR_ROW = /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/
const MIN_OPERATIONAL_COLUMNS = 9

export function extractTasksSection(body) {
  const heading = body.match(TASKS_HEADING)
  if (!heading || heading.index === undefined) return null
  const start = heading.index + heading[0].length
  const rest = body.slice(start)
  const next = rest.match(NEXT_SECTION)
  return next && next.index !== undefined ? rest.slice(0, next.index) : rest
}

function parseTableCells(line) {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return null
  if (SEPARATOR_ROW.test(trimmed)) return null
  const cells = trimmed.split("|").slice(1, -1).map((cell) => cell.trim())
  if (cells.length < 4) return null
  const nonEmptyCells = cells.filter(Boolean)
  if (nonEmptyCells.length < 4) return null
  const normalizedCells = cells.map((cell) => cell.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))
  const headerCells = new Set(["id", "task", "tasks", "dono", "spec", "criterio", "checklist/aceite", "recorte da prova", "status"])
  const headerHits = normalizedCells.filter((cell) => headerCells.has(cell)).length
  return headerHits >= 3 ? null : cells
}

export function tasksTableStatus(body) {
  const section = extractTasksSection(body)
  if (section === null) return { ok: false, reason: "missing-section" }
  const dataRows = section.split(/\r?\n/).map(parseTableCells).filter(Boolean)
  if (dataRows.length === 0) return { ok: false, reason: "empty-table" }
  const detailedRows = dataRows.filter((cells) => cells.length >= MIN_OPERATIONAL_COLUMNS)
  return detailedRows.length === dataRows.length
    ? { ok: true, rows: dataRows }
    : { ok: false, reason: "thin-table" }
}

export function assertPopulatedTasksTable(body, label) {
  const status = tasksTableStatus(body)
  if (status.ok) return
  if (status.reason === "missing-section") {
    throw new Error(`${label} nao contem a tabela Tasks consumida pelo plugin do cliente`)
  }
  if (status.reason === "thin-table") {
    throw new Error(`${label} contem tabela Tasks sem detalhes operacionais; rode /adapta:gerar-tasks antes`)
  }
  throw new Error(`${label} contem ## Tasks sem linhas de task executaveis; rode /adapta:gerar-tasks antes`)
}
