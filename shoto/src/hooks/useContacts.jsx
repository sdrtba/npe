import { useState, useEffect } from 'react'
import { api } from '../api/axiosApi'
import { useAuth } from './useAuth'

export const useContacts = () => {
  const [token] = useAuth()
  const [contacts, setContacts] = useState([])

  const getContacts = async () => {
    await api
      .get('/contacts', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then((response) => {
        setContacts(response.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const deleteContact = async (id) => {
    await api
      .delete(`/contacts/${id}/?contact_id=${id}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(async () => {
        await getContacts().then()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const updateContact = async (contact) => {
    const data = {
      first_name: contact.firstName,
      middle_name: contact.middleName,
      last_name: contact.lastName,
      email: contact.email,
      phone: contact.phone
    }
    if (contact.groupName) data.group_name = contact.groupName
    await api
      .put(`/contacts/${contact.id}/?contact_id=${contact.id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then(async () => {
        await getContacts().then()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const createContact = async (contact) => {
    const data = {
      first_name: contact.firstName,
      middle_name: contact.middleName,
      last_name: contact.lastName,
      email: contact.email,
      phone: contact.phone
    }
    if (contact.groupName) data.group_name = contact.groupName
    await api
      .post('/contacts', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then(async () => {
        await getContacts().then()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    getContacts().then()
  }, [])

  return {
    contacts,
    getContacts,
    deleteContact,
    updateContact,
    createContact
  }
}
