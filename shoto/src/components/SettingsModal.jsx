import React, { useEffect, useRef } from 'react'
import styles from '../styles/modal.module.css'

export const SettingsModal = ({ categories, setCategories, isOpen, onClose }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal()
    } else {
      modalRef.current?.close()
    }
  }, [isOpen])

  return (
    <dialog ref={modalRef} onClose={onClose} open>
      <article className={styles.modal}>
        <header className={styles.modalHeader}>
          <h3>Настройки</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="close"
            style={{ marginLeft: 'auto' }}
          ></button>
        </header>
        <table>
          {Object.entries(categories).map(([name, key]) => (
            <tr key={name}>
              <td>
                <input
                  type="checkbox"
                  checked={key.visible}
                  onChange={(e) => {
                    setCategories((prev) => ({
                      ...prev,
                      [name]: {
                        ...prev[name],
                        visible: e.target.checked
                      }
                    }))
                  }}
                />
              </td>
              <td>{key.label}</td>
            </tr>
          ))}
        </table>
      </article>
    </dialog>
  )
}
