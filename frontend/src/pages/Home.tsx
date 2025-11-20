import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import styles from '@/styles/Home.module.css'

export const Home = () => {
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqData = [
    {
      question: 'Что такое CTF?',
      answer:
        'CTF (Capture The Flag) — это соревнование по информационной безопасности, в котором участники решают различные задачи, связанные с обнаружением, эксплуатацией и защитой уязвимостей в компьютерных системах.',
    },
    {
      question: 'Что такое task-based CTF?',
      answer:
        'Task-based — это формат CTF, в котором игрокам предоставляется набор заданий, где требуется найти и отправить ответ. Ответ даётся в виде флага, состоящего из набора символов или произвольной фразы. За верное выполнение каждого задания команда получает очки. Чем сложнее таск, тем больше очков даётся за правильный ответ.',
    },
    {
      question: 'Какие категории существуют в CTF?',
      answer:
        'Категории в CTF включают криптографию, реверс-инжиниринг, бинарную эксплуатацию, веб-безопасность, форензику, стеганографию, программирование и OSINT, каждая из которых проверяет разные аспекты знаний в информационной безопасности.',
    },
    {
      question: 'Что нужно, чтобы начать решать CTF?',
      answer: 'Достаточно иметь желание, а навыки придут с практикой.',
    },
    {
      question: 'Зачем мне это нужно?',
      answer:
        'CTF даёт возможность изучить кибербезопасность на практике, прокачать навыки, завести полезные знакомства и весело провести время.',
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>NPE Tasks</h1>
        <p className={styles.subtitle}>
          Платформа для решения CTF-задач. Проверьте свои навыки в области кибербезопасности, криптографии,
          стеганографии и OSINT.
        </p>
        <div className={styles.buttonGroup}>
          {user ? (
            <Link to="/tasks" className={styles.button}>
              К задачам
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🔐</div>
          <h3 className={styles.featureTitle}>Криптография</h3>
          <p className={styles.featureDescription}>Решайте задачи по шифрованию и дешифровке данных</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🕵️</div>
          <h3 className={styles.featureTitle}>OSINT</h3>
          <p className={styles.featureDescription}>Используйте открытые источники для поиска информации</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🖼️</div>
          <h3 className={styles.featureTitle}>Стеганография</h3>
          <p className={styles.featureDescription}>Находите скрытые данные в изображениях и файлах</p>
        </div>
      </div>

      <div className={styles.faqSection}>
        <h2 className={styles.faqTitle}>Часто задаваемые вопросы</h2>
        <div className={styles.faqList}>
          {faqData.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={`${styles.faqQuestion} ${openFaq === index ? styles.faqQuestionOpen : ''}`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className={styles.faqIcon}>{openFaq === index ? '−' : '+'}</span>
              </button>
              {openFaq === index && (
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <h3 className={styles.footerTitle}>Связаться с нами</h3>
        <div className={styles.contactButtons}>
          <a href="https://t.me/fukurojo" target="_blank" rel="noopener noreferrer" className={styles.contactButton}>
            <span className={styles.contactIcon}>📱</span>
            Telegram
          </a>
          <a href="mailto:contact@example.com" className={styles.contactButton}>
            <span className={styles.contactIcon}>✉️</span>
            Email
          </a>
        </div>
      </footer>
    </div>
  )
}
