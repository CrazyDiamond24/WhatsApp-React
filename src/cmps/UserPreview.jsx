import React from 'react'
import { useDispatch } from 'react-redux'
import { setCurrUser } from '../store/actions/user.actions'
import { useNavigate } from 'react-router-dom'
export function UserPreview({ user, onRemoveUser, onSelectContact }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleClick() {
    console.log('hi')
    console.log('user._id', user._id)
    dispatch(setCurrUser(user._id))
    // navigate()
    // onSelectContact()
  }

  return (
    <article className="contact-preview" onClick={handleClick}>
      <img
        className="contact-preview-image"
        src={user.img}
        alt={user.fullName}
      />
      <h2>{user.fullName}</h2>
    </article>
  )
}

/* <section className='actions'>
<button onClick={() => onRemoveUser(user._id)}>X</button>
<Link to={`/user/edit/${user._id}`}>Edit</Link>
</section> */
