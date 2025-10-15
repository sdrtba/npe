import React, { useEffect, useState, useRef } from 'react'
import styles from '../styles/modal.module.css'
import { useAuth } from '../hooks/useAuth'

export const ContactModal = ({ id, groups, contacts, isOpen, onClose, onCreate, onUpdate }) => {
  const [token] = useAuth()
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [groupName, setGroupName] = useState('')
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal()
    } else {
      modalRef.current?.close()
      cleanFormData()
    }
  }, [isOpen])

  useEffect(() => {
    const fetchContact = async () => {
      const contact = contacts.find((contact) => contact.id === id)
      if (contact) {
        setFirstName(contact.first_name)
        setMiddleName(contact.middle_name)
        setLastName(contact.last_name)
        setEmail(contact.email)
        setPhone(contact.phone)
        setGroupName(contact.group_name) // это поле инициализирует select
      }
    }

    if (id) {
      fetchContact().then()
    }
  }, [id, token])

  const cleanFormData = () => {
    setFirstName('')
    setMiddleName('')
    setLastName('')
    setEmail('')
    setPhone('')
    setGroupName('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const contact = {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      groupName,
      id
    }

    if (id) {
      await onUpdate(contact)
    } else {
      await onCreate(contact)
    }
    cleanFormData()
    onClose()
  }

  return (
    <dialog ref={modalRef} onClose={onClose} open>
      <article className={styles.modal}>
        <header className={styles.modalHeader}>
          <h3>{id ? '✏️ Обновить' : '➕ Создать'}</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="close"
            style={{ alignItems: 'center' }}
          ></button>
        </header>

        <form onSubmit={handleSubmit}>
          <section className={styles.modalForm}>
            <input
              type="text"
              placeholder="Фамилия"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Отчество"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Почта (опционально)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Телефон (опционально)"
              value={phone}
              pattern="^\+?[0-9]{7,15}$"
              onChange={(e) => setPhone(e.target.value)}
            />
            <select name="select" value={groupName} onChange={(e) => setGroupName(e.target.value)}>
              <option value="">Группа…</option>
              {groups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </section>

          <footer
            className={styles.modalFooter}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '1.5rem'
            }}
          >
            {/*<button type="button" onClick={onClose} className="secondary">*/}
            {/*  Отмена*/}
            {/*</button>*/}
            <button type="submit" className={id ? 'contrast' : 'primary'}>
              {id ? 'Обновить' : 'Создать'}
            </button>
          </footer>
        </form>
      </article>
    </dialog>
  )
}
