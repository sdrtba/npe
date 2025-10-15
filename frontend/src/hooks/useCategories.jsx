import { useState } from 'react'

export const useCategories = () => {
  const [categories, setCategories] = useState({
    group_name: { label: 'Группа', visible: true },
    last_name: { label: 'Фамилия', visible: true },
    first_name: { label: 'Имя', visible: true },
    middle_name: { label: 'Отчество', visible: true },
    email: { label: 'Почта', visible: true },
    phone: { label: 'Телефон', visible: true },
    date_updated: { label: 'Дата обновления', visible: true }
  })

  return { categories, setCategories }
}
