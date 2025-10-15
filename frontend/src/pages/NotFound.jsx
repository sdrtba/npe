import { Link } from 'react-router-dom'
import styles from '../styles/notFound.module.css'

export const NotFound = () => {
  return (
    <div className={`container ${styles.notfound}`}>
      <h1>Страница не найдена!</h1>
      <p>Похоже на то, что такой страницы не существует.</p>
      <Link to="/">
        <button className="btn">На главную</button>
      </Link>
    </div>
  )
}
