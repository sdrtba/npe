import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { loadCategory, type ArticleMeta } from '@/api/content'
import styles from '@/styles/CategoryPage.module.css'

const categoryInfo: Record<string, { name: string; icon: string; description: string }> = {
  cryptography: {
    name: 'Криптография',
    icon: '🔐',
    description: 'Основы шифрования, хеширования и криптографических протоколов',
  },
  steganography: {
    name: 'Стеганография',
    icon: '🖼️',
    description: 'Скрытие и поиск информации в изображениях, аудио и других файлах',
  },
  osint: {
    name: 'OSINT',
    icon: '🕵️',
    description: 'Методы поиска и анализа информации из открытых источников',
  },
  web: {
    name: 'Веб-безопасность',
    icon: '🌐',
    description: 'Уязвимости веб-приложений: XSS, SQL-injection, CSRF и другие',
  },
  forensics: {
    name: 'Форензика',
    icon: '🔬',
    description: 'Анализ файловых систем, памяти и логов',
  },
  reverse: {
    name: 'Реверс-инжиниринг',
    icon: '⚙️',
    description: 'Разбор и анализ программ, понимание работы бинарных файлов',
  },
}

export const LearnCategories = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const [list, setList] = useState<ArticleMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const info = category ? categoryInfo[category] : null

  useEffect(() => {
    if (!category) return

    setLoading(true)
    setError(null)

    loadCategory(category)
      .then((articles) => {
        setList(articles)
      })
      .catch((err) => {
        console.error(err)
        setError('Не удалось загрузить статьи')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [category])

  if (!category) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorMessage}>Категория не указана</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка статей...</p>
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
          <button onClick={() => navigate('/learn')} className={styles.backButton}>
            Вернуться к обучению
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.categoryInfo}>
          <span className={styles.categoryIcon}>{info?.icon || '📁'}</span>
          <div>
            <h1 className={styles.title}>{info?.name || category}</h1>
            <p className={styles.description}>{info?.description || 'Обучающие материалы'}</p>
          </div>
        </div>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            📚 {list.length} {list.length === 1 ? 'статья' : list.length < 5 ? 'статьи' : 'статей'}
          </span>
        </div>
      </div>

      {list.length > 0 ? (
        <div className={styles.articlesList}>
          {list.map((article) => (
            <Link key={article.slug} to={`/learn/${category}/${article.slug}`} className={styles.articleCard}>
              <div className={styles.articleHeader}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
              </div>

              {<p className={styles.articleDescription}>{'article.description'}</p>}

              <div className={styles.articleFooter}>
                <span className={styles.readMore}>Читать →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <p className={styles.emptyText}>В этой категории пока нет статей</p>
        </div>
      )}
    </div>
  )
}
