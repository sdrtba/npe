import React, { useMemo, useState } from 'react'

export const ContactsTable = ({ categories, groups, contacts, onUpdate, onDelete }) => {
  const [filterBy, setFilterBy] = useState('first_name')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('date_updated')
  const [sortOrder, setSortOrder] = useState('desc')

  const filteredContacts = useMemo(() => {
    if (!query.trim()) return contacts

    const q = query.toLowerCase()
    return contacts.filter((contact) => {
      const value = contact[filterBy]
      return value != null && String(value).toLowerCase().includes(q)
    })
  }, [contacts, filterBy, query])

  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      const va = a[sortBy] ?? ''
      const vb = b[sortBy] ?? ''
      if (va < vb) return sortOrder === 'asc' ? -1 : 1
      if (va > vb) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredContacts, sortBy, sortOrder])

  // const sortedContacts = [...contacts].sort((a, b) => {
  //   const fieldA = a[sortBy]?.toString() || ''
  //   const fieldB = b[sortBy]?.toString() || ''
  //
  //   if (sortOrder === 'asc') {
  //     return fieldA.localeCompare(fieldB, 'ru') // 'ru' — для кириллицы
  //   } else {
  //     return fieldB.localeCompare(fieldA, 'ru')
  //   }
  // })

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <label>
          Поле:
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            style={{ marginLeft: 4 }}
          >
            {Object.entries(categories)
              .filter(([, cfg]) => cfg.visible)
              .map(([name, cfg]) => (
                <option key={name} value={name}>
                  {cfg.label}
                </option>
              ))}
          </select>
        </label>

        <label>
          Поиск:
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите текст..."
            style={{ marginLeft: 4, padding: '4px 8px' }}
          />
        </label>
      </div>

      <table className="striped">
        <thead>
          <tr>
            {Object.entries(categories).map(
              ([name, key]) =>
                key.visible && (
                  <th key={name}>
                    <button
                      onClick={() => {
                        if (sortBy === name) {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                        } else {
                          setSortBy(name)
                          setSortOrder('asc')
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        padding: '10px'
                      }}
                    >
                      {key.label}
                      <span
                        style={{
                          visibility: sortBy === name ? 'visible' : 'hidden',
                          marginLeft: 4
                        }}
                      >
                        {sortOrder === 'asc' ? '▲' : '▼'}
                      </span>
                    </button>
                  </th>
                )
            )}
            <th style={{ textAlign: 'right' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {sortedContacts.map((contact) => (
            <tr key={contact.id}>
              {categories.group_name.visible && (
                <td className="table-cell-truncate" title={contact.group_name}>
                  {contact.group_name}
                </td>
              )}
              {categories.middle_name.visible && (
                <td className="table-cell-truncate" title={contact.middle_name}>
                  {contact.middle_name}
                </td>
              )}
              {categories.first_name.visible && (
                <td className="table-cell-truncate" title={contact.first_name}>
                  {contact.first_name}
                </td>
              )}
              {categories.last_name.visible && (
                <td className="table-cell-truncate" title={contact.last_name}>
                  {contact.last_name}
                </td>
              )}
              {categories.email.visible && (
                <td className="table-cell-truncate" title={contact.email}>
                  {contact.email}
                </td>
              )}
              {categories.phone.visible && (
                <td className="table-cell-truncate" title={contact.phone}>
                  {contact.phone}
                </td>
              )}
              {categories.date_updated.visible && (
                <td>{new Date(contact.date_updated).toLocaleString()}</td>
              )}
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'right' }}>
                  <button className="secondary" onClick={() => onUpdate(contact.id)}>
                    ✏️
                  </button>
                  <button
                    className="outline"
                    style={{ color: 'crimson' }}
                    onClick={() => onDelete(contact.id)}
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
