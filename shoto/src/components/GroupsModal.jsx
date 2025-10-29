import React, { useEffect, useState, useRef } from 'react'
import styles from '../styles/modal.module.css'

export const GroupsModal = ({
  groups,
  isOpen,
  getContacts,
  onClose,
  onCreate,
  onUpdate,
  onDelete
}) => {
  const [name, setName] = useState('')
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal()
    } else {
      modalRef.current?.close()
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onCreate(name)
    setName('')
  }

  const handleSave = async (groupId) => {
    await onUpdate({ id: groupId, name: editingName })
    setEditingGroupId(null)
    setEditingName('')
    await getContacts()
  }

  return (
    <dialog ref={modalRef} onClose={onClose} open>
      <article className={styles.modal}>
        <header className={styles.modalHeader}>
          <h3>Группы</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="close"
            style={{ alignItems: 'center' }}
          ></button>
        </header>
        <table>
          {groups.map((group) => (
            <tr key={group.id}>
              <td className="table-cell-truncate">
                {editingGroupId === group.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    required
                  />
                ) : (
                  <span title={group.name}>{group.name}</span>
                )}
              </td>
              <td style={{ textAlign: 'right' }}>
                {editingGroupId === group.id ? (
                  <>
                    <button onClick={() => handleSave(group.id)} style={{ margin: '8px 12px' }}>
                      ✅
                    </button>
                    <button onClick={() => setEditingGroupId(null)} style={{ margin: '8px 12px' }}>
                      ❌
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingGroupId(group.id)
                      setEditingName(group.name)
                    }}
                    style={{ margin: '8px 12px' }}
                  >
                    ✏️
                  </button>
                )}
                <button
                  onClick={async () => {
                    await onDelete(group.id)
                    await getContacts()
                  }}
                  style={{ margin: '8px 12px' }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </table>
        <form className="container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Группа..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button>Добавить</button>
        </form>
      </article>
    </dialog>
  )
}
