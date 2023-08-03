import { useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addContactToUser } from '../store/actions/user.actions'

export function AddContact(props) {
  const [name, setName] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // useEffect(() => {
  //   loadUser()
  // }, [])

  // async function loadUser() {
  //   const userId = params.id
  //   if (userId) {
  //     try {
  //       const user = await userService.getById(userId)
  //       setUser(user)
  //     } catch (error) {
  //       console.log('error:', error)
  //     }
  //   }
  // }

  function handleChange(e) {
    setName(e.target.value)
  }

  function onAddContact(ev) {
    ev.preventDefault()
    dispatch(addContactToUser(name))
    navigate('/')
  }

  return (
    <section className="user-edit">
      <h1>Add Contact</h1>
      <form onSubmit={onAddContact}>
        <label htmlFor="name">Text</label>
        <input
          value={name}
          onChange={handleChange}
          type="text"
          name="fullName"
          id="fullName"
        />

        <button>Save</button>
      </form>
    </section>
  )
}
