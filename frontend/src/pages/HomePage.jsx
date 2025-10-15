import React from 'react'
import { Link } from 'react-router-dom'

export const HomePage = () => {
  return (
    <main className="container" style={{ paddingTop: '2rem', display: 'grid' }}>
      <section className="grid">
        <div style={{ paddingTop: '10rem' }}>
          <h1>Добро пожаловать в Контактник</h1>
          <p>
            Управляй своими контактами быстро, удобно и безопасно. Добавляй, редактируй и удаляй
            людей, чтобы ничего не забыть.
          </p>
          <Link to="/notes">
            <button className="primary">Перейти к контактам</button>
          </Link>
        </div>

        <div>
          <img
            src="home.svg"
            alt="Notebook illustration"
            style={{ width: '70vh', height: '70vh' }}
          />
        </div>
      </section>
    </main>
  )
}
