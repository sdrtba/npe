import { useState, useEffect } from 'react'
import { api } from '../api/axiosApi'
import { useAuth } from './useAuth'

export const useGroups = () => {
  const [token] = useAuth()
  const [groups, setGroups] = useState([])

  const getGroups = async () => {
    await api
      .get('/groups', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then(async (response) => {
        setGroups(response.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const deleteGroup = async (id) => {
    await api
      .delete(`/groups/${id}/?group_id=${id}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(async () => {
        await getGroups().then()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const updateGroup = async (group) => {
    const data = {
      name: group.name
    }
    await api
      .put(`/groups/${group.id}/?group_id=${group.id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .then(async () => {
        await getGroups().then()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const createGroup = async (name) => {
    await api
      .post(
        '/groups',
        {
          name: name
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then(async () => {
        await getGroups().then()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    getGroups().then()
  }, [])

  return {
    groups,
    deleteGroup,
    updateGroup,
    createGroup
  }
}
