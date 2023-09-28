import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addContactToUser } from '../store/actions/user.actions'
import addIllustration from '../assets/imgs/add-illustration.png'

export function AddContact({ onAdded }) {
  const [name, setName] = useState('')
  const dispatch = useDispatch()

  function handleChange(e) {
    setName(e.target.value)
  }

  function onAddContact(ev) {
    ev.preventDefault()
    dispatch(addContactToUser(name))
    onAdded()
  }

  return (
    <section className="user-edit">
      <h1>Add a New Contact</h1>

      <form onSubmit={onAddContact}>
        <div className="input-container">
          <input
            placeholder="Enter username"
            value={name}
            onChange={handleChange}
            type="text"
            name="fullName"
            id="fullName"
          />
          <button type="submit">Add</button>
        </div>
      </form>
      <img src={addIllustration} alt="Add Contact Illustration" />
    </section>
  )
  }  
