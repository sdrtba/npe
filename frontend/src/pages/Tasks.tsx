import { useState } from 'react'
import { useCategories } from '@/hooks/useCategories'
import styles from '@/styles/Tasks.module.css'

export const Tasks = () => {
  const { categories, loading, error, refetch } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка категорий...</p>
        </div>
      </div>
    )
  }

  // if (error) {
  //   return (
  //     <div className={styles.container}>
  //       <div className={styles.error}>
  //         <p>{error.message}</p>
  //         {error.status && <span className={styles.errorCode}>Код ошибки: {error.status}</span>}
  //         <button onClick={refetch} className={styles.retryBtn}>
  //           Повторить
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои задачи</h1>
        <button className={styles.addCategoryBtn}>+ Добавить категорию</button>
      </div>

      {categories.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <h2>Нет категорий</h2>
          <p>Создайте первую категорию для организации задач</p>
          <button className={styles.createBtn}>Создать категорию</button>
        </div>
      ) : (
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${styles.categoryCard} ${selectedCategory === category.id ? styles.selected : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              style={{ borderLeftColor: '#667eea' }}
            >
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <div className={styles.categoryActions}>
                  <button
                    className={styles.iconBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Логика редактирования
                    }}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.iconBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Логика удаления
                    }}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className={styles.categoryInfo}>
                <span className={styles.taskCount}>0 задач</span>
                <span className={styles.categoryDate}>
                  Создана: {new Date(category.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>

              <button
                className={styles.addTaskBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  // Логика добавления задачи
                }}
              >
                + Добавить задачу
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
