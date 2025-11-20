import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import fm from 'front-matter'
import { loadArticle } from '@/api/content'
import styles from '@/styles/ArticlePage.module.css'

export const LearnDetailsPage = () => {
  const { category, slug } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [meta, setMeta] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!category || !slug) return

    setLoading(true)
    setError(null)

    loadArticle(category, slug)
      .then((raw) => {
        const parsed = fm(raw)
        setMeta(parsed.attributes)
        setContent(parsed.body)
      })
      .catch((err) => {
        console.error(err)
        setError('Не удалось загрузить статью')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [category, slug])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка статьи...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorMessage}>{error}</p>
          <button onClick={() => navigate(`/learn/${category}`)} className={styles.backButton}>
            Вернуться к категории
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(`/learn/${category}`)} className={styles.backLink}>
        ← Назад к категории
      </button>

      <article className={styles.article}>
        <div className={styles.articleHeader}>
          <h1 className={styles.title}>{meta.title || 'Без названия'}</h1>
          {meta.date && (
            <div className={styles.meta}>
              <span className={styles.date}>📅 {meta.date}</span>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
