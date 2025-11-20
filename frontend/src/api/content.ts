export type ArticleMeta = { slug: string; title: string; date?: string; tags?: string[] }
export type ContentIndex = Record<string, ArticleMeta[]>

const INDEX_URL = '/content/index.json'

export async function loadIndex(): Promise<ContentIndex> {
  const res = await fetch(INDEX_URL, { cache: 'no-cache' })
  if (!res.ok) throw new Response('Index not found', { status: 500 })
  return res.json()
}

export async function loadCategory(category: string) {
  const index = await loadIndex()
  const list = index[category] ?? []
  return list.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

export async function loadArticle(category: string, slug: string) {
  const mdUrl = `/content/${category}/${slug}/index.md`
  const res = await fetch(mdUrl, { cache: 'no-cache' })
  if (!res.ok) throw new Response('Article not found', { status: 404 })
  const text = await res.text()
  return text
}
