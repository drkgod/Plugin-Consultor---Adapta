import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

function digest(plan) {
  return crypto.createHash("sha256").update(JSON.stringify(plan)).digest("hex")
}

export function writePlanEnvelope(plan, outputFile) {
  const file = path.resolve(outputFile)
  const parent = path.dirname(file)
  fs.mkdirSync(parent, { recursive: true })
  if (fs.lstatSync(parent).isSymbolicLink()) throw new Error("Pasta do plano nao pode ser link simbolico")
  const envelope = {
    schemaVersion: "adapta-sealed-plan/v1",
    planDigest: digest(plan),
    plan
  }
  const staging = `${file}.staging-${crypto.randomUUID()}`
  try {
    fs.writeFileSync(staging, `${JSON.stringify(envelope, null, 2)}\n`, { flag: "wx", mode: 0o600 })
    fs.renameSync(staging, file)
  } catch (error) {
    if (fs.existsSync(staging)) fs.unlinkSync(staging)
    throw error
  }
  return { file, digest: envelope.planDigest }
}

export function readPlanEnvelope(inputFile, expectedPlanSchema) {
  const file = path.resolve(inputFile)
  if (!fs.existsSync(file)) throw new Error(`Plano selado ausente: ${file}`)
  const stat = fs.lstatSync(file)
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`Plano selado inseguro: ${file}`)
  const envelope = JSON.parse(fs.readFileSync(file, "utf8"))
  if (envelope.schemaVersion !== "adapta-sealed-plan/v1" || !envelope.plan) throw new Error("Envelope do plano invalido")
  if (digest(envelope.plan) !== envelope.planDigest) throw new Error("Digest do plano selado diverge")
  if (envelope.plan.schemaVersion !== expectedPlanSchema) throw new Error("Tipo de plano selado incorreto")
  return { file, digest: envelope.planDigest, plan: envelope.plan }
}
