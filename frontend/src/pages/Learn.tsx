import { Link } from 'react-router-dom'
import styles from '@/styles/LearnIndex.module.css'

export const Learn = () => {
  const categories = [
    {
      id: 'cryptography',
      name: 'Криптография',
      description: 'Изучите основы шифрования, хеширования и криптографических протоколов',
      icon: '🔐',
      topics: 12,
      difficulty: 'medium',
    },
    {
      id: 'stegano',
      name: 'Стеганография',
      description: 'Научитесь скрывать и находить информацию в изображениях, аудио и других файлах',
      icon: '🖼️',
      topics: 8,
      difficulty: 'easy',
    },
    {
      id: 'osint',
      name: 'OSINT',
      description: 'Освойте методы поиска и анализа информации из открытых источников',
      icon: '🕵️',
      topics: 15,
      difficulty: 'easy',
    },
    {
      id: 'web',
      name: 'Веб-безопасность',
      description: 'Изучите уязвимости веб-приложений: XSS, SQL-injection, CSRF и другие',
      icon: '🌐',
      topics: 20,
      difficulty: 'hard',
    },
    {
      id: 'forensics',
      name: 'Форензика',
      description: 'Анализ файловых систем, памяти и логов для расследования инцидентов',
      icon: '🔬',
      topics: 10,
      difficulty: 'hard',
    },
    {
      id: 'reverse',
      name: 'Реверс-инжиниринг',
      description: 'Разбор и анализ программ, понимание работы бинарных файлов',
      icon: '⚙️',
      topics: 18,
      difficulty: 'hard',
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Обучение</h1>
      </div>

      <div className={styles.categories}>
        {categories.map((category) => (
          <Link key={category.id} to={`/learn/${category.id}`} className={styles.categoryCard}>
            <div className={styles.categoryIcon}>{category.icon}</div>
            <h3 className={styles.categoryName}>{category.name}</h3>
            <p className={styles.categoryDescription}>{category.description}</p>

            <div className={styles.categoryFooter}>
              <span className={styles.topicsCount}>
                📚 {category.topics} {category.topics === 1 ? 'тема' : category.topics < 5 ? 'темы' : 'тем'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
