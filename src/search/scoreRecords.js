const ignored = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'your', 'into'])

export function scoreRecords(query, records, limit = 10) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter((word) => word.length > 1 && !ignored.has(word))
  if (!terms.length) return []
  return records.map((record) => {
    const title = record.title.toLocaleLowerCase()
    const tags = `${record.type} ${record.room}`.toLocaleLowerCase()
    const body = record.text.toLocaleLowerCase()
    let score = 0
    for (const term of terms) {
      if (title === term) score += 18
      else if (title.split(/\W+/).some((word) => word === term)) score += 12
      else if (title.includes(term)) score += 8
      if (tags.split(/\W+/).some((word) => word === term)) score += 5
      else if (tags.includes(term)) score += 3
      if (body.split(/\W+/).some((word) => word === term)) score += 2
      else if (body.includes(term)) score += 1
    }
    return { ...record, score }
  }).filter((record) => record.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)
}
