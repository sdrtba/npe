import { Link } from 'react-router-dom'
import styles from '@/styles/LearnIndex.module.css'

export const LearnIndex = () => {
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
        <p className={styles.subtitle}>
          Изучайте кибербезопасность от основ до продвинутых техник. Выберите категорию для начала обучения.
        </p>
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
              <span className={`${styles.difficultyBadge} ${styles[`difficulty${category.difficulty}`]}`}>
                {category.difficulty === 'easy' && '🟢 Легко'}
                {category.difficulty === 'medium' && '🟡 Средне'}
                {category.difficulty === 'hard' && '🔴 Сложно'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>💡</div>
          <h3 className={styles.infoTitle}>Интерактивное обучение</h3>
          <p className={styles.infoText}>
            Каждая тема содержит теорию, примеры и практические задания для закрепления материала
          </p>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>🎯</div>
          <h3 className={styles.infoTitle}>От простого к сложному</h3>
          <p className={styles.infoText}>
            Материалы структурированы по уровню сложности - начните с основ и двигайтесь дальше
          </p>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>🚀</div>
          <h3 className={styles.infoTitle}>Практика</h3>
          <p className={styles.infoText}>
            После изучения теории переходите к решению реальных CTF-задач в соответствующих категориях
          </p>
        </div>
      </div>
    </div>
  )
}
