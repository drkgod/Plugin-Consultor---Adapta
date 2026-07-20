export function parseCheckStatus(body) {
  if (typeof body !== "string") throw new Error("Check precisa ser texto")
  const options = [...body.matchAll(/^- \[([ xX])\]\s+(APROVADO COM RESSALVAS|APROVADO|REPROVADO)\b/gm)]
  if (options.length !== 3) throw new Error("Check precisa conter as tres opcoes canonicas de resultado")
  const labels = options.map((match) => match[2].toUpperCase())
  if (new Set(labels).size !== 3 || !["APROVADO", "APROVADO COM RESSALVAS", "REPROVADO"].every((label) => labels.includes(label))) {
    throw new Error("Check precisa conter uma unica ocorrencia de cada resultado canonico")
  }
  const selected = options.filter((match) => match[1].toLowerCase() === "x")
  if (selected.length !== 1) throw new Error("Check precisa ter exatamente um resultado selecionado")
  for (const label of ["Data", "Validadores", "O que foi validado"]) {
    const match = body.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, "i"))
    if (!match || /^\[|PREENCHER|AAAA-MM-DD/i.test(match[1].trim())) throw new Error(`Check sem ${label} preenchido`)
  }
  const evidence = body.match(/## O que foi conferido\s+([\s\S]*?)(?:\n## |$)/i)?.[1] || ""
  if (!/^-\s+(?!\[)(?!PREENCHER)(?!afirma[cç][aã]o).+/im.test(evidence)) throw new Error("Check sem evidencia conferida")
  const label = selected[0][2].toUpperCase()
  if (label === "APROVADO COM RESSALVAS") {
    const pending = body.match(/## Pend[eê]ncias geradas\s+([\s\S]*?)(?:\n## |$)/i)?.[1] || ""
    if (!/^-\s+.+dono\s*[:=-]\s*.+prazo\s*[:=-]\s*.+/im.test(pending)) {
      throw new Error("Aprovacao com ressalvas exige pendencia com dono e prazo")
    }
  }
  return {
    status: label === "REPROVADO" ? "REPROVADO" : label === "APROVADO COM RESSALVAS" ? "APROVADO_COM_RESSALVAS" : "APROVADO",
    canAdvance: label !== "REPROVADO"
  }
}
