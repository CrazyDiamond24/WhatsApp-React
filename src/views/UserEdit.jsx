import { Component, useEffect, useState } from 'react'
import { userService } from '../services/user.service'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from '../customHooks/useForm'

export function UserEdit(props) {
  const [user, handleChange, setUser] = useForm(userService.getEmptyUser())

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const userId = params.id
    if (userId) {
      try {
        const user = await userService.getById(userId)
        setUser(user)
      } catch (error) {
        console.log('error:', error)
      }
    }
  }

  async function onSaveUser(ev) {
    ev.preventDefault()
    try {
      await userService.save({ ...user })
      navigate('/')
    } catch (error) {
      console.log('error:', error)
    }
  }

  const { fullName } = user
  return (
    <section className='user-edit'>
      <h1>{user._id ? 'Edit' : 'Add'} Contact</h1>
      <form onSubmit={onSaveUser}>
        <label htmlFor='name'>Text</label>
        <input
          value={fullName}
          onChange={handleChange}
          type='text'
          name='fullName'
          id='fullName'
        />

        <button>Save</button>
      </form>
    </section>
  )
}
