import React from 'react'
import { buildKeywordRegex } from './keyword'

// Wrap every whole-word (plural-tolerant) occurrence of `keyword` in `text`
// with a highlighted <mark>. Returns the original text unchanged when there is
// no keyword. Used by Focus Mode to make the matched term stand out in the
// question, answers and explanation — reinforcing memory.
export function highlightText(text: string | undefined | null, keyword?: string): React.ReactNode {
  if (!text) return text ?? ''
  if (!keyword) return text

  const re = buildKeywordRegex(keyword, 'gi')
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    nodes.push(
      <mark key={i++} className="rounded bg-yellow-200 px-0.5 text-inherit">
        {match[0]}
      </mark>
    )
    lastIndex = match.index + match[0].length
    // Safety against any zero-length match (shouldn't happen with our pattern)
    if (match.index === re.lastIndex) re.lastIndex++
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}
