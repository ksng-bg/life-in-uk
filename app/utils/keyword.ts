// Keyword matching for Focus Mode.
// A "keyword" is a single word (e.g. "Parliament", "Churchill") or a year (e.g. "1918").
// Matching is case-insensitive, whole-word, and tolerant of simple plurals:
//   "king" -> matches "king" and "kings" (but NOT "kingdom" or "looking")

// A valid keyword is a single non-empty token with no whitespace.
export function isValidKeyword(raw: string): boolean {
  const k = raw.trim()
  return k.length > 0 && !/\s/.test(k)
}

// Build a regex that matches the keyword as a whole word, allowing a simple
// plural suffix (s / es). Escapes regex metacharacters in the keyword.
export function buildKeywordRegex(keyword: string, flags = 'i'): RegExp {
  const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}(?:es|s)?\\b`, flags)
}

// True if the keyword appears in any of the supplied text fields.
export function textMatchesKeyword(keyword: string, ...texts: (string | undefined | null)[]): boolean {
  const re = buildKeywordRegex(keyword)
  return texts.some(t => !!t && re.test(t))
}
