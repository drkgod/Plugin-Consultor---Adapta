export function redactSensitive(value) {
  return String(value)
    .replace(/-----BEGIN [^-\n]*PRIVATE KEY-----[\s\S]*?-----END [^-\n]*PRIVATE KEY-----/gi, "[REDACTED PEM]")
    .replace(/\b([a-z][a-z0-9+.-]*:\/\/)([^/\s:@]+):([^@\s/]+)@/gi, "$1[REDACTED]@")
    .replace(/((?:["']?)[A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PASSWD|API_KEY|ACCESS_KEY|PRIVATE_KEY|DATABASE_URL|DB_URL)(?:["']?)\s*[:=]\s*)(?:"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|[^\s,}\n]+)/gi, '$1"[REDACTED]"')
    .replace(/(api[_-]?key|access[_-]?token|password|secret)\s*[:=]\s*\S+/gi, "$1=[REDACTED]")
    .replace(/(["']?authorization["']?\s*:\s*)(?:"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'|[^\r\n]+)/gi, '$1"[REDACTED]"')
    .replace(/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16})\b/g, "[REDACTED TOKEN]")
}

const sensitiveKey = /(?:authorization|token|secret|password|passwd|api[_-]?key|access[_-]?key|private[_-]?key|database[_-]?url|db[_-]?url)/i

export function redactDeep(value) {
  if (typeof value === "string") return redactSensitive(value)
  if (Array.isArray(value)) return value.map(redactDeep)
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sensitiveKey.test(key) ? "[REDACTED]" : redactDeep(child)]))
  }
  return value
}
